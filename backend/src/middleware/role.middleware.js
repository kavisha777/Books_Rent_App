import AppError from "../utils/AppError.js";
const roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            next(new AppError("Authentication required", 401));
            return;
        }
        if (!allowedRoles.includes(req.user.role)) {
            next(new AppError("Access denied", 403));
            return;
        }
        next();
    };
};
export default roleMiddleware;
//# sourceMappingURL=role.middleware.js.map