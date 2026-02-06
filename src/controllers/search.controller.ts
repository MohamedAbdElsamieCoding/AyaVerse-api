import type { Request, Response, NextFunction } from "express";
import { asyncWrapper } from "../middlewares/asyncWrapper.js";
import { AppError } from "../utils/appError.js";
import { httpStatusText } from "../utils/httpStatusText.js";
import { prisma } from "../config/db.js";
import { sendResponse } from "../utils/response.js";
import { redis } from "../config/redis.js";
import { SearchResults } from "../types/index.js";

import { normalizeArabic } from "../utils/arabic.js";

export const searchQuran = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { q } = req.query;
    // check that search isn't empty
    if (!q || typeof q !== "string" || q.trim().length === 0)
      return next(
        new AppError("Please provide a search query", 400, httpStatusText.FAIL)
      );
    const query = normalizeArabic(q.toString().trim());
    const cacheKey = `search:q:${query}`;

    const cachedResults = await redis.get(cacheKey);
    if (cachedResults)
      return sendResponse(
        res,
        200,
        "Success",
        JSON.parse(cachedResults) as SearchResults
      );

    const results = await prisma.ayah.findMany({
      where: {
        OR: [
          { textArabicSimple: { contains: query, mode: "insensitive" } },
          {
            translations: {
              some: {
                text: { contains: query, mode: "insensitive" },
              },
            },
          },
        ],
      },
      include: {
        surah: {
          select: { nameArabic: true, nameEnglish: true, number: true },
        },
        translations: true,
      },
      take: 50,
    });

    const responseData: SearchResults = {
      count: results.length,
      query,
      results,
    };
    await redis.set(cacheKey, JSON.stringify(responseData), "EX", 21600);

    return sendResponse(res, 200, "Search results fetched", responseData);
  }
);
