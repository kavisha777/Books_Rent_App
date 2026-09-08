import jwt from "jsonwebtoken";

import {
  JWT_ACCESS_EXPIRES_IN,
  JWT_ACCESS_SECRET,
} from "../config/env.js";

export const generateAccessToken = (userId: string, role: string) => {
  return jwt.sign(
    { userId, role },
    JWT_ACCESS_SECRET as string,
    {
      expiresIn: JWT_ACCESS_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    } as jwt.SignOptions
  );
};