"use client";

import { useEffect } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";

export default function DataPage() {
  useEffect(() => {
    // Set light mode for settings page
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }, []);

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="flex h-screen">
        <Sidebar activePage="settings-data" />

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
                className="px-3 py-2 transition-colors duration-200 text-gray-600 hover:text-black"
              >
                <span className="font-normal text-sm">Security & Access</span>
              </Link>
              <Link
                href="/settings/data"
                className="px-3 py-2 transition-colors duration-200 text-black border-b-2 border-black"
              >
                <span className="font-normal text-sm">Data & Privacy</span>
              </Link>
            </div>
          </nav>

          {/* Content Area */}
          <main className="flex-1 p-6 overflow-y-auto">
            <div className="flex justify-start">
              <div className="w-[768px]">
                {/* Privacy and Terms Boxes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Privacy Policy Box */}
                  <div className="bg-white border border-gray-400 p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-medium text-black">
                        Privacy Policy
                      </h3>
                    </div>
                    <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                      Understand how we collect, use, and protect your personal
                      information.
                    </p>
                    <div className="border-t border-gray-200 pt-4 flex justify-end -mx-6 px-6">
                      <Link
                        href="/privacy"
                        className="inline-flex items-center text-sm font-medium text-black hover:text-gray-700 transition-colors duration-200 border border-gray-300 px-4 py-2 hover:border-gray-400 hover:shadow-md"
                      >
                        Privacy
                        <svg
                          className="w-4 h-4 ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>

                  {/* Terms of Service Box */}
                  <div className="bg-white border border-gray-400 p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-medium text-black">
                        Terms of Service
                      </h3>
                    </div>
                    <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                      Understand your rights and responsibilities when using our
                      platform.
                    </p>
                    <div className="border-t border-gray-200 pt-4 flex justify-end -mx-6 px-6">
                      <Link
                        href="/terms"
                        className="inline-flex items-center text-sm font-medium text-black hover:text-gray-700 transition-colors duration-200 border border-gray-300 px-4 py-2 hover:border-gray-400 hover:shadow-md"
                      >
                        Terms
                        <svg
                          className="w-4 h-4 ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Request Data Section */}
                <div className="bg-white border border-blue-700 p-6 opacity-60 blur-[1px] pointer-events-none">
                  <div className="mb-4">
                    <h3 className="text-xl font-medium text-black mb-2">
                      Request your data
                    </h3>
                    <p className="text-black text-sm leading-relaxed mb-4">
                      Download a copy of all your personal information stored
                      with us
                    </p>
                  </div>
                  <div className="border-t border-gray-200 pt-4 flex justify-end -mx-6 px-6">
                    <button className="px-4 py-2 bg-blue-700 text-white text-sm font-medium">
                      Get my data
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
