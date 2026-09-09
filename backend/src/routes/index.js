import { Router } from "express";
import healthRoutes from "./health.routes.js";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import bookRoutes from "./book.routes.js";
import rentalRoutes from "./rental.routes.js";
const router = Router();
router.use(healthRoutes);
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/books", bookRoutes);
router.use("/rentals", rentalRoutes);
export default router;
//# sourceMappingURL=index.js.map