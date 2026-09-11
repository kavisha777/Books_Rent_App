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

  const rentalPayment =
    await prisma.payment.create({
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

  const depositPayment =
    await prisma.payment.create({
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

  const updatedRental =
    await prisma.rental.update({
      where: {
        id: rental.id,
      },
      data: {
        paymentStatus: "PAID",
        status: "CONFIRMED",
        confirmedAt: new Date(),
      },
    });

  return {
    rental: updatedRental,
    payments: [
      rentalPayment,
      depositPayment,
    ],
  };
};