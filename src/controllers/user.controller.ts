import type { Response, NextFunction } from "express";
import { asyncWrapper } from "../middlewares/asyncWrapper.js";
import { prisma } from "../config/db.js";
import { AppError } from "../utils/appError.js";
import { httpStatusText } from "../utils/httpStatusText.js";
import {
  comparePassword,
  generateToken,
  hashedPassword,
} from "../utils/auth.js";
import { sendResponse } from "../utils/response.js";
import { loginSchema, registerSchema } from "../schemas/user.schema.js";
import type { AuthRequest } from "../middlewares/jwt.js";
import { logger } from "../config/logger.js";
import { redis } from "../config/redis.js";

// Register controller
export const register = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const validatedData = registerSchema.parse(req.body);
    const { name, email, password } = validatedData;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return next(new AppError("User already exist", 400, httpStatusText.FAIL));
    const hash = await hashedPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hash,
      },
    });

    const token = generateToken(user.id);

    logger.info(`New user registered : ${email}`);

    return sendResponse(res, 201, "User registered successfully", {
      user: { id: user.id, email: user.email, name: user.name },
      token,
    });
  }
);

// Login controller
export const login = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return next(
        new AppError("Invalid credentials", 401, httpStatusText.FAIL)
      );
    const isPasswordMatch = await comparePassword(password, user.password);
    if (!isPasswordMatch)
      return next(
        new AppError("Invalid credentials", 401, httpStatusText.FAIL)
      );

    const token = generateToken(user.id);
    return sendResponse(res, 200, "Login successfully", {
      user: { id: user.id, email: user.email, name: user.name },
      token,
    });
  }
);

// Get current user profile
export const getMe = asyncWrapper(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true },
    });
    if (!user)
      return next(new AppError("User not found", 404, httpStatusText.FAIL));
    return sendResponse(res, 200, "User profile fetched", { user });
  }
);

// Update continue reading
export const updateContinueReading = asyncWrapper(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { surahNumber, ayahNumber } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user?.id },
      data: {
        lastReadAyah: ayahNumber,
        lastReadSurah: surahNumber,
      },
    });

    const responseData = {
      lastReadSurah: updatedUser.lastReadSurah,
      lastReadAyah: updatedUser.lastReadAyah,
    };

    const cacheKey = `user:${req.user?.id}`;
    await redis.set(cacheKey, JSON.stringify(updatedUser), "EX", 3600);

    return sendResponse(res, 200, "Progress saved successfully", responseData);
  }
);
