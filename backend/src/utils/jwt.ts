import jwt from "jsonwebtoken";
import { JWT_ACCESS_SECRET, JWT_ACCESS_EXPIRES_IN } from "../config/env.js";

export const generateAccessToken = (userId: string, role: string) => {
  return jwt.sign(
    { userId, role },
    JWT_ACCESS_SECRET,
    { expiresIn: JWT_ACCESS_EXPIRES_IN }
  );
};