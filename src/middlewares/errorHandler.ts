import type { Request, Response, NextFunction } from "express";
import { sendResponse } from "../utils/response.js";
import { ZodError } from "zod";
import { logger } from "../config/logger.js";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";

  if (err instanceof ZodError) {
    statusCode = 400;
    message = err.issues[0].message;
  }

  if (statusCode >= 500) {
    logger.error(`${message}\n${err.stack}`);
  } else {
    logger.warn(`Client error ${message}`);
  }

  return sendResponse(res, statusCode, message);
};
