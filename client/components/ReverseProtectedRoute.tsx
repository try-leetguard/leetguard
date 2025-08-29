"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

interface ReverseProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ReverseProtectedRoute({
  children,
  fallback,
}: ReverseProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Preserve any query parameters (like redirect=extension)
      const redirectParam = searchParams.get("redirect");
      const redirectUrl = redirectParam
        ? `/activity?redirect=${redirectParam}`
        : "/activity";

      console.log(
        "User is already authenticated, redirecting to:",
        redirectUrl
      );
      router.push(redirectUrl);
    }
  }, [isAuthenticated, isLoading, router, searchParams]);

  if (isLoading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        </div>
      )
    );
  }

  if (isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  return <>{children}</>;
}
