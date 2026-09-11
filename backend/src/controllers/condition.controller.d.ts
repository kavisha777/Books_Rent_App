import type { NextFunction, Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
export declare const createConditionRecord: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getConditionRecords: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=condition.controller.d.ts.map