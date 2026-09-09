import type {
  NextFunction,
  Response,
} from "express";

import prisma from "../lib/prisma.js";
import { RentalStatus } from "@prisma/client";
import AppError from "../utils/AppError.js";
import type {
  AuthenticatedRequest,
} from "../middleware/auth.middleware.js";
import {
  createRentalSchema,
} from "../utils/rental.validation.js";

const ACTIVE_RENTAL_STATUSES: RentalStatus[] = [
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
/**
 * Create a rental request
 */
export const createRental = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError(
        "Authentication required",
        401
      );
    }

    const validatedData =
      createRentalSchema.safeParse(req.body);

    if (!validatedData.success) {
      throw new AppError(
        validatedData.error.issues[0]?.message ||
          "Invalid rental data",
        400
      );
    }

    const {
      bookId,
      startDate,
      endDate,
    } = validatedData.data;

    const start = new Date(startDate);
    const end = new Date(endDate);

    const book = await prisma.book.findUnique({
      where: {
        id: bookId,
      },
    });

    if (!book) {
      throw new AppError(
        "Book not found",
        404
      );
    }

    if (book.ownerId === req.user.userId) {
      throw new AppError(
        "You cannot rent your own book",
        400
      );
    }

    if (book.status !== "AVAILABLE") {
      throw new AppError(
        "This book is currently unavailable",
        400
      );
    }

    const overlappingRental =
      await prisma.rental.findFirst({
        where: {
          bookId,
          status: {
            in: ACTIVE_RENTAL_STATUSES,
          },
          startDate: {
            lt: end,
          },
          endDate: {
            gt: start,
          },
        },
      });

    if (overlappingRental) {
      throw new AppError(
        "This book already has a rental request for the selected dates",
        409
      );
    }

    const rental = await prisma.rental.create({
      data: {
        bookId,
        renterId: req.user.userId,
        ownerId: book.ownerId,
        startDate: start,
        endDate: end,
        status: "REQUESTED",
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
        owner: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Rental request created successfully",
      data: {
        rental,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get renter's rentals
 */
export const getMyRentals = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError(
        "Authentication required",
        401
      );
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
            condition: true,
            status: true,
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
  } catch (error) {
    next(error);
  }
};

/**
 * Get rental requests for books owned by the user
 */
export const getOwnerRentalRequests = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError(
        "Authentication required",
        401
      );
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
            condition: true,
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
      message:
        "Rental requests retrieved successfully",
      data: {
        rentals,
        count: rentals.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get one rental
 */
export const getRentalById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError(
        "Authentication required",
        401
      );
    }

    const id = req.params.id;

    if (typeof id !== "string") {
      throw new AppError(
        "Invalid rental ID",
        400
      );
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
            status: true,
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
          },
        },
      },
    });

    if (!rental) {
      throw new AppError(
        "Rental not found",
        404
      );
    }

    const isRenter =
      rental.renterId === req.user.userId;

    const isOwner =
      rental.ownerId === req.user.userId;

    if (!isRenter && !isOwner) {
      throw new AppError(
        "You do not have access to this rental",
        403
      );
    }

    res.status(200).json({
      success: true,
      message: "Rental retrieved successfully",
      data: {
        rental,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Owner approves rental request
 */
export const approveRental = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError(
        "Authentication required",
        401
      );
    }

    const id = req.params.id;

    if (typeof id !== "string") {
      throw new AppError(
        "Invalid rental ID",
        400
      );
    }

    const rental = await prisma.rental.findUnique({
      where: {
        id,
      },
    });

    if (!rental) {
      throw new AppError(
        "Rental not found",
        404
      );
    }

    if (rental.ownerId !== req.user.userId) {
      throw new AppError(
        "Only the book owner can approve this rental",
        403
      );
    }

    if (rental.status !== "REQUESTED") {
      throw new AppError(
        "Only requested rentals can be approved",
        400
      );
    }

    /*
     * Make sure the rental has valid dates.
     */
    if (!rental.startDate || !rental.endDate) {
      throw new AppError(
        "Rental dates are required",
        400
      );
    }

    /*
     * Re-check overlapping rentals before approval.
     */
    const overlappingRental =
      await prisma.rental.findFirst({
        where: {
          id: {
            not: rental.id,
          },
          bookId: rental.bookId,
          status: {
            in: [
              "APPROVED",
              "PAYMENT_PENDING",
              "CONFIRMED",
              "HANDOVER_PENDING",
              "ACTIVE",
              "RETURN_PENDING",
              "INSPECTION",
              "OVERDUE",
              "DISPUTED",
            ],
          },
          startDate: {
            lt: rental.endDate,
          },
          endDate: {
            gt: rental.startDate,
          },
        },
      });

    if (overlappingRental) {
      throw new AppError(
        "This book is already reserved for overlapping dates",
        409
      );
    }

    const updatedRental =
      await prisma.rental.update({
        where: {
          id,
        },
        data: {
          status: "APPROVED",
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
      message: "Rental approved successfully",
      data: {
        rental: updatedRental,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Owner rejects rental request
 */
export const rejectRental = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError(
        "Authentication required",
        401
      );
    }

    const id = req.params.id;

    if (typeof id !== "string") {
      throw new AppError(
        "Invalid rental ID",
        400
      );
    }

    const rental = await prisma.rental.findUnique({
      where: {
        id,
      },
    });

    if (!rental) {
      throw new AppError(
        "Rental not found",
        404
      );
    }

    if (rental.ownerId !== req.user.userId) {
      throw new AppError(
        "Only the book owner can reject this rental",
        403
      );
    }

    if (rental.status !== "REQUESTED") {
      throw new AppError(
        "Only requested rentals can be rejected",
        400
      );
    }

    const updatedRental =
      await prisma.rental.update({
        where: {
          id,
        },
        data: {
          status: "REJECTED",
        },
      });

    res.status(200).json({
      success: true,
      message: "Rental rejected successfully",
      data: {
        rental: updatedRental,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Renter cancels rental request
 */
export const cancelRental = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError(
        "Authentication required",
        401
      );
    }

    const id = req.params.id;

    if (typeof id !== "string") {
      throw new AppError(
        "Invalid rental ID",
        400
      );
    }

    const rental = await prisma.rental.findUnique({
      where: {
        id,
      },
    });

    if (!rental) {
      throw new AppError(
        "Rental not found",
        404
      );
    }

    if (rental.renterId !== req.user.userId) {
      throw new AppError(
        "Only the renter can cancel this rental",
        403
      );
    }

    if (
      rental.status !== "REQUESTED" &&
      rental.status !== "APPROVED"
    ) {
      throw new AppError(
        "This rental cannot be cancelled at its current stage",
        400
      );
    }

    const updatedRental =
      await prisma.rental.update({
        where: {
          id,
        },
        data: {
          status: "CANCELLED",
        },
      });

    res.status(200).json({
      success: true,
      message: "Rental cancelled successfully",
      data: {
        rental: updatedRental,
      },
    });
  } catch (error) {
    next(error);
  }
};