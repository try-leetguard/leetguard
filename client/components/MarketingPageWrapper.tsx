"use client";

import { useEffect } from "react";

interface MarketingPageWrapperProps {
  children: React.ReactNode;
}

export function MarketingPageWrapper({ children }: MarketingPageWrapperProps) {
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

  // Marketing pages should paint immediately; auth-only redirects belong on protected routes.
  return <>{children}</>;
}
