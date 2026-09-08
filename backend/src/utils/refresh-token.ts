import crypto from "crypto";

export const generateRefreshToken = (): string => {
  return crypto.randomBytes(64).toString("hex");
};