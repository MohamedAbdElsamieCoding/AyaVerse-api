import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/auth.js";
import { AppError } from "../utils/appError.js";
import { httpStatusText } from "../utils/httpStatusText.js";
import { asyncWrapper } from "./asyncWrapper.js";
import { prisma } from "../config/db.js";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
    email?: string;
    name?: string | null;
  };
}

export const protect = asyncWrapper(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeaders = req.headers.authorization;
    if (!authHeaders)
      return next(new AppError("Not authorized", 401, httpStatusText.ERROR));
    const token = authHeaders.split(" ")[1];
    try {
      const decoded = verifyToken(token);
      if (!decoded)
        return next(new AppError("Invalid Token", 401, httpStatusText.FAIL));

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!user) {
        return next(
          new AppError(
            "The user belonging to this token no longer exist.",
            401,
            httpStatusText.FAIL
          )
        );
      }

      req.user = user;
      next();
    } catch (error) {
      return next(new AppError("Not authorized", 401, httpStatusText.FAIL));
    }
  }
);
