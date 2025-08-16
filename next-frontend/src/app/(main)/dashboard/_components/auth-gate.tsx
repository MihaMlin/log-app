"use client";

import { useAuthContext } from "@/context/auth-provider";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

export function AuthGate({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2">
        <Spinner className="h-8" />
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2">
        <Spinner className="h-8" />
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return <>{children}</>;
}
