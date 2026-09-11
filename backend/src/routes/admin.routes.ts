import { Router } from "express";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

import {
  getAdminStats,
  getAllDisputes,
  updateDisputeStatus,
} from "../controllers/admin.controller.js";

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware("ADMIN"));

router.get(
  "/stats",
  getAdminStats
);

router.get(
  "/disputes",
  getAllDisputes
);

router.patch(
  "/disputes/:id",
  updateDisputeStatus
);

export default router;