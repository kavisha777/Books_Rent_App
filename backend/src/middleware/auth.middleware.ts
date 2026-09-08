import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { JWT_ACCESS_SECRET } from "../config/env.js";
import AppError from "../utils/AppError.js";

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError("Authentication token is required", 401);
    }

    const [type, token] = authHeader.split(" ");

    if (type !== "Bearer" || !token) {
      throw new AppError("Invalid authentication format", 401);
    }

    const decoded = jwt.verify(token, JWT_ACCESS_SECRET as string);

    if (typeof decoded !== "object" || !decoded.userId || !decoded.role) {
      throw new AppError("Invalid authentication token", 401);
    }

    req.user = {
      userId: decoded.userId as string,
      role: decoded.role as string,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError("Invalid or expired authentication token", 401));
      return;
    }

    next(error);
  }
};

export default authMiddleware;