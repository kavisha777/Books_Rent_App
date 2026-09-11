import type {
  NextFunction,
  Response,
} from "express";

import prisma from "../lib/prisma.js";
import AppError from "../utils/AppError.js";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { createReviewSchema } from "../utils/review.validation.js";

export const createReview = async (
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

    const rentalId = req.params.id;

    if (typeof rentalId !== "string") {
      throw new AppError(
        "Invalid rental ID",
        400
      );
    }

    const validatedData =
      createReviewSchema.safeParse(req.body);

    if (!validatedData.success) {
      throw new AppError(
        validatedData.error.issues[0]?.message ||
          "Invalid review data",
        400
      );
    }

    const rental = await prisma.rental.findUnique({
      where: {
        id: rentalId,
      },
      select: {
        id: true,
        status: true,
        bookId: true,
        renterId: true,
        ownerId: true,
      },
    });

    if (!rental) {
      throw new AppError(
        "Rental not found",
        404
      );
    }

    if (rental.status !== "COMPLETED") {
      throw new AppError(
        "Reviews can only be created for completed rentals",
        400
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

    const revieweeId = isRenter
      ? rental.ownerId
      : rental.renterId;

    const existingReview =
      await prisma.review.findUnique({
        where: {
          rentalId_reviewerId: {
            rentalId,
            reviewerId: req.user.userId,
          },
        },
      });

    if (existingReview) {
      throw new AppError(
        "You have already reviewed this rental",
        400
      );
    }

    const {
      rating,
      comment,
    } = validatedData.data;

    const review = await prisma.review.create({
      data: {
        rating,
        comment: comment || null,
        rentalId,
        reviewerId: req.user.userId,
        revieweeId,
        bookId: rental.bookId,
      },
    });

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: {
        review,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getRentalReviews = async (
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

    const rentalId = req.params.id;

    if (typeof rentalId !== "string") {
      throw new AppError(
        "Invalid rental ID",
        400
      );
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
      throw new AppError(
        "Rental not found",
        404
      );
    }

    const isRenter =
      rental.renterId === req.user.userId;

    const isOwner =
      rental.ownerId === req.user.userId;

    const isAdmin =
      req.user.role === "ADMIN";

    if (!isRenter && !isOwner && !isAdmin) {
      throw new AppError(
        "You do not have access to these reviews",
        403
      );
    }

    const reviews = await prisma.review.findMany({
      where: {
        rentalId,
      },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
          },
        },
        reviewee: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
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
  } catch (error) {
    next(error);
  }
};