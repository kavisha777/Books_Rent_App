import prisma from "../lib/prisma.js";
import AppError from "../utils/AppError.js";
export const getMyProfile = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new AppError("Authentication required", 401);
        }
        const user = await prisma.user.findUnique({
            where: {
                id: req.user.userId,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user) {
            throw new AppError("User not found", 404);
        }
        res.status(200).json({
            success: true,
            message: "Profile retrieved successfully",
            data: {
                user,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=user.controller.js.map