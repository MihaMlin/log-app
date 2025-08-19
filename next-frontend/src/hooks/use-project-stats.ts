"use client";

import { getProjectStatsMutationFn } from "@/lib/api/log.api";
import { useQuery } from "@tanstack/react-query";

export const PROJECT_STATS_QUERY_KEY = "project_stats";

const useProjectStats = (projectId: string) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [PROJECT_STATS_QUERY_KEY, projectId],
    queryFn: () => getProjectStatsMutationFn(projectId),
    staleTime: 1000 * 60 * 5,
  });

  const last24Hours = data?.data.last24Hours || 0;
  const lastHour = data?.data.lastHour || 0;
  const bySeverity = data?.data.bySeverity || {};

  const stats = { last24Hours, lastHour, bySeverity };

  return { stats, isLoading, isError, refetch };
};

export default useProjectStats;
