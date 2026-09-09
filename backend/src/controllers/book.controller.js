import prisma from "../lib/prisma.js";
import AppError from "../utils/AppError.js";
import { createBookSchema, updateBookSchema, } from "../utils/book.validation.js";
export const createBook = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new AppError("Authentication required", 401);
        }
        const validatedData = createBookSchema.safeParse(req.body);
        if (!validatedData.success) {
            throw new AppError(validatedData.error.issues[0]?.message || "Invalid book data", 400);
        }
        const { title, author, isbn, description, condition, } = validatedData.data;
        const book = await prisma.book.create({
            data: {
                title,
                author,
                isbn: isbn || null,
                description: description || null,
                condition: condition || null,
                ownerId: req.user.userId,
            },
        });
        res.status(201).json({
            success: true,
            message: "Book listed successfully",
            data: {
                book,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
export const getAllBooks = async (req, res, next) => {
    try {
        const books = await prisma.book.findMany({
            where: {
                status: "AVAILABLE",
            },
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                title: true,
                author: true,
                isbn: true,
                description: true,
                condition: true,
                status: true,
                createdAt: true,
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
export const getBookById = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (typeof id !== "string") {
            throw new AppError("Invalid book ID", 400);
        }
        const book = await prisma.book.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                title: true,
                author: true,
                isbn: true,
                description: true,
                condition: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                owner: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        if (!book) {
            throw new AppError("Book not found", 404);
        }
        res.status(200).json({
            success: true,
            message: "Book retrieved successfully",
            data: {
                book,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
export const updateBook = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new AppError("Authentication required", 401);
        }
        const id = req.params.id;
        if (typeof id !== "string") {
            throw new AppError("Invalid book ID", 400);
        }
        const validatedData = updateBookSchema.safeParse(req.body);
        if (!validatedData.success) {
            throw new AppError(validatedData.error.issues[0]?.message || "Invalid book data", 400);
        }
        const existingBook = await prisma.book.findUnique({
            where: {
                id,
            },
        });
        if (!existingBook) {
            throw new AppError("Book not found", 404);
        }
        if (existingBook.ownerId !== req.user.userId) {
            throw new AppError("You can only update your own books", 403);
        }
        const activeRental = await prisma.rental.findFirst({
            where: {
                bookId: id,
                status: {
                    in: [
                        "REQUESTED",
                        "APPROVED",
                        "PAYMENT_PENDING",
                        "CONFIRMED",
                        "HANDOVER_PENDING",
                        "ACTIVE",
                        "RETURN_PENDING",
                        "INSPECTION",
                        "DISPUTED",
                    ],
                },
            },
        });
        if (activeRental) {
            throw new AppError("Book cannot be updated while it has an active rental process", 400);
        }
        const { title, author, isbn, description, condition, } = validatedData.data;
        const book = await prisma.book.update({
            where: {
                id,
            },
            data: {
                ...(title !== undefined && { title }),
                ...(author !== undefined && { author }),
                ...(isbn !== undefined && {
                    isbn: isbn || null,
                }),
                ...(description !== undefined && {
                    description: description || null,
                }),
                ...(condition !== undefined && {
                    condition: condition || null,
                }),
            },
        });
        res.status(200).json({
            success: true,
            message: "Book updated successfully",
            data: {
                book,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
export const deleteBook = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new AppError("Authentication required", 401);
        }
        const id = req.params.id;
        if (typeof id !== "string") {
            throw new AppError("Invalid book ID", 400);
        }
        const existingBook = await prisma.book.findUnique({
            where: {
                id,
            },
        });
        if (!existingBook) {
            throw new AppError("Book not found", 404);
        }
        if (existingBook.ownerId !== req.user.userId) {
            throw new AppError("You can only delete your own books", 403);
        }
        const rentalCount = await prisma.rental.count({
            where: {
                bookId: id,
            },
        });
        if (rentalCount > 0) {
            throw new AppError("Book cannot be deleted because rental records exist", 400);
        }
        await prisma.book.delete({
            where: {
                id,
            },
        });
        res.status(200).json({
            success: true,
            message: "Book deleted successfully",
        });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=book.controller.js.map