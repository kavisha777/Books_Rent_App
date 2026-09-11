import prisma from "../lib/prisma.js";
import AppError from "../utils/AppError.js";
import { createConditionSchema } from "../utils/condition.validation.js";
export const createConditionRecord = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new AppError("Authentication required", 401);
        }
        const rentalId = req.params.id;
        if (typeof rentalId !== "string") {
            throw new AppError("Invalid rental ID", 400);
        }
        const validatedData = createConditionSchema.safeParse(req.body);
        if (!validatedData.success) {
            throw new AppError(validatedData.error.issues[0]?.message ||
                "Invalid condition data", 400);
        }
        const rental = await prisma.rental.findUnique({
            where: {
                id: rentalId,
            },
            select: {
                id: true,
                renterId: true,
                ownerId: true,
                status: true,
            },
        });
        if (!rental) {
            throw new AppError("Rental not found", 404);
        }
        const isRenter = rental.renterId === req.user.userId;
        const isOwner = rental.ownerId === req.user.userId;
        if (!isRenter && !isOwner) {
            throw new AppError("You do not have access to this rental", 403);
        }
        const allowedStatuses = [
            "CONFIRMED",
            "HANDOVER_PENDING",
            "ACTIVE",
            "RETURN_PENDING",
            "INSPECTION",
        ];
        if (!allowedStatuses.includes(rental.status)) {
            throw new AppError("A condition record cannot be created at this stage", 400);
        }
        const { status, notes, imageUrls, } = validatedData.data;
        const conditionRecord = await prisma.conditionRecord.create({
            data: {
                status,
                notes: notes || null,
                imageUrls: imageUrls || [],
                rentalId,
            },
        });
        res.status(201).json({
            success: true,
            message: "Condition record created successfully",
            data: {
                conditionRecord,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
export const getConditionRecords = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new AppError("Authentication required", 401);
        }
        const rentalId = req.params.id;
        if (typeof rentalId !== "string") {
            throw new AppError("Invalid rental ID", 400);
        }
        const rental = await prisma.rental.findUnique({
            where: {
                id: rentalId,
            },
            select: {
                id: true,
                renterId: true,
                ownerId: true,
            },
        });
        if (!rental) {
            throw new AppError("Rental not found", 404);
        }
        const isRenter = rental.renterId === req.user.userId;
        const isOwner = rental.ownerId === req.user.userId;
        const isAdmin = req.user.role === "ADMIN";
        if (!isRenter && !isOwner && !isAdmin) {
            throw new AppError("You do not have access to these condition records", 403);
        }
        const conditionRecords = await prisma.conditionRecord.findMany({
            where: {
                rentalId,
            },
            orderBy: {
                createdAt: "asc",
            },
        });
        res.status(200).json({
            success: true,
            message: "Condition records retrieved successfully",
            data: {
                conditionRecords,
                count: conditionRecords.length,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=condition.controller.js.map