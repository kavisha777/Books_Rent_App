import { Router } from "express";
import { login, register, refreshAccessToken, logout, } from "../controllers/auth.controller.js";
import { authRateLimiter, } from "../middleware/rate-limit.middleware.js";
const router = Router();
router.post("/register", authRateLimiter, register);
router.post("/login", authRateLimiter, login);
router.post("/refresh", authRateLimiter, refreshAccessToken);
router.post("/logout", logout);
export default router;
//# sourceMappingURL=auth.routes.js.map