import type { NextFunction, Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
export declare const getAdminStats: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getAllUsers: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getAllBooks: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const updateBookStatus: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getAllRentals: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getAllPayments: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getAllDisputes: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const updateDisputeStatus: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getAllReviews: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteReview: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=admin.controller.d.ts.map