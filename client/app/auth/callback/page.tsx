"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Image from "next/image";

export default function AuthCallbackPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithGoogle, loginWithGitHub } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const error = searchParams.get("error");
      const state = searchParams.get("state");

      if (error) {
        setStatus("error");
        setMessage("Authentication failed. Please try again.");
        return;
      }

      if (!code) {
        setStatus("error");
        setMessage("No authorization code received.");
        return;
      }

      try {
        const redirectUri = `${window.location.origin}/auth/callback`;

        // Determine which OAuth provider was used based on the state or other indicators
        // For now, we'll try Google first, then GitHub
        let result;

        try {
          result = await loginWithGoogle(code, redirectUri);
        } catch (googleError) {
          // If Google fails, try GitHub
          result = await loginWithGitHub(code, redirectUri);
        }

        if (result.success) {
          setStatus("success");
          setMessage("Authentication successful! Redirecting...");
          setTimeout(() => {
            router.push("/dashboard");
          }, 1000);
        } else {
          setStatus("error");
          setMessage(result.message || "Authentication failed.");
        }
      } catch (error) {
        setStatus("error");
        setMessage("An unexpected error occurred. Please try again.");
      }
    };

    handleCallback();
  }, [searchParams, loginWithGoogle, loginWithGitHub, router]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="mb-6">
          <Image
            src="/leetguard-logo-black.svg"
            alt="LeetGuard Logo"
            width={60}
            height={60}
            className="mx-auto"
          />
        </div>

        {status === "loading" && (
          <div>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Completing authentication...</p>
          </div>
        )}

        {status === "success" && (
          <div>
            <div className="text-green-600 mb-4">
              <svg
                className="w-8 h-8 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-gray-600">{message}</p>
          </div>
        )}

        {status === "error" && (
          <div>
            <div className="text-red-600 mb-4">
              <svg
                className="w-8 h-8 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <p className="text-gray-600 mb-4">{message}</p>
            <button
              onClick={() => router.push("/login")}
              className="text-black font-medium hover:underline"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
