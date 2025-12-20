import type { Response, NextFunction } from "express";
import type { AuthRequest } from "./jwt.js";
import { AppError } from "../utils/appError.js";
import { httpStatusText } from "../utils/httpStatusText.js";

export const restrictTo = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role as string)) {
      return next(
        new AppError(
          "You do not have permission to perform this action",
          403,
          httpStatusText.FAIL
        )
      );
    }
    next();
  };
};
