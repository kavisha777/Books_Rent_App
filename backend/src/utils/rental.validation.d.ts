import { z } from "zod";
export declare const createRentalSchema: z.ZodObject<{
    bookId: z.ZodString;
    startDate: z.ZodString;
    endDate: z.ZodString;
}, z.core.$strip>;
export type CreateRentalInput = z.infer<typeof createRentalSchema>;
//# sourceMappingURL=rental.validation.d.ts.map