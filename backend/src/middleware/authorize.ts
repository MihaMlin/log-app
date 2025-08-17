import { RequestHandler } from "express";
import { HTTPSTATUS } from "../constants/http";
import { AppErrorCode } from "../constants/appErrorCode";
import appAssert from "../utils/appAssert";
import ProjectModel from "../models/project.model";
import LogModel from "../models/log.model";
import { projectIdSchema } from "../validators/project.validator";
import { loginSchema } from "../validators/auth.validator";

// Admin authorization (must be admin)
const authorizeAdmin: RequestHandler = (req, res, next) => {
  appAssert(
    req.isAdmin,
    HTTPSTATUS.FORBIDDEN,
    "Admin access required",
    AppErrorCode.Forbidden
  );
  next();
};

// Project access (owner or admin)
const authorizeProjectAccess: RequestHandler = async (req, res, next) => {
  appAssert(req.userId, HTTPSTATUS.UNAUTHORIZED, "Unauthorized"); // Ensure user is authenticated

  if (req.isAdmin) return next();

  const projectId = projectIdSchema.parse(req.params.id);

  const projectExists = await ProjectModel.findById(projectId);

  appAssert(
    projectExists?.userId.equals(req.userId),
    HTTPSTATUS.FORBIDDEN,
    "Access denied",
    AppErrorCode.Forbidden
  );

  next();
};

// Log access (owner or admin)
const authorizeLogAccess: RequestHandler = async (req, res, next) => {
  appAssert(req.userId, HTTPSTATUS.UNAUTHORIZED, "Unauthorized"); // Ensure user is authenticated

  if (req.isAdmin) return next();

  if (req.params.projectId) {
    const projectId = projectIdSchema.parse(req.params.projectId);

    const projectExists = await ProjectModel.findById(projectId);

    appAssert(
      projectExists?.userId.equals(req.userId),
      HTTPSTATUS.FORBIDDEN,
      "Access denied",
      AppErrorCode.Forbidden
    );

    return next();
  }

  if (req.params.id) {
    const logId = loginSchema.parse(req.params.id);

    const logExists = await LogModel.findById(logId);
    const projectExists = await ProjectModel.findById(logExists?.projectId);

    appAssert(
      projectExists?.userId.equals(req.userId),
      HTTPSTATUS.FORBIDDEN,
      "Access denied",
      AppErrorCode.Forbidden
    );

    return next();
  }

  appAssert(false, HTTPSTATUS.BAD_REQUEST, "Invalid request parameters");
};

export { authorizeAdmin, authorizeProjectAccess, authorizeLogAccess };
