import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../middlewares/jwt.js";
import { asyncWrapper } from "../middlewares/asyncWrapper.js";
import { AppError } from "../utils/appError.js";
import { httpStatusText } from "../utils/httpStatusText.js";
import { prisma } from "../config/db.js";
import { sendResponse } from "../utils/response.js";

export const addBookmark = asyncWrapper(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { ayahId } = req.body;
    const userId = req.user?.id;

    if (!userId)
      return next(new AppError("User not found", 404, httpStatusText.FAIL));

    const ayah = await prisma.ayah.findUnique({ where: { id: ayahId } });
    if (!ayah)
      return next(new AppError("Ayah not found", 404, httpStatusText.FAIL));

    try {
      const bookmark = await prisma.bookmark.create({
        data: {
          userId,
          ayahId,
        },
      });
      return sendResponse(res, 201, "Ayah bookmarked successfully", {
        bookmark,
      });
    } catch (error) {
      return next(
        new AppError(
          "You already bookmarked this Ayah",
          400,
          httpStatusText.FAIL
        )
      );
    }
  }
);

export const getMyBookmarks = asyncWrapper(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    if (!userId)
      return next(new AppError("User not found", 404, httpStatusText.FAIL));
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      include: {
        ayah: {
          include: {
            surah: {
              select: { nameArabic: true, nameEnglish: true, number: true },
            },
          },
        },
      },
    });
    return sendResponse(res, 200, "Bookmarks fetched successfully", {
      results: bookmarks.length,
      bookmarks,
    });
  }
);

export const removeBookmark = asyncWrapper(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId)
      return next(new AppError("User not found", 404, httpStatusText.FAIL));
    const bookmark = await prisma.bookmark.findUnique({
      where: { id: parseInt(id) },
    });
    if (!bookmark)
      return next(new AppError("Bookmark not found", 404, httpStatusText.FAIL));
    if (bookmark.userId !== userId)
      return next(
        new AppError(
          "You do not have permission to delete this",
          403,
          httpStatusText.FAIL
        )
      );

    await prisma.bookmark.delete({ where: { id: parseInt(id) } });

    return sendResponse(res, 200, "Bookmark removed", null);
  }
);
