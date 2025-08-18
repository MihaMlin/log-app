import API from "../axios-client";

type CreateProjectType = {
  name: string;
  description?: string;
  status: "active" | "archived" | "completed";
  tags?: string[];
};

type UpdateProjectType = {
  name?: string;
  description?: string;
  status?: "active" | "archived" | "completed";
  tags?: string[];
};

export const getAllProjectsMutationFn = async () =>
  await API.get("/projects/all");

export const getUserProjectsMutationFn = async () => await API.get("/projects");

export const getProjectByIdMutaionFn = async (id: string) =>
  await API.get(`/projects/${id}`);

export const createProjectMutationFn = async (data: CreateProjectType) =>
  await API.post("/projects", data);

export const updateProjectMutationFn = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateProjectType;
}) => await API.put(`/projects/${id}`, data);

export const deleteProjectMutationFn = async (id: string) =>
  await API.delete(`/projects/${id}`);
