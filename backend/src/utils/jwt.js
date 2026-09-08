import jwt from "jsonwebtoken";
import { JWT_ACCESS_EXPIRES_IN, JWT_ACCESS_SECRET, } from "../config/env.js";
export const generateAccessToken = (userId, role) => {
    return jwt.sign({ userId, role }, JWT_ACCESS_SECRET, {
        expiresIn: JWT_ACCESS_EXPIRES_IN,
    });
};
//# sourceMappingURL=jwt.js.map