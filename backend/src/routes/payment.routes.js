import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { payForRental, } from "../controllers/payment.controller.js";
const router = Router();
router.use(authMiddleware);
router.post("/rentals/:id/pay", payForRental);
export default router;
//# sourceMappingURL=payment.routes.js.map