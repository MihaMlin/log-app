"use client";

import { useAuthContext } from "@/context/auth-provider";

export default function Page() {
  const { user, isLoading } = useAuthContext();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <div>HELLO FROM DASHBOARD</div>;
}
