import prisma from "../lib/prisma.js";
import AppError from "../utils/AppError.js";

export const createMockRentalPayment = async (
  rentalId: string
) => {
  const rental = await prisma.rental.findUnique({
    where: {
      id: rentalId,
    },
  });

  if (!rental) {
    throw new AppError(
      "Rental not found",
      404
    );
  }

  if (rental.paymentStatus === "PAID") {
    throw new AppError(
      "Payment has already been completed",
      400
    );
  }

  const rentalPayment = await prisma.$transaction(
    async (tx) => {
      // Claim the rental first so two concurrent pay requests cannot both
      // record a payment; the guard is part of the same transaction.
      const claimed = await tx.rental.updateMany({
        where: {
          id: rental.id,
          paymentStatus: {
            not: "PAID",
          },
        },
        data: {
          paymentStatus: "PAID",
          status: "CONFIRMED",
          confirmedAt: new Date(),
        },
      });

      if (claimed.count === 0) {
        throw new AppError(
          "Payment has already been completed",
          400
        );
      }

      const rent = await tx.payment.create({
        data: {
          type: "RENTAL",
          amount: rental.rentalAmount,
          currency: "LKR",
          status: "PAID",
          provider: "MOCK",
          providerPaymentId:
            `MOCK-RENTAL-${rental.id}`,
          rentalId: rental.id,
        },
      });

      const deposit = await tx.payment.create({
        data: {
          type: "SECURITY_DEPOSIT",
          amount: rental.securityDeposit,
          currency: "LKR",
          status: "PAID",
          provider: "MOCK",
          providerPaymentId:
            `MOCK-DEPOSIT-${rental.id}`,
          rentalId: rental.id,
        },
      });

      const updatedRental = await tx.rental.findUnique({
        where: {
          id: rental.id,
        },
      });

      return {
        rental: updatedRental,
        payments: [rent, deposit],
      };
    }
  );

  return rentalPayment;
};