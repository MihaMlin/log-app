"use client";

import { useQuery } from "@tanstack/react-query";
import { getProjectLogsMutationFn } from "@/lib/api/log.api";
import { LogType, PaginationType } from "@/types";
import { SeverityBadge } from "@/app/(main)/dashboard/projects/[id]/_componets/stats-card";

export const LOGS_QUERY_KEY = "project_logs";

type UseLogsParams = {
  currentPage?: number;
  pageSize?: number;
  search?: string;
  severity?: string;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
};
interface UseLogsOptions {
  projectId: string;
  params?: UseLogsParams;
}

const useLogs = ({ projectId, params = {} }: UseLogsOptions) => {
  const {
    currentPage = 0,
    pageSize = 10,
    search = "",
    severity,
    sortBy,
    sortDirection,
  } = params;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [
      LOGS_QUERY_KEY,
      projectId,
      currentPage,
      pageSize,
      search,
      severity,
      sortBy,
      sortDirection,
    ],
    queryFn: () =>
      getProjectLogsMutationFn({
        projectId,
        params: {
          currentPage,
          pageSize,
          search,
          severity,
          sortBy,
          sortDirection,
        },
      }),
    staleTime: 1000 * 60 * 5,
  });

  return {
    logs: (data?.data.logs as LogType[]) || [],
    pagination: (data?.data.pagination as PaginationType) || {},
    isLoading,
    isError,
    refetch,
  };
};

export default useLogs;
