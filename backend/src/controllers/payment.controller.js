import prisma from "../lib/prisma.js";
import AppError from "../utils/AppError.js";
import { createMockRentalPayment, } from "../services/payment.service.js";
export const payForRental = async (req, res, next) => {
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
                status: true,
                paymentStatus: true,
            },
        });
        if (!rental) {
            throw new AppError("Rental not found", 404);
        }
        if (rental.renterId !==
            req.user.userId) {
            throw new AppError("Only the renter can make this payment", 403);
        }
        if (rental.status !== "APPROVED") {
            throw new AppError("Only approved rentals can be paid", 400);
        }
        if (rental.paymentStatus === "PAID") {
            throw new AppError("Rental has already been paid", 400);
        }
        const result = await createMockRentalPayment(rentalId);
        res.status(200).json({
            success: true,
            message: "Rental payment and security deposit completed successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=payment.controller.js.map