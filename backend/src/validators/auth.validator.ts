import { z } from "zod";

export const emailSchema = z.email("Invalid email address");

const passwordSchema = z.string().min(6).max(255);

export const verificationCodeSchema = z.string().min(1).max(24);

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  userAgent: z.string().optional(),
});

export const setInitialPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: passwordSchema,
    userAgent: z.string().optional(),
    code: verificationCodeSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const resetPasswordSchema = z.object({
  password: passwordSchema,
  verificationCode: verificationCodeSchema,
});
