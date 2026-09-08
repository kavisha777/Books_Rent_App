import jwt from "jsonwebtoken";
import { JWT_ACCESS_SECRET } from "../config/env.js";
import AppError from "../utils/AppError.js";
const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new AppError("Authentication token is required", 401);
        }
        const [type, token] = authHeader.split(" ");
        if (type !== "Bearer" || !token) {
            throw new AppError("Invalid authentication format", 401);
        }
        const decoded = jwt.verify(token, JWT_ACCESS_SECRET);
        if (typeof decoded !== "object" || !decoded.userId || !decoded.role) {
            throw new AppError("Invalid authentication token", 401);
        }
        req.user = {
            userId: decoded.userId,
            role: decoded.role,
        };
        next();
    }
    catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            next(new AppError("Invalid or expired authentication token", 401));
            return;
        }
        next(error);
    }
};
export default authMiddleware;
//# sourceMappingURL=auth.middleware.js.map