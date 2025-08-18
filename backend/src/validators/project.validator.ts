import { z } from "zod";

export const projectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid project ID format");

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, "Project name is required")
    .max(100, "Project name is too long"),
  description: z.string().max(500, "Description is too long").optional(),
  status: z.enum(["active", "archived", "completed"], {
    message: "Project status is required",
  }),
  tags: z
    .array(z.string().min(1).max(20))
    .max(10, "Maximum 10 tags allowed")
    .optional(),
});

export const updateProjectSchema = z
  .object({
    projectId: projectIdSchema,
    name: z
      .string()
      .min(1, "Project name is required")
      .max(100, "Project name is too long")
      .optional(),
    description: z.string().max(500, "Description is too long").optional(),
    status: z
      .enum(["active", "archived", "completed"], {
        message: "Project status is required",
      })
      .optional(),
    tags: z
      .array(z.string().min(1).max(20))
      .max(10, "Maximum 10 tags allowed")
      .optional(),
  })
  .refine(
    (data) => {
      return (
        data.name !== undefined ||
        data.description !== undefined ||
        data.status !== undefined ||
        data.tags !== undefined
      );
    },
    {
      message: "Must provide either name or description to update",
    }
  );
