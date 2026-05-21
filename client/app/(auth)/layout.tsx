"use client";

import { Suspense } from "react";
import { ReverseProtectedRoute } from "@/components/ReverseProtectedRoute";

function AuthLayoutFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black" />
    </div>
  );
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<AuthLayoutFallback />}>
      <ReverseProtectedRoute fallback={<AuthLayoutFallback />}>
        {children}
      </ReverseProtectedRoute>
    </Suspense>
  );
}
