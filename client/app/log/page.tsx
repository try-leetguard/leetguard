"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";

interface LeetCodeProblem {
  id: string;
  dateCompleted: string;
  problemName: string;
  problemUrl: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topicTags: string[];
  status: "solved" | "attempted";
  timeSpent?: number; // in minutes
  notes?: string;
}

export default function LogPage() {
  const [problems, setProblems] = useState<LeetCodeProblem[]>([
    {
      id: "1",
      dateCompleted: "2024-01-15",
      problemName: "Two Sum",
      problemUrl: "https://leetcode.com/problems/two-sum/",
      difficulty: "Easy",
      topicTags: ["Array", "Hash Table"],
      status: "solved",
      timeSpent: 15,
      notes: "Used hash map approach, O(n) time complexity",
    },
    {
      id: "2",
      dateCompleted: "2024-01-15",
      problemName: "Add Two Numbers",
      problemUrl: "https://leetcode.com/problems/add-two-numbers/",
      difficulty: "Medium",
      topicTags: ["Linked List", "Math", "Recursion"],
      status: "solved",
      timeSpent: 25,
      notes: "Carry handling was tricky, good practice for linked lists",
    },
    {
      id: "3",
      dateCompleted: "2024-01-14",
      problemName: "Longest Substring Without Repeating Characters",
      problemUrl:
        "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
      difficulty: "Medium",
      topicTags: ["Hash Table", "String", "Sliding Window"],
      status: "solved",
      timeSpent: 30,
      notes: "Sliding window technique, optimized to O(n)",
    },
    {
      id: "4",
      dateCompleted: "2024-01-14",
      problemName: "Median of Two Sorted Arrays",
      problemUrl: "https://leetcode.com/problems/median-of-two-sorted-arrays/",
      difficulty: "Hard",
      topicTags: ["Array", "Binary Search", "Divide and Conquer"],
      status: "attempted",
      timeSpent: 45,
      notes: "Need to review binary search approach",
    },
    {
      id: "5",
      dateCompleted: "2024-01-13",
      problemName: "Valid Parentheses",
      problemUrl: "https://leetcode.com/problems/valid-parentheses/",
      difficulty: "Easy",
      topicTags: ["String", "Stack"],
      status: "solved",
      timeSpent: 10,
      notes: "Stack implementation, straightforward",
    },
    {
      id: "6",
      dateCompleted: "2024-01-13",
      problemName: "Merge Two Sorted Lists",
      problemUrl: "https://leetcode.com/problems/merge-two-sorted-lists/",
      difficulty: "Easy",
      topicTags: ["Linked List", "Recursion"],
      status: "solved",
      timeSpent: 20,
      notes: "Recursive approach, clean solution",
    },
  ]);

  const [filterDifficulty, setFilterDifficulty] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Set light mode for log page
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
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
          <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
            {/* Controls */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search problems or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Difficulty Filter */}
                <select
                  value={filterDifficulty}
                  onChange={(e) => setFilterDifficulty(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Difficulties</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>

                {/* Status Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="solved">Solved</option>
                  <option value="attempted">Attempted</option>
                </select>
              </div>

              {/* Export Button */}
              <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors">
                <Download className="w-4 h-4" />
                Export to Excel
              </button>
            </div>

            {/* Excel-like Table */}
            <div className="bg-white rounded-lg border border-black overflow-hidden shadow-sm">
              {/* Table Header */}
              <div className="bg-gray-50 border-b border-gray-200">
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
                {filteredProblems.map((problem) => (
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
                ))}
              </div>

              {filteredProblems.length === 0 && (
                <div className="px-6 py-12 text-center">
                  <Activity className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No problems found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Try adjusting your search or filter criteria.
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
