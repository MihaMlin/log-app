"use client";

import { getProjectByIdMutaionFn } from "@/lib/api/project.api";
import { useQuery } from "@tanstack/react-query";

export const PROJECT_ID_QUERY_KEY = "project_id";

const useProject = (id: string) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [PROJECT_ID_QUERY_KEY],
    queryFn: () => getProjectByIdMutaionFn(id),
    staleTime: 1000 * 60 * 5,
  });

  const project = data?.data || [];

  return { project, isLoading, isError, refetch };
};

export default useProject;
