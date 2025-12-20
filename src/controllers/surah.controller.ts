import type { Request, Response, NextFunction } from "express";
import { asyncWrapper } from "../middlewares/asyncWrapper.js";
import { prisma } from "../config/db.js";
import { sendResponse } from "../utils/response.js";
import { AppError } from "../utils/appError.js";
import { httpStatusText } from "../utils/httpStatusText.js";

export const getAllSurahs = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const surahs = await prisma.surah.findMany({
      orderBy: { number: "asc" },
    });
    return sendResponse(res, 200, "Surahs fetched successfully", {
      results: surahs.length,
      surahs,
    });
  }
);

export const getSurah = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { number } = req.params;
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
    return sendResponse(res, 200, "Surah details fetched", { surah });
  }
);
