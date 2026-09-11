import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { createDispute, getRentalDisputes, } from "../controllers/dispute.controller.js";
const router = Router();
router.use(authMiddleware);
router.post("/rentals/:id/disputes", createDispute);
router.get("/rentals/:id/disputes", getRentalDisputes);
export default router;
//# sourceMappingURL=dispute.routes.js.map