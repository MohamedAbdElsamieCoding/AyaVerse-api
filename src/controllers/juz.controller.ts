import type { Request, Response, NextFunction } from "express";
import { asyncWrapper } from "../middlewares/asyncWrapper.js";
import { sendResponse } from "../utils/response.js";
import { redis } from "../config/redis.js";
import { httpStatusText } from "../utils/httpStatusText.js";
import { AppError } from "../utils/appError.js";
import { prisma } from "../config/db.js";

type Juzs = {
  number: number;
  name: string;
};

export const getAllJuzs = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const cacheKey = `Juz:all`;
    const cached = await redis.get(cacheKey);
    if (cached) return sendResponse(res, 200, "Success", JSON.parse(cached));

    const juzs: Juzs[] = [];
    for (let i = 1; i <= 30; i++) {
      juzs.push({ number: i, name: `Juzs ${i}` });
    }

    const responseData = { results: 30, juzs };

    await redis.set(cacheKey, JSON.stringify(responseData), "EX", 86400);

    return sendResponse(res, 200, "Juzs fetched successfully", responseData);
  }
);

export const getJuz = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { number } = req.params;
    const juzNumber = parseInt(number);

    if (isNaN(juzNumber) || juzNumber < 1 || juzNumber > 30)
      return next(
        new AppError(
          "Invalid Juz number. Must be 1-30",
          400,
          httpStatusText.FAIL
        )
      );

    const cacheKey = `Juz:${juzNumber}`;
    const cached = await redis.get(cacheKey);
    if (cached)
      return sendResponse(res, 200, "Success (Cached)", JSON.parse(cached));

    const ayahs = await prisma.ayah.findMany({
      where: { juzNumber },
      include: {
        surah: {
          select: { nameArabic: true, nameEnglish: true, number: true },
        },
        translations: true,
      },
      orderBy: [{ surah: { number: "asc" } }, { number: "asc" }],
    });
    const responseData = {
      juzNumber,
      count: ayahs.length,
      ayahs,
    };

    await redis.set(cacheKey, JSON.stringify(responseData), "EX", 86400);

    return sendResponse(
      res,
      200,
      `Juz ${juzNumber} fetched successfully`,
      responseData
    );
  }
);
