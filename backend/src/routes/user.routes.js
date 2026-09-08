import { Router } from "express";
import authMiddleware, {} from "../middleware/auth.middleware.js";
const router = Router();
router.get("/me", authMiddleware, (req, res) => {
    res.json({
        success: true,
        message: "Authenticated user",
        data: {
            user: req.user,
        },
    });
});
export default router;
//# sourceMappingURL=user.routes.js.map