"use client";

import { useEffect } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";

export default function SettingsPage() {
  useEffect(() => {
    // Set light mode for settings page
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-black">
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
                      className="w-96 border border-gray-300 px-4 py-2 text-black placeholder-gray-500 focus:outline-none focus:border-gray-400"
                    />
                  </div>
                  <div className="border-t border-gray-200 pt-4 flex justify-between items-center -mx-6 px-6">
                    <p className="text-black text-sm">
                      Please use 32 characters at maximum
                    </p>
                    <button className="px-4 py-2 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors duration-200">
                      Change
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
