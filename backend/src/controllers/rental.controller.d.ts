import type { NextFunction, Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
/**
 * Create a rental request
 */
export declare const createRental: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Get renter's rentals
 */
export declare const getMyRentals: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Get rental requests for books owned by the user
 */
export declare const getOwnerRentalRequests: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Get one rental
 */
export declare const getRentalById: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Owner approves rental request
 */
export declare const approveRental: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Owner rejects rental request
 */
export declare const rejectRental: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Renter cancels rental request
 */
export declare const cancelRental: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=rental.controller.d.ts.map