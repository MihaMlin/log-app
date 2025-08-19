"use client";

import { getUserProjectsMutationFn } from "@/lib/api/project.api";
import { ProjectType } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const PROJECTS_QUERY_KEY = "user_projects";

const useProjects = (opts = {}) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [PROJECTS_QUERY_KEY],
    queryFn: getUserProjectsMutationFn,
    staleTime: 1000 * 60 * 5,
    ...opts,
  });

  const projects = (data?.data as ProjectType[]) || [];

  return { projects, isLoading, isError, refetch };
};

export default useProjects;
