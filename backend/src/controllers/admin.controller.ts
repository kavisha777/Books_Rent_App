import type {
  NextFunction,
  Response,
} from "express";

import prisma from "../lib/prisma.js";
import AppError from "../utils/AppError.js";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { emitNotification } from "../services/notification.service.js";

export const getAdminStats = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const [
      totalUsers,
      totalBooks,
      totalRentals,
      activeRentals,
      totalPayments,
      openDisputes,
    ] = await Promise.all([
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
            in: [
              "OPEN",
              "UNDER_REVIEW",
            ],
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
  } catch (error) {
    next(error);
  }
};

export const getAllDisputes = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
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
  } catch (error) {
    next(error);
  }
};

export const updateDisputeStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const disputeId = req.params.id;

    if (typeof disputeId !== "string") {
      throw new AppError(
        "Invalid dispute ID",
        400
      );
    }

    const { status, resolution } = req.body;

    const allowedStatuses = [
      "UNDER_REVIEW",
      "RESOLVED",
      "REJECTED",
    ];

    if (!allowedStatuses.includes(status)) {
      throw new AppError(
        "Invalid dispute status",
        400
      );
    }

    if (
      status === "RESOLVED" &&
      (!resolution ||
        typeof resolution !== "string" ||
        resolution.trim().length < 5)
    ) {
      throw new AppError(
        "Resolution is required when resolving a dispute",
        400
      );
    }

    const dispute = await prisma.dispute.findUnique({
      where: {
        id: disputeId,
      },
    });

    if (!dispute) {
      throw new AppError(
        "Dispute not found",
        404
      );
    }

    const isClosing =
      status === "RESOLVED" || status === "REJECTED";

    const updatedDispute = await prisma.$transaction(
      async (tx) => {
        const updated = await tx.dispute.update({
          where: {
            id: disputeId,
          },
          data: {
            status,
            resolution: resolution?.trim() || null,
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

        if (stillOpen > 0) {
          return updated;
        }

        // Without a recorded prior status there is nothing safe to restore
        // to, so leave the rental as it is rather than guessing.
        if (!dispute.previousRentalStatus) {
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
      }
    );

    if (isClosing) {
      const rental = await prisma.rental.findUnique({
        where: {
          id: dispute.rentalId,
        },
        select: {
          renterId: true,
          ownerId: true,
          status: true,
        },
      });

      await emitNotification(
        [rental?.renterId, rental?.ownerId],
        {
          type: "DISPUTE",
          title: `Dispute ${status.toLowerCase()}`,
          message: `An admin ${
            status === "RESOLVED" ? "resolved" : "rejected"
          } the dispute on your rental.${
            resolution ? ` Resolution: ${resolution}` : ""
          }`,
          href: `/rentals/${dispute.rentalId}`,
          rentalId: dispute.rentalId,
        }
      );
    }

    res.status(200).json({
      success: true,
      message: "Dispute updated successfully",
      data: {
        dispute: updatedDispute,
      },
    });
  } catch (error) {
    next(error);
  }
};