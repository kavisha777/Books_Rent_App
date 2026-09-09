import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import AppError from "../utils/AppError.js";
import { loginSchema, registerSchema } from "../utils/validation.js";
import { generateAccessToken } from "../utils/jwt.js";
import { createRefreshToken, findRefreshToken, deleteRefreshToken, } from "../services/refresh-token.service.js";
export const register = async (req, res, next) => {
    try {
        const validatedData = registerSchema.safeParse(req.body);
        if (!validatedData.success) {
            const message = validatedData.error.issues[0]?.message || "Invalid input";
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
    }
    catch (error) {
        next(error);
    }
};
export const login = async (req, res, next) => {
    try {
        const validatedData = loginSchema.safeParse(req.body);
        if (!validatedData.success) {
            const message = validatedData.error.issues[0]?.message || "Invalid input";
            throw new AppError(message, 400);
        }
        const { email, password } = validatedData.data;
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new AppError("Invalid email or password", 401);
        }
        const passwordMatches = await bcrypt.compare(password, user.password);
        if (!passwordMatches) {
            throw new AppError("Invalid email or password", 401);
        }
        const accessToken = generateAccessToken(user.id, user.role);
        const refreshToken = await createRefreshToken(user.id);
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                accessToken,
                refreshToken: refreshToken.token,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
export const refreshAccessToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken || typeof refreshToken !== "string") {
            throw new AppError("Refresh token is required", 400);
        }
        const storedToken = await findRefreshToken(refreshToken);
        if (!storedToken) {
            throw new AppError("Invalid refresh token", 401);
        }
        if (storedToken.expiresAt <= new Date()) {
            await deleteRefreshToken(refreshToken);
            throw new AppError("Refresh token has expired", 401);
        }
        const user = await prisma.user.findUnique({
            where: {
                id: storedToken.userId,
            },
            select: {
                id: true,
                role: true,
            },
        });
        if (!user) {
            await deleteRefreshToken(refreshToken);
            throw new AppError("User not found", 401);
        }
        const accessToken = generateAccessToken(user.id, user.role);
        res.status(200).json({
            success: true,
            message: "Access token refreshed successfully",
            data: {
                accessToken,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
export const logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken || typeof refreshToken !== "string") {
            throw new AppError("Refresh token is required", 400);
        }
        await deleteRefreshToken(refreshToken);
        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=auth.controller.js.map