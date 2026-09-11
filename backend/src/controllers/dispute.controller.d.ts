import type { NextFunction, Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
export declare const createDispute: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getRentalDisputes: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=dispute.controller.d.ts.map