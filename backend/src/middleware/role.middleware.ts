import type { NextFunction, Response } from "express";

import AppError from "../utils/AppError.js";
import type { AuthenticatedRequest } from "./auth.middleware.js";

const roleMiddleware = (...allowedRoles: string[]) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user) {
      next(new AppError("Authentication required", 401));
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      next(new AppError("Access denied", 403));
      return;
    }

    next();
  };
};

export default roleMiddleware;