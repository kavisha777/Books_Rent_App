import type { Response } from "express";

export const successResponse = (
  res: Response,
  message: string,
  data?: unknown,
  statusCode = 200
) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};