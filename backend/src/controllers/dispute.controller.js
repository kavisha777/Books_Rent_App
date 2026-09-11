import prisma from "../lib/prisma.js";
import AppError from "../utils/AppError.js";
import { createDisputeSchema } from "../utils/dispute.validation.js";
export const createDispute = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new AppError("Authentication required", 401);
        }
        const rentalId = req.params.id;
        if (typeof rentalId !== "string") {
            throw new AppError("Invalid rental ID", 400);
        }
        const validatedData = createDisputeSchema.safeParse(req.body);
        if (!validatedData.success) {
            throw new AppError(validatedData.error.issues[0]?.message ||
                "Invalid dispute data", 400);
        }
        const rental = await prisma.rental.findUnique({
            where: {
                id: rentalId,
            },
            select: {
                id: true,
                status: true,
                renterId: true,
                ownerId: true,
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
            "ACTIVE",
            "RETURN_PENDING",
            "INSPECTION",
            "COMPLETED",
            "OVERDUE",
            "LOST",
            "DISPUTED",
        ];
        if (!allowedStatuses.includes(rental.status)) {
            throw new AppError("A dispute cannot be created at this stage", 400);
        }
        const existingOpenDispute = await prisma.dispute.findFirst({
            where: {
                rentalId,
                raisedById: req.user.userId,
                status: {
                    in: [
                        "OPEN",
                        "UNDER_REVIEW",
                    ],
                },
            },
        });
        if (existingOpenDispute) {
            throw new AppError("You already have an active dispute for this rental", 400);
        }
        const { reason, description, evidenceUrls, } = validatedData.data;
        const dispute = await prisma.dispute.create({
            data: {
                reason,
                description,
                evidenceUrls: evidenceUrls || [],
                rentalId,
                raisedById: req.user.userId,
            },
        });
        if (rental.status !== "DISPUTED") {
            await prisma.rental.update({
                where: {
                    id: rentalId,
                },
                data: {
                    status: "DISPUTED",
                },
            });
        }
        res.status(201).json({
            success: true,
            message: "Dispute created successfully",
            data: {
                dispute,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
export const getRentalDisputes = async (req, res, next) => {
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
            throw new AppError("You do not have access to these disputes", 403);
        }
        const disputes = await prisma.dispute.findMany({
            where: {
                rentalId,
            },
            include: {
                raisedBy: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        res.status(200).json({
            success: true,
            message: "Disputes retrieved successfully",
            data: {
                disputes,
                count: disputes.length,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=dispute.controller.js.map