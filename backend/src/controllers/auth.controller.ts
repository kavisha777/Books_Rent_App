import type { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import AppError from "../utils/AppError.js";
import { registerSchema } from "../utils/validation.js";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = registerSchema.safeParse(req.body);

    if (!validatedData.success) {
      const message =
        validatedData.error.issues[0]?.message || "Invalid input";

      throw new AppError(message, 400);
    }

    const { name, email, password } = validatedData.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError("Email is already registered", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};