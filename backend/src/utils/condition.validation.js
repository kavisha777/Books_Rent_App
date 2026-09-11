import { z } from "zod";
export const createConditionSchema = z.object({
    status: z.enum([
        "GOOD",
        "DAMAGED",
        "LOST",
        "UNVERIFIED",
    ]),
    notes: z
        .string()
        .trim()
        .max(2000, "Notes must not exceed 2000 characters")
        .optional()
        .or(z.literal("")),
    imageUrls: z
        .array(z.string().url("Invalid image URL"))
        .max(10, "Maximum 10 images are allowed")
        .optional(),
});
//# sourceMappingURL=condition.validation.js.map