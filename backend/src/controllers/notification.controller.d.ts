import type { NextFunction, Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
export declare const getMyNotifications: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const markNotificationAsRead: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const markAllNotificationsAsRead: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=notification.controller.d.ts.map