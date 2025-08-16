"use client";

import { getUserMutationFn } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const AUTH = "auth"; // Unique key for the auth user query

const useAuth = (opts = {}) => {
  const { data, ...rest } = useQuery({
    queryKey: [AUTH],
    queryFn: getUserMutationFn,
    staleTime: Infinity, // remove to disable caching
    ...opts,
  });

  const user = data?.data; // API response structure may vary, adjust accordingly

  return { user, ...rest };
};

export default useAuth;
