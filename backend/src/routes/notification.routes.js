import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { getMyNotifications, markNotificationAsRead, markAllNotificationsAsRead, } from "../controllers/notification.controller.js";
const router = Router();
router.use(authMiddleware);
router.get("/", getMyNotifications);
router.patch("/read-all", markAllNotificationsAsRead);
router.patch("/:id/read", markNotificationAsRead);
export default router;
//# sourceMappingURL=notification.routes.js.map