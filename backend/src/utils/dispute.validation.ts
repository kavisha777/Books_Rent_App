import { z } from "zod";

export const createDisputeSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(3, "Reason must be at least 3 characters")
    .max(200, "Reason must not exceed 200 characters"),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(3000, "Description must not exceed 3000 characters"),

  evidenceUrls: z
    .array(z.string().url("Invalid evidence URL"))
    .max(10, "Maximum 10 evidence files are allowed")
    .optional(),
});

export type CreateDisputeInput = z.infer<
  typeof createDisputeSchema
>;