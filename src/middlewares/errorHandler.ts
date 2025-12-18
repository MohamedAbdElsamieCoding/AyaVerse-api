import type { Request, Response, NextFunction } from "express";
import { httpStatusText } from "../utils/httpStatusText.js";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const statusText = err.statusText || httpStatusText.ERROR;
  res.status(statusCode).json({
    status: statusText,
    message: err.message || "Internal Server Error",
  });
};
