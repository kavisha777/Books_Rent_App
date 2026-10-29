
import { Router } from "express";

import authMiddleware from "../middleware/auth.middleware.js";
import {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
} from "../controllers/book.controller.js";

const router = Router();

// Public: guests can browse books and view details.
router.get("/", getAllBooks);
router.get("/:id", getBookById);

// Protected: authentication is required to manage books.
router.post("/", authMiddleware, createBook);
router.put("/:id", authMiddleware, updateBook);
router.delete("/:id", authMiddleware, deleteBook);

export default router;
