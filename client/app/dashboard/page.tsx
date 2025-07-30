"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import Sidebar from "@/components/Sidebar";

export default function DashboardPage() {
  const { user } = useAuth();

  useEffect(() => {
    // Set light mode for dashboard page
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }, []);

  return (
    <div className="min-h-screen text-black">
      <div className="flex h-screen">
        <Sidebar activePage="dashboard" />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-32 border-b border-gray-200 flex items-center px-6 bg-white">
            <h1 className="text-4xl font-normal text-black">
              Welcome,{" "}
              {user?.display_name ||
                (user?.email ? user.email.split("@")[0] : "User")}
            </h1>
          </header>

          {/* Content Area */}
          <main className="flex-1 p-6 overflow-y-auto bg-[#FDFBF7]">
            <div className="flex justify-center">
              <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch w-full max-w-5xl">
                {/* My Activity Card */}
                <a
                  href="/activity"
                  className="flex-1 bg-white border border-gray-400 shadow-md p-6 hover:shadow-lg transition-shadow duration-200 flex flex-col items-center text-center font-dm-sans"
                >
                  <span className="text-2xl font-medium mb-2">My Activity</span>
                  <span className="text-neutral-600 mb-4">
                    View your recent coding activity and progress.
                  </span>
                  <span className="mt-auto text-blue-600 font-medium hover:underline">
                    Go to Activity →
                  </span>
                </a>
                {/* Block List Card */}
                <a
                  href="/blocklist"
                  className="flex-1 bg-white border border-gray-400 shadow-md p-6 hover:shadow-lg transition-shadow duration-200 flex flex-col items-center text-center font-dm-sans"
                >
                  <span className="text-2xl font-medium mb-2">Block List</span>
                  <span className="text-neutral-600 mb-4">
                    Manage the sites and distractions you want to block.
                  </span>
                  <span className="mt-auto text-blue-600 font-medium hover:underline">
                    Go to Block List →
                  </span>
                </a>
                {/* Focus Sessions Card */}
                <a
                  href="/focus"
                  className="flex-1 bg-white border border-gray-400 shadow-md p-6 hover:shadow-lg transition-shadow duration-200 flex flex-col items-center text-center font-dm-sans"
                >
                  <span className="text-2xl font-medium mb-2">
                    Focus Sessions
                  </span>
                  <span className="text-neutral-600 mb-4">
                    Start or review your focus sessions for deep work.
                  </span>
                  <span className="mt-auto text-blue-600 font-medium hover:underline">
                    Go to Focus Sessions →
                  </span>
                </a>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
