import { z } from "zod";

export const UpdateCard = z.object({
  id: z.string(),
  title: z.optional(
    z
      .string({
        required_error: "Title is required",
        invalid_type_error: "Title must be a string",
      })
      .min(3, "Title must be at least 3 characters long")
  ),
  description: z.optional(
    z
      .string({
        required_error: "Description is required",
        invalid_type_error: "Description must be a string",
      })
      .min(3, { message: "Description must be at least 3 characters long" })
  ),
  boardId: z.string(),
});
