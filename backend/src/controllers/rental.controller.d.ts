import type { NextFunction, Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
export declare const createRental: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getMyRentals: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getOwnerRentalRequests: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getRentalById: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const approveRental: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const rejectRental: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const cancelRental: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const markHandover: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const startRental: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const requestReturn: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const startInspection: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const completeRental: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=rental.controller.d.ts.map