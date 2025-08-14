"use client";

import { useEffect } from "react";
import Sidebar from "@/components/Sidebar";

export default function ActivityPage() {
  useEffect(() => {
    // Set light mode for activity page
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }, []);

  return (
    <div className="min-h-screen text-black">
      <div className="flex h-screen">
        <Sidebar activePage="activity" />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-32 border-b border-gray-200 flex items-center px-6 bg-white">
            <h1 className="text-4xl font-normal text-black">My Activity</h1>
          </header>

          {/* Content Area */}
          <main className="flex-1 p-6 overflow-y-auto">
            <div className="flex justify-center items-center h-full">
              <div className="text-center">
                <h2 className="text-2xl font-medium text-gray-900 mb-4">
                  Activity Page
                </h2>
                <p className="text-gray-600">Content coming soon...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
