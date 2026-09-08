import crypto from "crypto";
export const generateRefreshToken = () => {
    return crypto.randomBytes(64).toString("hex");
};
//# sourceMappingURL=refresh-token.js.map