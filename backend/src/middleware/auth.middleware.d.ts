import type { NextFunction, Request, Response } from "express";
export interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        role: string;
    };
}
declare const authMiddleware: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
export default authMiddleware;
//# sourceMappingURL=auth.middleware.d.ts.map