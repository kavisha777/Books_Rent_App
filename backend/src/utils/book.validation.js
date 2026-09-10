import { z } from "zod";
export const createBookSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, "Title is required")
        .max(200, "Title must not exceed 200 characters"),
    author: z
        .string()
        .trim()
        .min(1, "Author is required")
        .max(150, "Author must not exceed 150 characters"),
    isbn: z
        .string()
        .trim()
        .max(30, "ISBN must not exceed 30 characters")
        .optional()
        .or(z.literal("")),
    description: z
        .string()
        .trim()
        .max(2000, "Description must not exceed 2000 characters")
        .optional()
        .or(z.literal("")),
    condition: z
        .string()
        .trim()
        .max(100, "Condition must not exceed 100 characters")
        .optional()
        .or(z.literal("")),
    dailyRate: z
        .number()
        .positive("Daily rental rate must be greater than 0"),
    securityDeposit: z
        .number()
        .nonnegative("Security deposit cannot be negative"),
});
export const updateBookSchema = createBookSchema.partial();
//# sourceMappingURL=book.validation.js.map