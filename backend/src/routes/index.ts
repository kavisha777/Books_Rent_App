import { Router } from "express";

import healthRoutes from "./health.routes.js";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import bookRoutes from "./book.routes.js";
import rentalRoutes from "./rental.routes.js";
import paymentRoutes from "./payment.routes.js";
import conditionRoutes from "./condition.routes.js";
import reviewRoutes from "./review.routes.js";
import disputeRoutes from "./dispute.routes.js";
import adminRoutes from "./admin.routes.js";

const router = Router();

router.use(healthRoutes);

router.use(
  "/auth",
  authRoutes
);

router.use(
  "/users",
  userRoutes
);

router.use(
  "/books",
  bookRoutes
);

router.use(
  "/rentals",
  rentalRoutes
);

router.use(
  "/payments",
  paymentRoutes
);

router.use(conditionRoutes);

router.use(reviewRoutes);

router.use(disputeRoutes);

router.use(
  "/admin",
  adminRoutes
);

export default router;