"use client";

import { useQuery } from "@tanstack/react-query";
import { getProjectLogsMutationFn } from "@/lib/api/log.api"; // You'll need to create this

export const LOGS_QUERY_KEY = "project_logs";

const useLogs = (projectId: string) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [LOGS_QUERY_KEY, projectId],
    queryFn: () => getProjectLogsMutationFn(projectId),
    staleTime: 1000 * 60 * 5,
  });

  const logs = data?.data || [];

  return { logs, isLoading, isError, refetch };
};

export default useLogs;
