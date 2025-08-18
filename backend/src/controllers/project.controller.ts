import { HTTPSTATUS } from "../constants/http";
import asyncHandler from "../middleware/asyncHandler";
import ProjectModel from "../models/project.model";
import appAssert from "../utils/appAssert";
import {
  createProjectSchema,
  projectIdSchema,
  updateProjectSchema,
} from "../validators/project.validator";

export const getAllProjectsHandeler = asyncHandler(async (req, res) => {
  const projects = await ProjectModel.find().sort({ createdAt: -1 });
  return res.status(HTTPSTATUS.OK).json(projects);
});

export const getUserProjectsHandler = asyncHandler(async (req, res) => {
  const projects = await ProjectModel.find({ userId: req.userId }).sort({
    createdAt: -1,
  });

  return res.status(HTTPSTATUS.OK).json(projects);
});

export const getProjectByIdHandler = asyncHandler(async (req, res) => {
  const projectId = projectIdSchema.parse(req.params.id);

  const project = await ProjectModel.findById(projectId);

  appAssert(project, HTTPSTATUS.NOT_FOUND, "Project not found");

  return res.status(HTTPSTATUS.OK).json(project);
});

export const createProjectHandler = asyncHandler(async (req, res) => {
  const { name, description, status, tags } = createProjectSchema.parse(
    req.body
  );

  const existingProject = await ProjectModel.findOne({
    userId: req.userId,
    name,
  });

  appAssert(
    !existingProject,
    HTTPSTATUS.CONFLICT,
    "Project with this name already exists"
  );

  const project = await ProjectModel.create({
    userId: req.userId,
    name,
    description,
    status,
    tags,
  });

  appAssert(
    project,
    HTTPSTATUS.INTERNAL_SERVER_ERROR,
    "Failed to create project"
  );

  return res.status(HTTPSTATUS.CREATED).json(project);
});

export const updateProjectHandler = asyncHandler(async (req, res) => {
  const { projectId, name, description, status, tags } =
    updateProjectSchema.parse({
      projectId: req.params.id,
      ...req.body,
    });

  const existingProject = await ProjectModel.findOne({
    userId: req.userId,
    name,
  });

  appAssert(
    !existingProject,
    HTTPSTATUS.CONFLICT,
    "Project with this name already exists"
  );

  const project = await ProjectModel.findByIdAndUpdate(
    projectId,
    { name, description, status, tags },
    { new: true }
  );

  appAssert(project, HTTPSTATUS.NOT_FOUND, "Project not found");

  return res.status(HTTPSTATUS.OK).json(project);
});

export const deleteProjectHandler = asyncHandler(async (req, res) => {
  const projectId = projectIdSchema.parse(req.params.id);

  const project = await ProjectModel.findByIdAndDelete({ projectId });

  appAssert(project, HTTPSTATUS.NOT_FOUND, "Project not found");

  return res.status(HTTPSTATUS.OK).send({ message: "Project removed" });
});
