"use client";

import { useEffect } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";

export default function SecurityPage() {
  useEffect(() => {
    // Set light mode for settings page
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }, []);

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="flex h-screen">
        <Sidebar activePage="settings-security" />

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
                className="px-3 py-2 transition-colors duration-200 text-gray-600 hover:text-black"
              >
                <span className="font-normal text-sm">Personal Profile</span>
              </Link>
              <Link
                href="/settings/security"
                className="px-3 py-2 transition-colors duration-200 text-black border-b-2 border-black"
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
                {/* Password Section */}
                <div className="bg-white border border-gray-400 p-6 w-full mb-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-medium text-black mb-2">
                      Password
                    </h3>
                    <p className="text-black text-sm leading-relaxed mb-4">
                      Make sure your new password is strong and secure.
                    </p>
                    <input
                      type="password"
                      placeholder="Enter your new password"
                      className="w-96 border border-gray-300 px-4 py-2 text-black placeholder-gray-500 focus:outline-none focus:border-gray-400"
                    />
                  </div>
                  <div className="border-t border-gray-200 pt-4 flex justify-between items-center -mx-6 px-6">
                    <p className="text-black text-sm">
                      Must be at least 8 characters
                    </p>
                    <button className="px-4 py-2 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors duration-200">
                      Change
                    </button>
                  </div>
                </div>

                {/* Multi-factor Authentication Section */}
                <div className="bg-white border border-gray-400 p-6 w-full opacity-60 blur-[1px] pointer-events-none">
                  <div className="mb-4">
                    <h3 className="text-xl font-medium text-black mb-2">
                      Multi-factor authentication
                    </h3>
                    <p className="text-black text-sm leading-relaxed mb-4">
                      Add an additional layer of security to your account by
                      requiring more than just a password to sign in
                    </p>
                  </div>
                  <div className="border-t border-gray-200 pt-4 flex justify-end -mx-6 px-6">
                    <button className="px-4 py-2 bg-white text-black text-sm font-medium border border-gray-300 hover:text-gray-700 hover:border-gray-400 hover:shadow-md transition-colors duration-200">
                      Add new device
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
