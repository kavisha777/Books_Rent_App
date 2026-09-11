import { Router } from "express";

import authMiddleware from "../middleware/auth.middleware.js";

import {
  createConditionRecord,
  getConditionRecords,
} from "../controllers/condition.controller.js";

const router = Router();

router.use(authMiddleware);

router.post(
  "/rentals/:id/conditions",
  createConditionRecord
);

router.get(
  "/rentals/:id/conditions",
  getConditionRecords
);

export default router;