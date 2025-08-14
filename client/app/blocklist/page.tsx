"use client";

import { useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";
import { Trash2, CheckCircle, XCircle } from "lucide-react";

export default function BlockListPage() {
  useEffect(() => {
    // Set light mode for blocklist page
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }, []);

  return (
    <div className="min-h-screen text-black">
      <div className="flex h-screen">
        <Sidebar activePage="blocklist" />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-32 border-b border-gray-200 flex items-center px-6 bg-white">
            <h1 className="text-4xl font-normal text-black">Block List</h1>
          </header>

          {/* Content Area */}
          <main className="flex-1 p-6 overflow-y-auto">
            <div className="flex">
              <div className="w-full font-dm-sans">
                <BlockList />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function BlockList() {
  const [input, setInput] = useState("");
  const [list, setList] = useState<string[]>([
    "facebook.com",
    "netflix.com",
    "instagram.com",
    "youtube.com",
    "x.com",
  ]);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
    show: boolean;
  } | null>(null);

  // Auto-dismiss notification after 3 seconds
  useEffect(() => {
    if (notification && notification.show) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const addSite = () => {
    const trimmed = input.trim();
    if (!trimmed) {
      setNotification({
        type: "error",
        message: "Please enter a website URL",
        show: true,
      });
      return;
    }
    if (list.includes(trimmed)) {
      setNotification({
        type: "error",
        message: "Website already exists in blocklist",
        show: true,
      });
      return;
    }
    setList([trimmed, ...list]);
    setInput("");
    setNotification({
      type: "success",
      message: "Website added successfully",
      show: true,
    });
  };

  const removeSite = (site: string) => {
    setList(list.filter((s) => s !== site));
    setNotification({
      type: "success",
      message: `${site} removed successfully`,
      show: true,
    });
  };

  // Helper to extract domain for favicon
  function getDomain(site: string) {
    // Remove protocol and path, just get the domain
    try {
      let url = site;
      if (!/^https?:\/\//.test(site)) url = "http://" + site;
      return new URL(url).hostname;
    } catch {
      return site;
    }
  }

  return (
    <div className="bg-white border border-gray-400 shadow-md p-6 w-full flex flex-col gap-6 rounded-lg relative">
      {/* Add Site */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Add website (e.g. facebook.com)"
          className="flex-1 border border-gray-300 px-4 py-2 text-base outline-none font-dm-sans rounded-sm hover:border-black focus:border-black transition-colors duration-300"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addSite();
          }}
        />
        <button
          onClick={addSite}
          className="px-4 py-2 bg-black text-white font-medium font-dm-sans hover:bg-neutral-800 transition-colors border border-black/20 rounded-sm  "
        >
          Add
        </button>
      </div>
      {/* List */}
      <ul className="flex flex-col gap-2">
        {list.length === 0 ? (
          <li className="text-neutral-400 text-center py-8 select-none">
            No websites blocked yet.
          </li>
        ) : (
          list.map((site) => (
            <li
              key={site}
              className="flex items-center justify-between bg-gray-50 border border-gray-200 px-4 py-2 font-dm-sans rounded-sm"
            >
              <span className="flex items-center text-black break-all">
                <img
                  src={`https://icons.duckduckgo.com/ip3/${getDomain(
                    site
                  )}.ico`}
                  alt=""
                  className="w-5 h-5 mr-2 rounded-none"
                  style={{ minWidth: 20 }}
                />
                {site}
              </span>
              <button
                onClick={() => removeSite(site)}
                className="text-red-500 hover:text-red-700 p-1"
                aria-label={`Remove ${site}`}
              >
                <Trash2 size={18} />
              </button>
            </li>
          ))
        )}
      </ul>

      {/* Notification Card */}
      {notification && notification.show && (
        <div className="fixed bottom-6 right-6 z-50">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border transition-all duration-300 ${
              notification.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600" />
            )}
            <span className="font-medium">{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
