
import { Router } from "express";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

import {
  getAdminStats,
  getAllUsers,
  getAllBooks,
  updateBookStatus,
  getAllRentals,
  getAllPayments,
  getAllDisputes,
  updateDisputeStatus,
  getAllReviews,
  deleteReview,
} from "../controllers/admin.controller.js";

const router = Router();

// All admin endpoints require authentication and ADMIN role.
router.use(authMiddleware);
router.use(roleMiddleware("ADMIN"));

// Dashboard
router.get("/stats", getAdminStats);

// Users
router.get("/users", getAllUsers);

// Books
router.get("/books", getAllBooks);
router.patch("/books/:id/status", updateBookStatus);

// Rentals
router.get("/rentals", getAllRentals);

// Payments
router.get("/payments", getAllPayments);

// Disputes
router.get("/disputes", getAllDisputes);
router.patch("/disputes/:id", updateDisputeStatus);

// Reviews
router.get("/reviews", getAllReviews);
router.delete("/reviews/:id", deleteReview);

export default router;
