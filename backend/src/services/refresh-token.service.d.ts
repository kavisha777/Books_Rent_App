export declare const createRefreshToken: (userId: string) => Promise<{
    id: string;
    token: string;
    expiresAt: Date;
    createdAt: Date;
    userId: string;
}>;
export declare const findRefreshToken: (token: string) => Promise<{
    id: string;
    token: string;
    expiresAt: Date;
    createdAt: Date;
    userId: string;
} | null>;
export declare const deleteRefreshToken: (token: string) => Promise<void>;
//# sourceMappingURL=refresh-token.service.d.ts.map