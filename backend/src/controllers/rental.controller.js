import { RentalStatus } from "@prisma/client";
import prisma from "../lib/prisma.js";
import AppError from "../utils/AppError.js";
import { createRentalSchema } from "../utils/rental.validation.js";
import { emitNotification } from "../services/notification.service.js";
const ACTIVE_RENTAL_STATUSES = [
    RentalStatus.REQUESTED,
    RentalStatus.APPROVED,
    RentalStatus.PAYMENT_PENDING,
    RentalStatus.CONFIRMED,
    RentalStatus.HANDOVER_PENDING,
    RentalStatus.ACTIVE,
    RentalStatus.RETURN_PENDING,
    RentalStatus.INSPECTION,
    RentalStatus.OVERDUE,
    RentalStatus.DISPUTED,
];
const calculateRentalDays = (startDate, endDate) => {
    const difference = endDate.getTime() - startDate.getTime();
    const days = Math.ceil(difference / (1000 * 60 * 60 * 24));
    return Math.max(days, 1);
};
export const createRental = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new AppError("Authentication required", 401);
        }
        const validatedData = createRentalSchema.safeParse(req.body);
        if (!validatedData.success) {
            throw new AppError(validatedData.error.issues[0]?.message ||
                "Invalid rental data", 400);
        }
        const { bookId, startDate: startDateString, endDate: endDateString, } = validatedData.data;
        const startDate = new Date(startDateString);
        const endDate = new Date(endDateString);
        if (startDate <= new Date()) {
            throw new AppError("Rental start date must be in the future", 400);
        }
        const book = await prisma.book.findUnique({
            where: {
                id: bookId,
            },
            select: {
                id: true,
                title: true,
                ownerId: true,
                status: true,
                dailyRate: true,
                securityDeposit: true,
            },
        });
        if (!book) {
            throw new AppError("Book not found", 404);
        }
        if (book.ownerId === req.user.userId) {
            throw new AppError("You cannot rent your own book", 400);
        }
        if (book.status !== "AVAILABLE") {
            throw new AppError("This book is currently unavailable", 400);
        }
        if (book.dailyRate.lessThanOrEqualTo(0)) {
            throw new AppError("This book does not have a valid rental price", 400);
        }
        const overlappingRental = await prisma.rental.findFirst({
            where: {
                bookId,
                status: {
                    in: ACTIVE_RENTAL_STATUSES,
                },
                startDate: {
                    lt: endDate,
                },
                endDate: {
                    gt: startDate,
                },
            },
        });
        if (overlappingRental) {
            throw new AppError("This book is already requested or rented for the selected dates", 409);
        }
        const rentalDays = calculateRentalDays(startDate, endDate);
        const rentalAmount = Number(book.dailyRate) * rentalDays;
        const rental = await prisma.rental.create({
            data: {
                bookId: book.id,
                renterId: req.user.userId,
                ownerId: book.ownerId,
                startDate,
                endDate,
                dailyRate: book.dailyRate,
                rentalAmount,
                securityDeposit: book.securityDeposit,
                status: RentalStatus.REQUESTED,
                paymentStatus: "PENDING",
            },
            include: {
                book: {
                    select: {
                        id: true,
                        title: true,
                        author: true,
                    },
                },
                owner: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                renter: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        await emitNotification([book.ownerId], {
            type: "RENTAL_REQUEST",
            title: "New rental request",
            message: `${rental.renter.name} requested "${book.title}" from ${rentalDays} day(s).`,
            href: `/rentals/${rental.id}`,
            rentalId: rental.id,
        });
        res.status(201).json({
            success: true,
            message: "Rental request created successfully",
            data: {
                rental,
                rentalDays,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
export const getMyRentals = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new AppError("Authentication required", 401);
        }
        const rentals = await prisma.rental.findMany({
            where: {
                renterId: req.user.userId,
            },
            orderBy: {
                createdAt: "desc",
            },
            include: {
                book: {
                    select: {
                        id: true,
                        title: true,
                        author: true,
                        dailyRate: true,
                        securityDeposit: true,
                    },
                },
                owner: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        res.status(200).json({
            success: true,
            message: "Your rentals retrieved successfully",
            data: {
                rentals,
                count: rentals.length,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
export const getOwnerRentalRequests = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new AppError("Authentication required", 401);
        }
        const rentals = await prisma.rental.findMany({
            where: {
                ownerId: req.user.userId,
            },
            orderBy: {
                createdAt: "desc",
            },
            include: {
                book: {
                    select: {
                        id: true,
                        title: true,
                        author: true,
                    },
                },
                renter: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        res.status(200).json({
            success: true,
            message: "Owner rental requests retrieved successfully",
            data: {
                rentals,
                count: rentals.length,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
export const getRentalById = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new AppError("Authentication required", 401);
        }
        const id = req.params.id;
        if (typeof id !== "string") {
            throw new AppError("Invalid rental ID", 400);
        }
        const rental = await prisma.rental.findUnique({
            where: {
                id,
            },
            include: {
                book: {
                    select: {
                        id: true,
                        title: true,
                        author: true,
                        isbn: true,
                        condition: true,
                        dailyRate: true,
                        securityDeposit: true,
                    },
                },
                renter: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                owner: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                conditionRecords: true,
                payments: true,
                disputes: true,
                reviews: true,
            },
        });
        if (!rental) {
            throw new AppError("Rental not found", 404);
        }
        const isRenter = rental.renterId === req.user.userId;
        const isOwner = rental.ownerId === req.user.userId;
        const isAdmin = req.user.role === "ADMIN";
        if (!isRenter && !isOwner && !isAdmin) {
            throw new AppError("You do not have access to this rental", 403);
        }
        res.status(200).json({
            success: true,
            message: "Rental retrieved successfully",
            data: {
                rental,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
export const approveRental = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new AppError("Authentication required", 401);
        }
        const id = req.params.id;
        if (typeof id !== "string") {
            throw new AppError("Invalid rental ID", 400);
        }
        const rental = await prisma.rental.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                ownerId: true,
                renterId: true,
                status: true,
                bookId: true,
            },
        });
        if (!rental) {
            throw new AppError("Rental not found", 404);
        }
        if (rental.ownerId !== req.user.userId) {
            throw new AppError("Only the book owner can approve this rental", 403);
        }
        if (rental.status !== RentalStatus.REQUESTED) {
            throw new AppError("Only requested rentals can be approved", 400);
        }
        const approvedRental = await prisma.rental.update({
            where: {
                id,
            },
            data: {
                status: RentalStatus.APPROVED,
                approvedAt: new Date(),
            },
            include: {
                book: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
                renter: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        await emitNotification([approvedRental.renterId], {
            type: "APPROVED",
            title: "Rental request approved",
            message: `Your rental of "${approvedRental.book.title}" was approved. Complete payment to confirm it.`,
            href: `/rentals/${approvedRental.id}`,
            rentalId: approvedRental.id,
        });
        res.status(200).json({
            success: true,
            message: "Rental request approved",
            data: {
                rental: approvedRental,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
export const rejectRental = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new AppError("Authentication required", 401);
        }
        const id = req.params.id;
        if (typeof id !== "string") {
            throw new AppError("Invalid rental ID", 400);
        }
        const rental = await prisma.rental.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                ownerId: true,
                status: true,
            },
        });
        if (!rental) {
            throw new AppError("Rental not found", 404);
        }
        if (rental.ownerId !== req.user.userId) {
            throw new AppError("Only the book owner can reject this rental", 403);
        }
        if (rental.status !== RentalStatus.REQUESTED) {
            throw new AppError("Only requested rentals can be rejected", 400);
        }
        const rejectedRental = await prisma.rental.update({
            where: {
                id,
            },
            data: {
                status: RentalStatus.REJECTED,
            },
            include: {
                book: {
                    select: {
                        title: true,
                    },
                },
            },
        });
        await emitNotification([rejectedRental.renterId], {
            type: "REJECTED",
            title: "Rental request rejected",
            message: `"${rejectedRental.book.title}" is no longer available for your requested dates.`,
            href: `/rentals/${rejectedRental.id}`,
            rentalId: rejectedRental.id,
        });
        res.status(200).json({
            success: true,
            message: "Rental request rejected",
            data: {
                rental: rejectedRental,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
export const cancelRental = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new AppError("Authentication required", 401);
        }
        const id = req.params.id;
        if (typeof id !== "string") {
            throw new AppError("Invalid rental ID", 400);
        }
        const rental = await prisma.rental.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                renterId: true,
                ownerId: true,
                status: true,
                book: {
                    select: {
                        title: true,
                    },
                },
            },
        });
        if (!rental) {
            throw new AppError("Rental not found", 404);
        }
        if (rental.renterId !== req.user.userId) {
            throw new AppError("Only the renter can cancel this rental", 403);
        }
        const cancellableStatuses = [
            RentalStatus.REQUESTED,
            RentalStatus.APPROVED,
            RentalStatus.PAYMENT_PENDING,
        ];
        if (!cancellableStatuses.includes(rental.status)) {
            throw new AppError("This rental can no longer be cancelled", 400);
        }
        const cancelledRental = await prisma.rental.update({
            where: {
                id,
            },
            data: {
                status: RentalStatus.CANCELLED,
            },
        });
        await emitNotification([rental.ownerId], {
            type: "CANCELLED",
            title: "Rental request cancelled",
            message: `Your request for "${rental.book.title}" was cancelled.`,
            href: `/rentals/${cancelledRental.id}`,
            rentalId: cancelledRental.id,
        });
        res.status(200).json({
            success: true,
            message: "Rental cancelled successfully",
            data: {
                rental: cancelledRental,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
export const markHandover = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new AppError("Authentication required", 401);
        }
        const id = req.params.id;
        if (typeof id !== "string") {
            throw new AppError("Invalid rental ID", 400);
        }
        const rental = await prisma.rental.findUnique({
            where: { id },
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
        const isOwner = rental.ownerId === req.user.userId;
        const isRenter = rental.renterId === req.user.userId;
        if (!isOwner && !isRenter) {
            throw new AppError("You do not have access to this rental", 403);
        }
        if (rental.status !== RentalStatus.CONFIRMED) {
            throw new AppError("Only confirmed rentals can proceed to handover", 400);
        }
        const updatedRental = await prisma.rental.update({
            where: { id },
            data: {
                status: RentalStatus.HANDOVER_PENDING,
            },
            include: {
                book: { select: { title: true } },
            },
        });
        await emitNotification([updatedRental.renterId, updatedRental.ownerId], {
            type: "HANDOVER",
            title: "Handover arranged",
            message: `"${updatedRental.book.title}" is ready to be handed over.`,
            href: `/rentals/${updatedRental.id}`,
            rentalId: updatedRental.id,
        });
        res.status(200).json({
            success: true,
            message: "Rental moved to handover",
            data: {
                rental: updatedRental,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
export const startRental = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new AppError("Authentication required", 401);
        }
        const id = req.params.id;
        if (typeof id !== "string") {
            throw new AppError("Invalid rental ID", 400);
        }
        const rental = await prisma.rental.findUnique({
            where: { id },
            select: {
                id: true,
                renterId: true,
                ownerId: true,
                status: true,
                bookId: true,
                endDate: true,
                book: {
                    select: {
                        title: true,
                    },
                },
            },
        });
        if (!rental) {
            throw new AppError("Rental not found", 404);
        }
        const isOwner = rental.ownerId === req.user.userId;
        const isRenter = rental.renterId === req.user.userId;
        if (!isOwner && !isRenter) {
            throw new AppError("You do not have access to this rental", 403);
        }
        if (rental.status !== RentalStatus.HANDOVER_PENDING) {
            throw new AppError("Rental must be in handover status first", 400);
        }
        await prisma.$transaction(async (tx) => {
            await tx.rental.update({
                where: { id },
                data: {
                    status: RentalStatus.ACTIVE,
                    handoverAt: new Date(),
                },
            });
            // A single physical copy cannot take another booking while it is out,
            // even for a window that does not overlap the current one.
            await tx.book.update({
                where: { id: rental.bookId },
                data: {
                    status: "UNAVAILABLE",
                },
            });
        });
        await emitNotification([rental.renterId, rental.ownerId], {
            type: "HANDOVER",
            title: "Rental started",
            message: `"${rental.book.title}" is now on loan until ${rental.endDate.toDateString()}.`,
            href: `/rentals/${rental.id}`,
            rentalId: rental.id,
        });
        const startedRental = await prisma.rental.findUnique({
            where: { id },
        });
        res.status(200).json({
            success: true,
            message: "Rental started successfully",
            data: {
                rental: startedRental,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
export const requestReturn = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new AppError("Authentication required", 401);
        }
        const id = req.params.id;
        if (typeof id !== "string") {
            throw new AppError("Invalid rental ID", 400);
        }
        const rental = await prisma.rental.findUnique({
            where: { id },
            select: {
                id: true,
                renterId: true,
                ownerId: true,
                status: true,
                renter: {
                    select: {
                        name: true,
                    },
                },
                book: {
                    select: {
                        title: true,
                    },
                },
            },
        });
        if (!rental) {
            throw new AppError("Rental not found", 404);
        }
        if (rental.renterId !== req.user.userId) {
            throw new AppError("Only the renter can request a return", 403);
        }
        if (rental.status !== RentalStatus.ACTIVE &&
            rental.status !== RentalStatus.OVERDUE) {
            throw new AppError("Only active or overdue rentals can be returned", 400);
        }
        const updatedRental = await prisma.rental.update({
            where: { id },
            data: {
                status: RentalStatus.RETURN_PENDING,
            },
        });
        await emitNotification([rental.ownerId], {
            type: "RETURN",
            title: "Return requested",
            message: `${rental.renter.name} has returned "${rental.book.title}". Please inspect it.`,
            href: `/rentals/${rental.id}`,
            rentalId: rental.id,
        });
        res.status(200).json({
            success: true,
            message: "Book return requested",
            data: {
                rental: updatedRental,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
export const startInspection = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new AppError("Authentication required", 401);
        }
        const id = req.params.id;
        if (typeof id !== "string") {
            throw new AppError("Invalid rental ID", 400);
        }
        const rental = await prisma.rental.findUnique({
            where: { id },
            select: {
                id: true,
                ownerId: true,
                renterId: true,
                status: true,
                book: {
                    select: {
                        title: true,
                    },
                },
            },
        });
        if (!rental) {
            throw new AppError("Rental not found", 404);
        }
        if (rental.ownerId !== req.user.userId) {
            throw new AppError("Only the book owner can inspect the returned book", 403);
        }
        if (rental.status !== RentalStatus.RETURN_PENDING) {
            throw new AppError("Book must be returned before inspection", 400);
        }
        const updatedRental = await prisma.rental.update({
            where: { id },
            data: {
                status: RentalStatus.INSPECTION,
                returnedAt: new Date(),
            },
        });
        await emitNotification([rental.renterId], {
            type: "RETURN",
            title: "Inspection started",
            message: `The owner is inspecting "${rental.book.title}" you returned.`,
            href: `/rentals/${rental.id}`,
            rentalId: rental.id,
        });
        res.status(200).json({
            success: true,
            message: "Book moved to inspection",
            data: {
                rental: updatedRental,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
export const completeRental = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new AppError("Authentication required", 401);
        }
        const id = req.params.id;
        if (typeof id !== "string") {
            throw new AppError("Invalid rental ID", 400);
        }
        const rental = await prisma.rental.findUnique({
            where: { id },
            select: {
                id: true,
                ownerId: true,
                renterId: true,
                status: true,
                bookId: true,
                book: {
                    select: {
                        title: true,
                    },
                },
            },
        });
        if (!rental) {
            throw new AppError("Rental not found", 404);
        }
        if (rental.ownerId !== req.user.userId) {
            throw new AppError("Only the book owner can complete the inspection", 403);
        }
        if (rental.status !== RentalStatus.INSPECTION) {
            throw new AppError("Rental must be under inspection before completion", 400);
        }
        const completedRental = await prisma.$transaction(async (tx) => {
            const updatedRental = await tx.rental.update({
                where: { id },
                data: {
                    status: RentalStatus.COMPLETED,
                    completedAt: new Date(),
                },
            });
            await tx.book.update({
                where: {
                    id: rental.bookId,
                },
                data: {
                    status: "AVAILABLE",
                },
            });
            return updatedRental;
        });
        await emitNotification([rental.renterId], {
            type: "COMPLETED",
            title: "Rental completed",
            message: `"${rental.book.title}" has been marked received and your rental is closed. Leave a review for the owner.`,
            href: `/rentals/${rental.id}`,
            rentalId: rental.id,
        });
        res.status(200).json({
            success: true,
            message: "Rental completed successfully",
            data: {
                rental: completedRental,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
export const markLost = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new AppError("Authentication required", 401);
        }
        const id = req.params.id;
        if (typeof id !== "string") {
            throw new AppError("Invalid rental ID", 400);
        }
        const notes = typeof req.body?.notes === "string"
            ? req.body.notes.trim()
            : "";
        const rental = await prisma.rental.findUnique({
            where: { id },
            select: {
                id: true,
                renterId: true,
                ownerId: true,
                status: true,
                bookId: true,
                book: {
                    select: {
                        title: true,
                    },
                },
            },
        });
        if (!rental) {
            throw new AppError("Rental not found", 404);
        }
        const isOwner = rental.ownerId === req.user.userId;
        const isRenter = rental.renterId === req.user.userId;
        if (!isOwner && !isRenter) {
            throw new AppError("You do not have access to this rental", 403);
        }
        const lostFromStatuses = [
            RentalStatus.ACTIVE,
            RentalStatus.OVERDUE,
            RentalStatus.RETURN_PENDING,
        ];
        if (!lostFromStatuses.includes(rental.status)) {
            throw new AppError("A book can only be reported lost while it is out on loan", 400);
        }
        const reporter = isRenter ? "renter" : "owner";
        await prisma.$transaction(async (tx) => {
            await tx.rental.update({
                where: { id },
                data: {
                    status: RentalStatus.LOST,
                },
            });
            await tx.conditionRecord.create({
                data: {
                    status: "LOST",
                    notes: notes || `Reported ${reporter} as lost.`,
                    rentalId: id,
                },
            });
            // The copy never comes back, so it stays off the catalogue.
            await tx.book.update({
                where: { id: rental.bookId },
                data: {
                    status: "UNAVAILABLE",
                },
            });
        });
        await emitNotification([rental.renterId, rental.ownerId], {
            type: "LOST",
            title: "Book reported lost",
            message: `"${rental.book.title}" has been marked lost by the ${reporter}.`,
            href: `/rentals/${rental.id}`,
            rentalId: rental.id,
        });
        const lostRental = await prisma.rental.findUnique({
            where: { id },
        });
        res.status(200).json({
            success: true,
            message: "Rental marked as lost",
            data: {
                rental: lostRental,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=rental.controller.js.map