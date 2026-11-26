import prisma from "../lib/prisma.js";
import AppError from "../utils/AppError.js";
import { emitNotification } from "../services/notification.service.js";
// ==================================================
// DASHBOARD STATISTICS
// ==================================================
export const getAdminStats = async (req, res, next) => {
    try {
        const [totalUsers, totalBooks, totalRentals, activeRentals, totalPayments, openDisputes,] = await Promise.all([
            prisma.user.count(),
            prisma.book.count(),
            prisma.rental.count(),
            prisma.rental.count({
                where: {
                    status: {
                        in: [
                            "CONFIRMED",
                            "HANDOVER_PENDING",
                            "ACTIVE",
                            "RETURN_PENDING",
                            "INSPECTION",
                            "OVERDUE",
                        ],
                    },
                },
            }),
            prisma.payment.count(),
            prisma.dispute.count({
                where: {
                    status: {
                        in: ["OPEN", "UNDER_REVIEW"],
                    },
                },
            }),
        ]);
        res.status(200).json({
            success: true,
            message: "Admin statistics retrieved successfully",
            data: {
                totalUsers,
                totalBooks,
                totalRentals,
                activeRentals,
                totalPayments,
                openDisputes,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
// ==================================================
// USERS
// ==================================================
export const getAllUsers = async (req, res, next) => {
    try {
        const search = typeof req.query.search === "string"
            ? req.query.search.trim()
            : "";
        const users = await prisma.user.findMany({
            ...(search
                ? {
                    where: {
                        OR: [
                            {
                                name: {
                                    contains: search,
                                    mode: "insensitive",
                                },
                            },
                            {
                                email: {
                                    contains: search,
                                    mode: "insensitive",
                                },
                            },
                        ],
                    },
                }
                : {}),
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                _count: {
                    select: {
                        booksOwned: true,
                        rentals: true,
                        rentalsAsOwner: true,
                        reviewsGiven: true,
                        reviewsReceived: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: {
                users,
                count: users.length,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
// ==================================================
// BOOKS
// ==================================================
export const getAllBooks = async (req, res, next) => {
    try {
        const search = typeof req.query.search === "string"
            ? req.query.search.trim()
            : "";
        const books = await prisma.book.findMany({
            ...(search
                ? {
                    where: {
                        OR: [
                            {
                                title: {
                                    contains: search,
                                    mode: "insensitive",
                                },
                            },
                            {
                                author: {
                                    contains: search,
                                    mode: "insensitive",
                                },
                            },
                            {
                                owner: {
                                    name: {
                                        contains: search,
                                        mode: "insensitive",
                                    },
                                },
                            },
                            {
                                owner: {
                                    email: {
                                        contains: search,
                                        mode: "insensitive",
                                    },
                                },
                            },
                        ],
                    },
                }
                : {}),
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                _count: {
                    select: {
                        rentals: true,
                        reviews: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        res.status(200).json({
            success: true,
            message: "Books retrieved successfully",
            data: {
                books,
                count: books.length,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
// Update book availability
export const updateBookStatus = async (req, res, next) => {
    try {
        const bookId = req.params.id;
        if (typeof bookId !== "string") {
            throw new AppError("Invalid book ID", 400);
        }
        const { status } = req.body;
        if (status !== "AVAILABLE" &&
            status !== "UNAVAILABLE") {
            throw new AppError("Invalid book status", 400);
        }
        const existingBook = await prisma.book.findUnique({
            where: {
                id: bookId,
            },
        });
        if (!existingBook) {
            throw new AppError("Book not found", 404);
        }
        const book = await prisma.book.update({
            where: {
                id: bookId,
            },
            data: {
                status,
            },
            include: {
                owner: {
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
            message: "Book status updated successfully",
            data: {
                book,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
// ==================================================
// RENTALS
// ==================================================
export const getAllRentals = async (req, res, next) => {
    try {
        const search = typeof req.query.search === "string"
            ? req.query.search.trim()
            : "";
        const rentals = await prisma.rental.findMany({
            ...(search
                ? {
                    where: {
                        OR: [
                            {
                                book: {
                                    title: {
                                        contains: search,
                                        mode: "insensitive",
                                    },
                                },
                            },
                            {
                                renter: {
                                    name: {
                                        contains: search,
                                        mode: "insensitive",
                                    },
                                },
                            },
                            {
                                owner: {
                                    name: {
                                        contains: search,
                                        mode: "insensitive",
                                    },
                                },
                            },
                        ],
                    },
                }
                : {}),
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
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                _count: {
                    select: {
                        payments: true,
                        disputes: true,
                        reviews: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        res.status(200).json({
            success: true,
            message: "Rentals retrieved successfully",
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
// ==================================================
// PAYMENTS
// ==================================================
export const getAllPayments = async (req, res, next) => {
    try {
        const search = typeof req.query.search === "string"
            ? req.query.search.trim()
            : "";
        const payments = await prisma.payment.findMany({
            ...(search
                ? {
                    where: {
                        OR: [
                            {
                                providerPaymentId: {
                                    contains: search,
                                    mode: "insensitive",
                                },
                            },
                            {
                                rental: {
                                    book: {
                                        title: {
                                            contains: search,
                                            mode: "insensitive",
                                        },
                                    },
                                },
                            },
                            {
                                rental: {
                                    renter: {
                                        name: {
                                            contains: search,
                                            mode: "insensitive",
                                        },
                                    },
                                },
                            },
                        ],
                    },
                }
                : {}),
            include: {
                rental: {
                    select: {
                        id: true,
                        status: true,
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
                                email: true,
                            },
                        },
                        owner: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        res.status(200).json({
            success: true,
            message: "Payments retrieved successfully",
            data: {
                payments,
                count: payments.length,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
// ==================================================
// DISPUTES
// ==================================================
export const getAllDisputes = async (req, res, next) => {
    try {
        const disputes = await prisma.dispute.findMany({
            include: {
                raisedBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                rental: {
                    select: {
                        id: true,
                        status: true,
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
                        owner: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
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
// Update dispute status
export const updateDisputeStatus = async (req, res, next) => {
    try {
        const disputeId = req.params.id;
        if (typeof disputeId !== "string") {
            throw new AppError("Invalid dispute ID", 400);
        }
        const { status, resolution } = req.body;
        const allowedStatuses = [
            "UNDER_REVIEW",
            "RESOLVED",
            "REJECTED",
        ];
        if (!allowedStatuses.includes(status)) {
            throw new AppError("Invalid dispute status", 400);
        }
        if (status === "RESOLVED" &&
            (typeof resolution !== "string" ||
                resolution.trim().length < 5)) {
            throw new AppError("Resolution is required when resolving a dispute", 400);
        }
        const dispute = await prisma.dispute.findUnique({
            where: {
                id: disputeId,
            },
        });
        if (!dispute) {
            throw new AppError("Dispute not found", 404);
        }
        const isClosing = status === "RESOLVED" ||
            status === "REJECTED";
        const updatedDispute = await prisma.$transaction(async (tx) => {
            const updated = await tx.dispute.update({
                where: {
                    id: disputeId,
                },
                data: {
                    status,
                    resolution: typeof resolution === "string"
                        ? resolution.trim() || null
                        : null,
                },
            });
            if (!isClosing) {
                return updated;
            }
            const stillOpen = await tx.dispute.count({
                where: {
                    rentalId: dispute.rentalId,
                    status: {
                        in: ["OPEN", "UNDER_REVIEW"],
                    },
                },
            });
            if (stillOpen > 0 ||
                !dispute.previousRentalStatus) {
                return updated;
            }
            await tx.rental.update({
                where: {
                    id: dispute.rentalId,
                },
                data: {
                    status: dispute.previousRentalStatus,
                },
            });
            return updated;
        });
        if (isClosing) {
            const rental = await prisma.rental.findUnique({
                where: {
                    id: dispute.rentalId,
                },
                select: {
                    renterId: true,
                    ownerId: true,
                },
            });
            await emitNotification([rental?.renterId, rental?.ownerId], {
                type: "DISPUTE",
                title: `Dispute ${status.toLowerCase()}`,
                message: `An admin ${status === "RESOLVED"
                    ? "resolved"
                    : "rejected"} the dispute on your rental.${typeof resolution === "string" &&
                    resolution.trim()
                    ? ` Resolution: ${resolution.trim()}`
                    : ""}`,
                href: `/rentals/${dispute.rentalId}`,
                rentalId: dispute.rentalId,
            });
        }
        res.status(200).json({
            success: true,
            message: "Dispute updated successfully",
            data: {
                dispute: updatedDispute,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
// ==================================================
// REVIEWS
// ==================================================
export const getAllReviews = async (req, res, next) => {
    try {
        const search = typeof req.query.search === "string"
            ? req.query.search.trim()
            : "";
        const reviews = await prisma.review.findMany({
            ...(search
                ? {
                    where: {
                        OR: [
                            {
                                comment: {
                                    contains: search,
                                    mode: "insensitive",
                                },
                            },
                            {
                                reviewer: {
                                    name: {
                                        contains: search,
                                        mode: "insensitive",
                                    },
                                },
                            },
                            {
                                reviewee: {
                                    name: {
                                        contains: search,
                                        mode: "insensitive",
                                    },
                                },
                            },
                            {
                                book: {
                                    title: {
                                        contains: search,
                                        mode: "insensitive",
                                    },
                                },
                            },
                        ],
                    },
                }
                : {}),
            include: {
                reviewer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                reviewee: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                book: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
                rental: {
                    select: {
                        id: true,
                        status: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        res.status(200).json({
            success: true,
            message: "Reviews retrieved successfully",
            data: {
                reviews,
                count: reviews.length,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
// Delete a review
export const deleteReview = async (req, res, next) => {
    try {
        const reviewId = req.params.id;
        if (typeof reviewId !== "string") {
            throw new AppError("Invalid review ID", 400);
        }
        const review = await prisma.review.findUnique({
            where: {
                id: reviewId,
            },
        });
        if (!review) {
            throw new AppError("Review not found", 404);
        }
        await prisma.review.delete({
            where: {
                id: reviewId,
            },
        });
        res.status(200).json({
            success: true,
            message: "Review deleted successfully",
        });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=admin.controller.js.map