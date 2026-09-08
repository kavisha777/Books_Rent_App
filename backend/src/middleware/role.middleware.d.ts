import type { NextFunction, Response } from "express";
import type { AuthenticatedRequest } from "./auth.middleware.js";
declare const roleMiddleware: (...allowedRoles: string[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
export default roleMiddleware;
//# sourceMappingURL=role.middleware.d.ts.map