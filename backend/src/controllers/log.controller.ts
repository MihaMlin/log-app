import asyncHandler from "../middleware/asyncHandler";
import LogModel from "../models/log.model";
import appAssert from "../utils/appAssert";
import { HTTPSTATUS } from "../constants/http";
import {
  createLogSchema,
  logIdSchema,
  projectIdSchema,
} from "../validators/log.validator";

export const getAllLogsHandler = asyncHandler(async (req, res) => {
  const logs = await LogModel.find().sort({ createdAt: -1 });
  return res.status(HTTPSTATUS.OK).json(logs);
});

export const getLogByIdHandler = asyncHandler(async (req, res) => {
  const logId = logIdSchema.parse(req.params.id);

  const log = await LogModel.findById(logId);
  appAssert(log, HTTPSTATUS.NOT_FOUND, "Log not found");

  return res.status(HTTPSTATUS.OK).json(log);
});

export const getProjectLogsHandler = asyncHandler(async (req, res) => {
  const projectId = projectIdSchema.parse(req.params.projectId);

  const logs = await LogModel.find({ projectId }).sort({ createdAt: -1 });

  return res.status(HTTPSTATUS.OK).json(logs);
});

export const createLogHandler = asyncHandler(async (req, res) => {
  const metadataObj = {
    request: {
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      query: req.query,
    },
    system: {
      nodeVersion: process.version,
      platform: process.platform,
      memoryUsage: process.memoryUsage(),
    },
  };

  const { projectId, message, severity, source, metadata } =
    createLogSchema.parse({
      ...req.body,
      projectId: req.params.projectId,
      metadata: metadataObj,
    });

  const log = await LogModel.create({
    userId: req.userId,
    projectId,
    message,
    severity,
    source,
    metadata,
  });
  appAssert(log, HTTPSTATUS.INTERNAL_SERVER_ERROR, "Failed to create log");

  return res.status(HTTPSTATUS.CREATED).json(log);
});

export const deleteLogHandler = asyncHandler(async (req, res) => {
  const logId = logIdSchema.parse(req.params.id);

  const log = await LogModel.findByIdAndDelete(logId);
  appAssert(log, HTTPSTATUS.NOT_FOUND, "Log not found");

  return res.status(HTTPSTATUS.OK).send({ message: "Log removed" });
});

export const getProjectStatsHandler = asyncHandler(async (req, res) => {
  const projectId = projectIdSchema.parse(req.params.projectId);

  const stats = await LogModel.getProjectStats(projectId);
  appAssert(stats, HTTPSTATUS.NOT_FOUND, "No logs found for this project");

  return res.status(HTTPSTATUS.OK).json(stats);
});
