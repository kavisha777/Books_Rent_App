import type { NextFunction, Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
export declare const createReview: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getRentalReviews: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=review.controller.d.ts.map