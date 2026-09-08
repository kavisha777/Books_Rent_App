import { Router } from "express";
const router = Router();
router.get("/health", (req, res) => {
    res.json({
        success: true,
        message: "BookLoop API is running",
    });
});
export default router;
//# sourceMappingURL=health.routes.js.map