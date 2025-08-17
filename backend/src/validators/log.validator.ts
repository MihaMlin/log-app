import { z } from "zod";
import { LogSeverityType } from "../constants/logSeverityType";

export const projectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid project ID format");

export const logIdSchema = projectIdSchema;

export const logSeveritySchema = z.enum([
  LogSeverityType.EMERGENCY,
  LogSeverityType.ALERT,
  LogSeverityType.CRITICAL,
  LogSeverityType.ERROR,
  LogSeverityType.WARNING,
  LogSeverityType.NOTICE,
  LogSeverityType.INFOORMATIONAL,
  LogSeverityType.DEBUG,
]);

export const createLogSchema = z.object({
  projectId: projectIdSchema,
  message: z.string().min(1, "Message is required"),
  severity: logSeveritySchema,
  source: z.string(),
  metadata: z.any().optional(),
});
