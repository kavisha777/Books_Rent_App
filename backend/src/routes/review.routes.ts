import { Router } from "express";

import authMiddleware from "../middleware/auth.middleware.js";

import {
  createReview,
  getRentalReviews,
} from "../controllers/review.controller.js";

const router = Router();

router.use(authMiddleware);

router.post(
  "/rentals/:id/reviews",
  createReview
);

router.get(
  "/rentals/:id/reviews",
  getRentalReviews
);

export default router;