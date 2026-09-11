import type { NextFunction, Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
export declare const getAdminStats: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getAllDisputes: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const updateDisputeStatus: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=admin.controller.d.ts.map