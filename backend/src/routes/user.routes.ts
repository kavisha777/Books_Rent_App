import { Router } from "express";

import authMiddleware, {
  type AuthenticatedRequest,
} from "../middleware/auth.middleware.js";

const router = Router();

router.get(
  "/me",
  authMiddleware,
  (req: AuthenticatedRequest, res) => {
    res.json({
      success: true,
      message: "Authenticated user",
      data: {
        user: req.user,
      },
    });
  }
);

export default router;