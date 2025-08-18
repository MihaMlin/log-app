import API from "../axios-client";

type CreateLogType = {
  projectId: string;
  message: string;
  severity:
    | "emerg"
    | "alert"
    | "crit"
    | "err"
    | "warning"
    | "notice"
    | "info"
    | "debug";
  source: string;
};

type GetProjectLogsPaginatorParams = {
  currentPage?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
};

type GetProjectLogsPaginatorType = {
  projectId: string;
  params?: GetProjectLogsPaginatorParams;
};

export const getAllLogsMutationFn = async () => await API.get("/logs/");

export const getProjectLogsMutationFn = async ({
  projectId,
  params = {},
}: GetProjectLogsPaginatorType) => {
  const {
    currentPage = 0,
    pageSize = 10,
    search = "",
    sortBy,
    sortDirection,
  } = params;

  return await API.get(`/logs/project/${projectId}`, {
    params: {
      currentPage,
      pageSize,
      ...(search && { search }),
      ...(sortBy && { sortBy }),
      ...(sortDirection && { sortDirection }),
    },
  });
};

export const getProjectStatsMutationFn = async (projectId: string) =>
  await API.get(`/logs/project/${projectId}/stats`);

export const getLogByIdMutaionFn = async (id: string) =>
  await API.get(`/logs/${id}`);

export const createLogMutationFn = async ({
  projectId,
  data,
}: {
  projectId: string;
  data: CreateLogType;
}) => await API.post(`/logs/project/${projectId}`, data);

export const deleteLogMutationFn = async (id: string) =>
  await API.delete(`/projects/${id}`);
