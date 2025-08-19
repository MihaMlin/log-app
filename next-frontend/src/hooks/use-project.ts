"use client";

import { getProjectByIdMutaionFn } from "@/lib/api/project.api";
import { ProjectType } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const PROJECT_QUERY_KEY = "project";

const useProject = (id: string) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [PROJECT_QUERY_KEY, id],
    queryFn: () => getProjectByIdMutaionFn(id),
    staleTime: 1000 * 60 * 5,
  });

  const project = (data?.data as ProjectType) || [];

  return { project, isLoading, isError, refetch };
};

export default useProject;
