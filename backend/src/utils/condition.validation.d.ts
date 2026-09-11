import { z } from "zod";
export declare const createConditionSchema: z.ZodObject<{
    status: z.ZodEnum<{
        DAMAGED: "DAMAGED";
        GOOD: "GOOD";
        LOST: "LOST";
        UNVERIFIED: "UNVERIFIED";
    }>;
    notes: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    imageUrls: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export type CreateConditionInput = z.infer<typeof createConditionSchema>;
//# sourceMappingURL=condition.validation.d.ts.map