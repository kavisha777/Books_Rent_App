export declare const createMockRentalPayment: (rentalId: string) => Promise<{
    rental: {
        id: string;
        status: import("@prisma/client").$Enums.RentalStatus;
        startDate: Date;
        endDate: Date;
        dailyRate: import("@prisma/client-runtime-utils").Decimal;
        rentalAmount: import("@prisma/client-runtime-utils").Decimal;
        securityDeposit: import("@prisma/client-runtime-utils").Decimal;
        paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
        approvedAt: Date | null;
        confirmedAt: Date | null;
        handoverAt: Date | null;
        returnedAt: Date | null;
        completedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        bookId: string;
        renterId: string;
        ownerId: string;
    };
    payments: {
        id: string;
        type: import("@prisma/client").$Enums.PaymentType;
        amount: import("@prisma/client-runtime-utils").Decimal;
        currency: string;
        status: import("@prisma/client").$Enums.PaymentStatus;
        provider: string | null;
        providerPaymentId: string | null;
        createdAt: Date;
        updatedAt: Date;
        rentalId: string;
    }[];
}>;
//# sourceMappingURL=payment.service.d.ts.map