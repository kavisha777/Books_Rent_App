import prisma from "../lib/prisma.js";
import { generateRefreshToken } from "../utils/refresh-token.js";
const REFRESH_TOKEN_EXPIRES_DAYS = 7;
export const createRefreshToken = async (userId) => {
    const token = generateRefreshToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRES_DAYS);
    const refreshToken = await prisma.refreshToken.create({
        data: {
            token,
            expiresAt,
            userId,
        },
    });
    return refreshToken;
};
export const findRefreshToken = async (token) => {
    return prisma.refreshToken.findUnique({
        where: {
            token,
        },
    });
};
export const deleteRefreshToken = async (token) => {
    await prisma.refreshToken.deleteMany({
        where: {
            token,
        },
    });
};
//# sourceMappingURL=refresh-token.service.js.map