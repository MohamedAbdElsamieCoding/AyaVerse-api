import { logger } from "../config/logger.js";
import type { Request, Response, NextFunction } from "express";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { method, ip } = req;
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.http(
      `${method} ${req.originalUrl} ${res.statusCode} - ${duration}ms [IP : ${ip}]`
    );
  });
  next();
};
