"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";

interface MarketingPageWrapperProps {
  children: React.ReactNode;
}

export function MarketingPageWrapper({ children }: MarketingPageWrapperProps) {
  const { isAuthenticated, isLoading } = useAuth();

  // Handle logout by refreshing the page to show unauthenticated version
  useEffect(() => {
    const handleLogout = () => {
      // User logged out, refresh the page to show unauthenticated version
      window.location.reload();
    };

    // Listen for the custom logout event
    window.addEventListener("userLoggedOut", handleLogout);

    // Also listen for storage changes (when user logs out from another tab/window)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "access_token" && e.newValue === null) {
        window.location.reload();
      }
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("userLoggedOut", handleLogout);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  // Always show the marketing content, but pass auth state to children
  return <>{children}</>;
}
