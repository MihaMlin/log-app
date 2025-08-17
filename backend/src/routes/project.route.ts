import { Router } from "express";
import {
  getUserProjectsHandler,
  getProjectByIdHandler,
  createProjectHandler,
  updateProjectHandler,
  deleteProjectHandler,
  getAllProjectsHandeler,
} from "../controllers/project.controller";
import {
  authorizeAdmin,
  authorizeProjectAccess,
} from "../middleware/authorize";
const projectRoutes = Router();

// prefix: /projects

// --- Admin only ---
projectRoutes.get("/all", authorizeAdmin, getAllProjectsHandeler);

// --- Current user ---
projectRoutes.get("/", getUserProjectsHandler);
projectRoutes.post("/", createProjectHandler);

// --- Owner or Admin ---
projectRoutes.get("/:id", authorizeProjectAccess, getProjectByIdHandler);
projectRoutes.put("/:id", authorizeProjectAccess, updateProjectHandler);
projectRoutes.delete("/:id", authorizeProjectAccess, deleteProjectHandler);

export default projectRoutes;
