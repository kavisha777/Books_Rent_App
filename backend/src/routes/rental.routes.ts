import { Router } from "express";

import authMiddleware from "../middleware/auth.middleware.js";

import {
  createRental,
  getMyRentals,
  getOwnerRentalRequests,
  getRentalById,
  approveRental,
  rejectRental,
  cancelRental,
  requestReturn,
  markHandover,
  startRental,
  startInspection,
  completeRental,
  markLost,
} from "../controllers/rental.controller.js";

const router = Router();

/*
 * All rental routes require authentication.
 */
router.use(authMiddleware);

/*
 * Create rental request
 */
router.post(
  "/",
  createRental
);

/*
 * Renter's rentals
 */
router.get(
  "/my",
  getMyRentals
);

/*
 * Rental requests for owner's books
 */
router.get(
  "/owner",
  getOwnerRentalRequests
);

/*
 * Get one rental
 */
router.get(
  "/:id",
  getRentalById
);

/*
 * Owner actions
 */
router.patch(
  "/:id/approve",
  approveRental
);

router.patch(
  "/:id/reject",
  rejectRental
);

/*
 * Renter actions
 */
router.patch(
  "/:id/cancel",
  cancelRental
);

router.patch(
  "/:id/return",
  requestReturn
);

/*
 * Handover and completion. Either party can confirm the physical
 * handover, since both must be present for it.
 */
router.patch(
  "/:id/handover",
  markHandover
);

router.patch(
  "/:id/start",
  startRental
);

/*
 * Owner confirms the returned copy and closes the rental.
 */
router.patch(
  "/:id/inspect",
  startInspection
);

router.patch(
  "/:id/complete",
  completeRental
);

/*
 * Either party can report the copy lost while it is out.
 */
router.patch(
  "/:id/lost",
  markLost
);

export default router;