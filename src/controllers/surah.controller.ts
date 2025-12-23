import type { Request, Response, NextFunction } from "express";
import { asyncWrapper } from "../middlewares/asyncWrapper.js";
import { prisma } from "../config/db.js";
import { sendResponse } from "../utils/response.js";
import { AppError } from "../utils/appError.js";
import { httpStatusText } from "../utils/httpStatusText.js";
import { redis } from "../config/redis.js";

export const getAllSurahs = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const cacheKey = `surahs:all`;
    const cached = await redis.get(cacheKey);
    if (cached) return sendResponse(res, 200, "Success", JSON.parse(cached));

    const surahs = await prisma.surah.findMany({
      orderBy: { number: "asc" },
    });

    const responseData = { results: surahs.length, surahs };
    await redis.set(cacheKey, JSON.stringify(responseData), "EX", 86400);

    return sendResponse(res, 200, "Surahs fetched successfully", responseData);
  }
);

export const getSurah = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { number } = req.params;
    const cacheKey: string = `surah:${number}`;
    const cached: string | null = await redis.get(cacheKey);
    if (cached) return sendResponse(res, 200, "Success", JSON.parse(cached));
    const surah = await prisma.surah.findUnique({
      where: { number: parseInt(number) },
      include: {
        ayahs: {
          orderBy: { number: "asc" },
          include: {
            translations: true,
          },
        },
      },
    });
    if (!surah)
      return next(new AppError("Surah not found", 404, httpStatusText.FAIL));

    const responseData = { surah };
    await redis.set(cacheKey, JSON.stringify(responseData), "EX", 86400);

    return sendResponse(res, 200, "Surah details fetched", responseData);
  }
);
