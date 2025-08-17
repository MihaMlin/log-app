import { z } from "zod";

export const projectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid project ID format");

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, "Project name is required")
    .max(100, "Project name is too long"),
  description: z.string().min(1).max(500, "Description is too long").optional(),
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
  })
  .refine(
    (data) => {
      return data.name !== undefined || data.description !== undefined;
    },
    {
      message: "Must provide either name or description to update",
    }
  );
