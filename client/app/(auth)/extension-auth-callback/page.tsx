"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";

export default function ExtensionAuthCallback() {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Get tokens from localStorage
      const accessToken = localStorage.getItem("access_token");
      const refreshToken = localStorage.getItem("refresh_token");

      if (accessToken && refreshToken) {
        // Send tokens to extension via postMessage
        window.postMessage(
          {
            type: "OAUTH_SUCCESS",
            tokens: {
              access_token: accessToken,
              refresh_token: refreshToken,
            },
            user: user,
          },
          "*"
        );

        // Show success message and close window
        setTimeout(() => {
          window.close();
        }, 2000);
      }
    }
  }, [isAuthenticated, user]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-black mb-4">
          Extension Authentication
        </h1>
        {isAuthenticated ? (
          <div>
            <p className="text-green-600 mb-2">
              ✅ Successfully authenticated!
            </p>
            <p className="text-gray-600">Syncing with extension...</p>
            <p className="text-sm text-gray-500 mt-4">
              This window will close automatically.
            </p>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 mb-4">
              Please log in to sync with the extension.
            </p>
            <a
              href="/login"
              className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors"
            >
              Log In
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
