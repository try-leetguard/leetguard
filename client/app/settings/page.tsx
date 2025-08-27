"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/lib/auth-context";
import { apiClient } from "@/lib/api";

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Set light mode for settings page
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }, []);

  // Set display name when user data is available
  useEffect(() => {
    if (user?.display_name) {
      setDisplayName(user.display_name);
    } else if (user?.email) {
      const name = user.email.split("@")[0];
      setDisplayName(name);
    }
  }, [user]);

  const handleSaveDisplayName = async () => {
    if (!user) return;

    setIsLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setMessage("Authentication error. Please log in again.");
        return;
      }

      await apiClient.updateProfile(token, { display_name: displayName });
      setMessage("Display name updated successfully!");

      // Refresh user data to get the updated display name
      await refreshUser();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to update display name"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="flex h-screen">
        <Sidebar activePage="settings-profile" />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-32 flex items-center px-6 bg-white">
            <h1 className="text-4xl font-normal text-black">Settings</h1>
          </header>

          {/* Settings Navigation */}
          <nav className="border-b border-gray-200 px-6 bg-white">
            <div className="flex space-x-8">
              <Link
                href="/settings"
                className="px-3 py-2 transition-colors duration-200 text-black border-b-2 border-black"
              >
                <span className="font-normal text-sm">Personal Profile</span>
              </Link>
              <Link
                href="/settings/security"
                className="px-3 py-2 transition-colors duration-200 text-gray-600 hover:text-black"
              >
                <span className="font-normal text-sm">Security & Access</span>
              </Link>
              <Link
                href="/settings/data"
                className="px-3 py-2 transition-colors duration-200 text-gray-600 hover:text-black"
              >
                <span className="font-normal text-sm">Data & Privacy</span>
              </Link>
            </div>
          </nav>

          {/* Content Area */}
          <main className="flex-1 p-6 overflow-y-auto">
            <div className="flex justify-start">
              <div className="w-[768px]">
                {/* Display Name Section */}
                <div className="bg-white border border-gray-400 p-6 mb-6">
                  {message && (
                    <div
                      className={`mb-4 p-3 rounded text-sm ${
                        message.includes("successfully")
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      {message}
                    </div>
                  )}
                  <div className="mb-4">
                    <h3 className="text-xl font-medium text-black mb-2">
                      Display name
                    </h3>
                    <p className="text-black text-sm leading-relaxed mb-4">
                      Please enter your full name, or a display name you are
                      comfortable with.
                    </p>
                    <input
                      type="text"
                      placeholder="Enter your display name"
                      maxLength={32}
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-96 border border-gray-300 px-4 py-2 text-black placeholder-gray-500 focus:outline-none focus:border-gray-400"
                    />
                  </div>
                  <div className="border-t border-gray-200 pt-4 flex justify-between items-center -mx-6 px-6">
                    <p className="text-black text-sm">
                      Please use 32 characters at maximum
                    </p>
                    <button
                      onClick={handleSaveDisplayName}
                      disabled={isLoading}
                      className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                        isLoading
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-black text-white hover:bg-gray-800"
                      }`}
                    >
                      {isLoading ? "Saving..." : "Change"}
                    </button>
                  </div>
                </div>

                {/* Delete Account Section */}
                <div className="bg-white border border-red-500 p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-medium text-black mb-2">
                      Delete account
                    </h3>
                    <p className="text-black text-sm leading-relaxed">
                      This action cannot be undone. Your focus stats, blocked
                      sites, and account details will be removed from our system
                      completely.
                    </p>
                  </div>
                  <div className="border-t border-gray-200 pt-4 flex justify-end -mx-6 px-6">
                    <button className="px-4 py-2 bg-red-600 text-white text-white text-sm font-medium hover:bg-red-700 transition-colors duration-200">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
