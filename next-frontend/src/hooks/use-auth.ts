"use client";

import { getUserMutationFn } from "@/lib/api/user.api";
import { UserType } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const AUTH_QUERY_KEY = "auth"; // Unique key for the auth user query

const useAuth = (opts = {}) => {
  const { data, ...rest } = useQuery({
    queryKey: [AUTH_QUERY_KEY],
    queryFn: getUserMutationFn,
    staleTime: Infinity, // remove to disable caching
    ...opts,
  });

  const user = data?.data as UserType; // API response structure may vary, adjust accordingly

  return { user, ...rest };
};

export default useAuth;
