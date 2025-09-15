"use client";

import { useEffect, useState, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import {
  Calendar,
  Clock,
  Activity,
  Filter,
  Search,
  Download,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import ActivityAPI, { Activity as APIActivity } from "@/lib/activity-api";
import { ProtectedRoute } from "@/components/ProtectedRoute";

interface LeetCodeProblem {
  id: string;
  dateCompleted: string;
  problemName: string;
  problemUrl: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Unknown";
  topicTags: string[];
  status: "solved" | "attempted";
  timeSpent?: number; // in minutes
  notes?: string;
}

export default function LogPage() {
  const { user, isAuthenticated } = useAuth();
  const [problems, setProblems] = useState<LeetCodeProblem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Convert API activity to LeetCodeProblem format
  const convertAPIActivityToLeetCodeProblem = (
    activity: APIActivity
  ): LeetCodeProblem => {
    return {
      id: activity.id.toString(),
      dateCompleted: activity.completed_at
        ? new Date(activity.completed_at).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      problemName: activity.problem_name,
      problemUrl: activity.problem_url,
      difficulty: activity.difficulty,
      topicTags: activity.topic_tags,
      status: activity.status === "completed" ? "solved" : "attempted",
      timeSpent: undefined, // Not available from API
      notes: undefined, // Not available from API
    };
  };

  // Load user's activities from API
  useEffect(() => {
    const loadActivities = async () => {
      if (!isAuthenticated) {
        setProblems([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const activities = await ActivityAPI.getUserActivities(100, 0);
        const convertedProblems = activities.map(
          convertAPIActivityToLeetCodeProblem
        );
        setProblems(convertedProblems);
      } catch (error) {
        console.error("Failed to load activities:", error);
        setError("Failed to load your activity log. Please try again.");
        setProblems([]);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, [isAuthenticated, user]);

  const [filterDifficulty, setFilterDifficulty] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDifficultyDropdown, setShowDifficultyDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const difficultyDropdownRef = useRef<HTMLDivElement>(null);
  const statusDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set light mode for log page
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }, []);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        difficultyDropdownRef.current &&
        !difficultyDropdownRef.current.contains(event.target as Node)
      ) {
        setShowDifficultyDropdown(false);
      }
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target as Node)
      ) {
        setShowStatusDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "solved":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "attempted":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusDisplayText = (status: string) => {
    switch (status) {
      case "solved":
        return "Solved";
      case "attempted":
        return "Attempted";
      default:
        return "All Status";
    }
  };

  const filteredProblems = problems.filter((problem) => {
    const matchesDifficulty =
      filterDifficulty === "all" || problem.difficulty === filterDifficulty;
    const matchesStatus =
      filterStatus === "all" || problem.status === filterStatus;
    const matchesSearch =
      problem.problemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem.topicTags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesDifficulty && matchesStatus && matchesSearch;
  });

  return (
    <ProtectedRoute>
      <div className="min-h-screen text-black">
        <div className="flex h-screen">
          <Sidebar activePage="log" />

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <header className="h-32 border-b border-gray-200 flex items-center px-6 bg-white">
              <h1 className="text-4xl font-normal text-black">Tracker</h1>
            </header>

            {/* Content Area */}
            <main className="flex-1 p-6 overflow-y-auto bg-white">
              {/* Controls */}
              <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search problems or tags..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-sm focus:outline-none hover:border-black focus:border-black w-64 transition-colors duration-300"
                    />
                  </div>

                  {/* Difficulty Filter */}
                  <div className="relative" ref={difficultyDropdownRef}>
                    <button
                      onClick={() =>
                        setShowDifficultyDropdown(!showDifficultyDropdown)
                      }
                      className="pl-4 pr-2 py-2 border border-gray-300 rounded-sm focus:outline-none bg-white flex items-center justify-between w-[160px]"
                    >
                      <span>
                        {filterDifficulty === "all"
                          ? "All Difficulties"
                          : filterDifficulty}
                      </span>
                      <ChevronDown className="w-4 h-4 text-black ml-3" />
                    </button>
                    {showDifficultyDropdown && (
                      <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                        <div
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setFilterDifficulty("all");
                            setShowDifficultyDropdown(false);
                          }}
                        >
                          All Difficulties
                        </div>
                        <div
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setFilterDifficulty("Easy");
                            setShowDifficultyDropdown(false);
                          }}
                        >
                          Easy
                        </div>
                        <div
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setFilterDifficulty("Medium");
                            setShowDifficultyDropdown(false);
                          }}
                        >
                          Medium
                        </div>
                        <div
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setFilterDifficulty("Hard");
                            setShowDifficultyDropdown(false);
                          }}
                        >
                          Hard
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Status Filter */}
                  <div className="relative" ref={statusDropdownRef}>
                    <button
                      onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                      className="pl-4 pr-2 py-2 border border-gray-300 rounded-sm focus:outline-none bg-white flex items-center justify-between w-[140px]"
                    >
                      <span>{getStatusDisplayText(filterStatus)}</span>
                      <ChevronDown className="w-4 h-4 text-black ml-3" />
                    </button>
                    {showStatusDropdown && (
                      <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                        <div
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setFilterStatus("all");
                            setShowStatusDropdown(false);
                          }}
                        >
                          All Status
                        </div>
                        <div
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setFilterStatus("solved");
                            setShowStatusDropdown(false);
                          }}
                        >
                          Solved
                        </div>
                        <div
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setFilterStatus("attempted");
                            setShowStatusDropdown(false);
                          }}
                        >
                          Attempted
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Excel-like Table */}
              <div className="bg-white rounded-lg border border-gray-300 overflow-hidden shadow-sm">
                {/* Table Header */}
                <div className="border-b border-gray-200">
                  <div className="grid grid-cols-6 gap-4 px-6 py-3 text-sm font-medium text-black">
                    <div className="col-span-1">Date</div>
                    <div className="col-span-2">Problem Name</div>
                    <div className="col-span-1">Difficulty</div>
                    <div className="col-span-1">Status</div>
                    <div className="col-span-1">Topics</div>
                  </div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-gray-200">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2
                        size={24}
                        className="animate-spin text-gray-400 mr-2"
                      />
                      <span className="text-gray-600">
                        Loading your activity log...
                      </span>
                    </div>
                  ) : error ? (
                    <div className="text-center py-12">
                      <AlertCircle
                        size={24}
                        className="text-red-500 mx-auto mb-2"
                      />
                      <p className="text-red-600 mb-4">{error}</p>
                      <button
                        onClick={() => window.location.reload()}
                        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : !isAuthenticated ? (
                    <div className="text-center py-12">
                      <Activity
                        size={24}
                        className="text-gray-400 mx-auto mb-2"
                      />
                      <p className="text-gray-600 mb-4">
                        Please log in to view your activity log
                      </p>
                      <a
                        href="/login"
                        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
                      >
                        Log In
                      </a>
                    </div>
                  ) : problems.length === 0 ? (
                    <div className="text-center py-12">
                      <Activity
                        size={24}
                        className="text-gray-400 mx-auto mb-2"
                      />
                      <p className="text-gray-600 mb-2">
                        No LeetCode activities yet
                      </p>
                      <p className="text-sm text-gray-500">
                        Start solving problems and they'll appear here!
                      </p>
                    </div>
                  ) : filteredProblems.length === 0 ? (
                    <div className="text-center py-12">
                      <Search
                        size={24}
                        className="text-gray-400 mx-auto mb-2"
                      />
                      <p className="text-gray-600">
                        No problems match your current filters
                      </p>
                      <p className="text-sm text-gray-500">
                        Try adjusting your search or filter criteria
                      </p>
                    </div>
                  ) : (
                    filteredProblems.map((problem) => (
                      <div
                        key={problem.id}
                        className="grid grid-cols-6 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors text-sm items-center"
                      >
                        {/* Date */}
                        <div className="col-span-1 text-gray-600 flex items-center">
                          {problem.dateCompleted}
                        </div>

                        {/* Problem Name */}
                        <div className="col-span-2 flex items-center">
                          <div className="flex items-center space-x-2 max-w-xs">
                            <span className="font-medium text-gray-900 truncate">
                              {problem.problemName}
                            </span>
                            <a
                              href={problem.problemUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 flex-shrink-0"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>

                        {/* Difficulty */}
                        <div className="col-span-1 flex items-center">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                              problem.difficulty
                            )}`}
                          >
                            {problem.difficulty}
                          </span>
                        </div>

                        {/* Status */}
                        <div className="col-span-1 flex items-center">
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(problem.status)}
                            <span className="capitalize">{problem.status}</span>
                          </div>
                        </div>

                        {/* Topics */}
                        <div className="col-span-1 flex items-center">
                          <div className="flex flex-wrap items-center gap-1">
                            {problem.topicTags.slice(0, 2).map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700"
                              >
                                {tag}
                              </span>
                            ))}
                            {problem.topicTags.length > 2 && (
                              <span className="text-xs text-gray-500 flex items-center">
                                +{problem.topicTags.length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
