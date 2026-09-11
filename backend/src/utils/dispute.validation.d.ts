import { z } from "zod";
export declare const createDisputeSchema: z.ZodObject<{
    reason: z.ZodString;
    description: z.ZodString;
    evidenceUrls: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export type CreateDisputeInput = z.infer<typeof createDisputeSchema>;
//# sourceMappingURL=dispute.validation.d.ts.map