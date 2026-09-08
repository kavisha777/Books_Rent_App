const notFoundMiddleware = (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
};
export default notFoundMiddleware;
//# sourceMappingURL=not-found.middleware.js.map