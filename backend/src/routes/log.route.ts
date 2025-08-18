import { Router } from "express";
import { authorizeAdmin, authorizeLogAccess } from "../middleware/authorize";
import {
  createLogHandler,
  deleteLogHandler,
  getAllLogsHandler,
  getLogByIdHandler,
  getProjectLogsHandler,
  getProjectStatsHandler,
} from "../controllers/log.controller";

const logRoutes = Router();

// prefix: /logs

// --- Admin only ---
logRoutes.get("/", authorizeAdmin, getAllLogsHandler); // returns all logs

// --- Owner or Admin ---
logRoutes.get("/project/:projectId", authorizeLogAccess, getProjectLogsHandler);
logRoutes.get(
  "/project/:projectId/stats",
  authorizeLogAccess,
  getProjectStatsHandler
);
logRoutes.get("/:id", authorizeLogAccess, getLogByIdHandler);
logRoutes.post("/project/:projectId", authorizeLogAccess, createLogHandler);
logRoutes.delete("/:id", authorizeLogAccess, deleteLogHandler);

export default logRoutes;
