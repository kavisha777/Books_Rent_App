import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { createRental, getMyRentals, getOwnerRentalRequests, getRentalById, approveRental, rejectRental, cancelRental, } from "../controllers/rental.controller.js";
const router = Router();
/*
 * All rental routes require authentication.
 */
router.use(authMiddleware);
/*
 * Create rental request
 */
router.post("/", createRental);
/*
 * Renter's rentals
 */
router.get("/my", getMyRentals);
/*
 * Rental requests for owner's books
 */
router.get("/owner", getOwnerRentalRequests);
/*
 * Get one rental
 */
router.get("/:id", getRentalById);
/*
 * Owner actions
 */
router.patch("/:id/approve", approveRental);
router.patch("/:id/reject", rejectRental);
/*
 * Renter action
 */
router.patch("/:id/cancel", cancelRental);
export default router;
//# sourceMappingURL=rental.routes.js.map