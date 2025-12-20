import type { Response } from "express";
import { httpStatusText } from "./httpStatusText.js";

export type ApiStatus = httpStatusText.SUCCESS | httpStatusText.ERROR;

export interface ApiResponse<T> {
  status: ApiStatus;
  message: string;
  data: T | null;
  meta: any;
}

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
  meta?: any
): Response => {
  const body: ApiResponse<T> = {
    status: statusCode < 400 ? httpStatusText.SUCCESS : httpStatusText.ERROR,
    message,
    data: data ?? null,
    ...(meta && { meta }),
  };
  return res.status(statusCode).json(body);
};
