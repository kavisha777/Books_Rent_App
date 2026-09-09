import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { getMyProfile } from "../controllers/user.controller.js";
const router = Router();
router.get("/me", authMiddleware, getMyProfile);
export default router;
//# sourceMappingURL=user.routes.js.map