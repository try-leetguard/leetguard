"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import Sidebar from "@/components/Sidebar";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Trash2, Loader2 } from "lucide-react";
import BlocklistAPI from "@/lib/blocklist-api";

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const [blocklist, setBlocklist] = useState<string[]>([]);
  const [blocklistLoading, setBlocklistLoading] = useState(true);

  useEffect(() => {
    // Set light mode for dashboard page
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }, []);

  // Load user's blocklist
  useEffect(() => {
    const loadBlocklist = async () => {
      if (!isAuthenticated) {
        setBlocklist([]);
        setBlocklistLoading(false);
        return;
      }

      try {
        setBlocklistLoading(true);
        const userBlocklist = await BlocklistAPI.getUserBlocklist();
        setBlocklist(userBlocklist);
      } catch (error) {
        console.error("Failed to load blocklist for dashboard:", error);
        setBlocklist([]);
      } finally {
        setBlocklistLoading(false);
      }
    };

    loadBlocklist();
  }, [isAuthenticated, user]);

  // Generate mini activity data (last 7 days)
  const generateMiniActivityData = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map((day) => ({
      day,
      focusedTime: Math.floor(Math.random() * 240) + 60, // Random minutes between 60-300
    }));
  };

  const miniActivityData = generateMiniActivityData();

  // Helper to extract domain for favicon
  function getDomain(site: string) {
    try {
      let url = site;
      if (!/^https?:\/\//.test(site)) url = "http://" + site;
      return new URL(url).hostname;
    } catch {
      return site;
    }
  }

  const removeSite = async (site: string) => {
    if (!isAuthenticated) return;

    // Store original state for potential revert
    const originalBlocklist = [...blocklist];

    try {
      // Optimistically update UI
      setBlocklist(blocklist.filter((s) => s !== site));

      // Make API call
      await BlocklistAPI.removeWebsite(site);
    } catch (error) {
      console.error("Failed to remove website:", error);
      // Revert optimistic update
      setBlocklist(originalBlocklist);
    }
  };

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
          <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
            <div className="flex justify-center">
              <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch w-full max-w-5xl">
                {/* My Activity Card */}
                <a
                  href="/activity"
                  className="flex-1 bg-white border border-gray-400 shadow-md p-6 hover:shadow-lg transition-shadow duration-200 flex flex-col font-dm-sans"
                >
                  <span className="text-2xl font-medium mb-2 text-center">
                    My Activity
                  </span>
                  <span className="text-neutral-600 mb-4 text-center text-sm">
                    Your focus time this week
                  </span>

                  {/* Static Activity Graph */}
                  <div className="flex-1 flex items-center justify-center">
                    <div className="w-full h-32 border border-gray-200 p-2">
                      <div className="flex items-end justify-between h-full gap-1">
                        <div
                          className="flex-1 border border-black"
                          style={{
                            height: "60%",
                            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 2px, #000 4px, #000 4px)`,
                          }}
                        ></div>
                        <div
                          className="flex-1 border border-black"
                          style={{
                            height: "80%",
                            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 2px, #000 4px, #000 4px)`,
                          }}
                        ></div>
                        <div
                          className="flex-1 border border-black"
                          style={{
                            height: "40%",
                            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 2px, #000 4px, #000 4px)`,
                          }}
                        ></div>
                        <div
                          className="flex-1 border border-black"
                          style={{
                            height: "90%",
                            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 2px, #000 4px, #000 4px)`,
                          }}
                        ></div>
                        <div
                          className="flex-1 border border-black"
                          style={{
                            height: "70%",
                            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 2px, #000 4px, #000 4px)`,
                          }}
                        ></div>
                        <div
                          className="flex-1 border border-black"
                          style={{
                            height: "50%",
                            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 2px, #000 4px, #000 4px)`,
                          }}
                        ></div>
                        <div
                          className="flex-1 border border-black"
                          style={{
                            height: "85%",
                            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 2px, #000 4px, #000 4px)`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </a>

                {/* Block List Card */}
                <a
                  href="/blocklist"
                  className="flex-1 bg-white border border-gray-400 shadow-md p-6 hover:shadow-lg transition-shadow duration-200 flex flex-col font-dm-sans"
                >
                  <span className="text-2xl font-medium mb-2 text-center">
                    Block List
                  </span>
                  <span className="text-neutral-600 mb-4 text-center text-sm">
                    Currently blocked sites
                  </span>

                  {/* Mini Blocklist */}
                  <div className="flex-1 flex flex-col gap-1">
                    {blocklistLoading ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2
                          size={16}
                          className="animate-spin text-gray-400"
                        />
                      </div>
                    ) : !isAuthenticated ? (
                      <div className="text-center py-4 text-sm text-gray-500">
                        Login to see your blocklist
                      </div>
                    ) : blocklist.length === 0 ? (
                      <div className="text-center py-4 text-sm text-gray-500">
                        No sites blocked yet
                      </div>
                    ) : (
                      blocklist.slice(0, 4).map((site) => (
                        <div
                          key={site}
                          className="flex items-center justify-between bg-gray-50 border border-gray-200 px-3 py-1.5 text-sm"
                        >
                          <span className="flex items-center text-black truncate">
                            <img
                              src={`https://icons.duckduckgo.com/ip3/${getDomain(
                                site
                              )}.ico`}
                              alt=""
                              className="w-4 h-4 mr-2 rounded-none flex-shrink-0"
                            />
                            <span className="truncate">{site}</span>
                          </span>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              removeSite(site);
                            }}
                            className="text-red-500 hover:text-red-700 p-1 flex-shrink-0"
                            aria-label={`Remove ${site}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </a>

                {/* Log Card */}
                <a
                  href="/log"
                  className="flex-1 bg-white border border-gray-400 shadow-md p-6 hover:shadow-lg transition-shadow duration-200 flex flex-col items-center text-center font-dm-sans"
                >
                  <span className="text-2xl font-medium mb-2">Log</span>
                  <span className="text-neutral-600 mb-4">
                    View and manage your activity logs and records.
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
