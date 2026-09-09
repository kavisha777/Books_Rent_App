import type { NextFunction, Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
export declare const createBook: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getAllBooks: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getBookById: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const updateBook: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteBook: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=book.controller.d.ts.map