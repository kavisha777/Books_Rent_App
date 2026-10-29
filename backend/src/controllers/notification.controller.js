import prisma from "../lib/prisma.js";
import AppError from "../utils/AppError.js";
import { getNotifications } from "../services/notification.service.js";
export const getMyNotifications = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new AppError("Authentication required", 401);
        }
        const unreadOnly = req.query.unreadOnly === "true";
        const limit = Number(req.query.limit);
        const notifications = await getNotifications(req.user.userId, {
            unreadOnly,
            limit: Number.isFinite(limit) && limit > 0 ? limit : undefined,
        });
        const unreadCount = await prisma.notification.count({
            where: {
                userId: req.user.userId,
                read: false,
            },
        });
        res.status(200).json({
            success: true,
            message: "Notifications retrieved successfully",
            data: {
                notifications,
                unreadCount,
                count: notifications.length,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
export const markNotificationAsRead = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new AppError("Authentication required", 401);
        }
        const id = req.params.id;
        if (typeof id !== "string") {
            throw new AppError("Invalid notification ID", 400);
        }
        // Scoped on userId so one user cannot flip another's notification.
        const updated = await prisma.notification.updateMany({
            where: {
                id,
                userId: req.user.userId,
            },
            data: {
                read: true,
            },
        });
        if (updated.count === 0) {
            throw new AppError("Notification not found", 404);
        }
        const notification = await prisma.notification.findUnique({
            where: {
                id,
            },
        });
        res.status(200).json({
            success: true,
            message: "Notification marked as read",
            data: {
                notification,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
export const markAllNotificationsAsRead = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new AppError("Authentication required", 401);
        }
        const result = await prisma.notification.updateMany({
            where: {
                userId: req.user.userId,
                read: false,
            },
            data: {
                read: true,
            },
        });
        res.status(200).json({
            success: true,
            message: "All notifications marked as read",
            data: {
                updated: result.count,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=notification.controller.js.map