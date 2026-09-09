import { z } from "zod";

export const createRentalSchema = z
  .object({
    bookId: z
      .string()
      .uuid("Invalid book ID"),

    startDate: z
      .string()
      .datetime("Invalid start date"),

    endDate: z
      .string()
      .datetime("Invalid end date"),
  })
  .refine(
    (data) => new Date(data.endDate) > new Date(data.startDate),
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );

export type CreateRentalInput = z.infer<
  typeof createRentalSchema
>;