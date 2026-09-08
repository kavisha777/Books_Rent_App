import AppError from "../utils/AppError.js";
const errorMiddleware = (err, req, res, next) => {
    console.error(err);
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
        return;
    }
    res.status(500).json({
        success: false,
        message: "Internal server error",
    });
};
export default errorMiddleware;
//# sourceMappingURL=error.middleware.js.map