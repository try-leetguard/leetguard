"use client";

import { useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";
import {
  Trash2,
  CheckCircle,
  XCircle,
  Info,
  Loader2,
  Shield,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import BlocklistAPI from "@/lib/blocklist-api";

// Extend Window interface for extension properties
declare global {
  interface Window {
    leetguardExtension?: {
      installed: boolean;
      version: string;
      isDeveloperMode: boolean;
      extensionId: string;
      features?: string[];
    };
  }
}

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

// Extension Info Component
function ExtensionInfo() {
  const [showDetails, setShowDetails] = useState(false);
  const [extensionData, setExtensionData] = useState<any>(null);

  useEffect(() => {
    // Get extension data from DOM marker or window property
    const marker = document.getElementById("leetguard-extension-installed");
    if (marker) {
      setExtensionData({
        version: marker.getAttribute("data-version"),
        isDeveloperMode: marker.getAttribute("data-dev-mode") === "true",
        extensionId: marker.getAttribute("data-extension-id"),
        detectedAt: marker.getAttribute("data-detected-at"),
      });
    } else if (window.leetguardExtension) {
      setExtensionData(window.leetguardExtension);
    }
  }, []);

  // Close details on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showDetails && !target.closest(".extension-info")) {
        setShowDetails(false);
      }
    };

    if (showDetails) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showDetails]);

  if (!extensionData) return null;

  return (
    <div className="relative extension-info">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="inline-flex items-center justify-center w-3 h-3 text-blue-600 hover:text-blue-800"
        title="Extension Details"
      >
        <Info size={12} />
      </button>

      {showDetails && (
        <div className="absolute top-6 left-0 bg-white border border-gray-400 rounded-lg shadow-lg p-3 z-10 min-w-64">
          <div className="text-xs space-y-2 font-mono">
            <div>
              <strong>Version:</strong> {extensionData.version}
            </div>
            <div>
              <strong>Mode:</strong>{" "}
              {extensionData.isDeveloperMode ? "Developer" : "Production"}
            </div>
            {extensionData.isDeveloperMode && (
              <div className="text-orange-600 text-xs">
                ⚠️ Running in developer mode
              </div>
            )}
            <div>
              <strong>ID:</strong>{" "}
              <code className="text-xs bg-gray-100 px-1 rounded">
                {extensionData.extensionId}
              </code>
            </div>
            {extensionData.features && (
              <div>
                <strong>Features:</strong>
                <ul className="text-xs mt-1 space-y-1">
                  {extensionData.features.map((feature: string) => (
                    <li key={feature} className="flex items-center gap-1">
                      <CheckCircle size={10} className="text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function BlockList() {
  const { user, isAuthenticated } = useAuth();
  const [input, setInput] = useState("");
  const [list, setList] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info";
    message: string;
    show: boolean;
  } | null>(null);
  const [extensionConnected, setExtensionConnected] = useState(false);

  // Check for extension connection
  useEffect(() => {
    const checkExtension = async () => {
      try {
        // Method 1: Check for DOM marker (most reliable)
        const marker = document.getElementById("leetguard-extension-installed");
        if (marker) {
          const version = marker.getAttribute("data-version");
          const isDeveloperMode =
            marker.getAttribute("data-dev-mode") === "true";
          const extensionId = marker.getAttribute("data-extension-id");

          setExtensionConnected(true);
          setNotification({
            type: "info",
            message: `LeetGuard extension detected! ${
              isDeveloperMode ? "(Developer Mode)" : ""
            } v${version}`,
            show: true,
          });

          console.log("Extension detected via DOM marker:", {
            version,
            isDeveloperMode,
            extensionId,
          });
          return;
        }

        // Method 2: Check window property (backup)
        if (window.leetguardExtension?.installed) {
          const ext = window.leetguardExtension;
          setExtensionConnected(true);
          setNotification({
            type: "info",
            message: `LeetGuard extension detected! ${
              ext.isDeveloperMode ? "(Developer Mode)" : ""
            } v${ext.version}`,
            show: true,
          });

          console.log("Extension detected via window property:", ext);
          return;
        }

        // Method 3: Try message communication (fallback)
        const response = await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => reject(new Error("timeout")), 1000);

          window.postMessage({ type: "LEETGUARD_PING" }, "*");

          const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === "LEETGUARD_PONG") {
              clearTimeout(timeout);
              window.removeEventListener("message", handleMessage);
              resolve(event.data);
            }
          };

          window.addEventListener("message", handleMessage);
        });

        if (response) {
          setExtensionConnected(true);
          setNotification({
            type: "info",
            message: `LeetGuard extension detected! ${
              (response as any)?.isDeveloperMode ? "(Developer Mode)" : ""
            } v${(response as any)?.version || "unknown"}`,
            show: true,
          });

          console.log(
            "Extension detected via message communication:",
            response
          );
        }
      } catch (error) {
        console.log(
          "Extension not detected:",
          error instanceof Error ? error.message : String(error)
        );
        setExtensionConnected(false);
      }
    };

    // Check immediately
    checkExtension();

    // Also listen for extension ready event (in case extension loads after page)
    const handleExtensionReady = (event: Event) => {
      console.log(
        "Extension ready event received:",
        (event as CustomEvent).detail
      );
      checkExtension();
    };

    window.addEventListener("leetguardExtensionReady", handleExtensionReady);

    // Cleanup
    return () => {
      window.removeEventListener(
        "leetguardExtensionReady",
        handleExtensionReady
      );
    };
  }, []);

  // Load user's blocklist from API
  useEffect(() => {
    const loadUserBlocklist = async () => {
      if (!isAuthenticated) {
        // User not logged in, show empty list
        setList([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userBlocklist = await BlocklistAPI.getUserBlocklist();
        setList(userBlocklist);

        if (userBlocklist.length === 0) {
          setNotification({
            type: "info",
            message: "Your blocklist is empty. Add websites to get started!",
            show: true,
          });
        }
      } catch (error) {
        console.error("Failed to load blocklist:", error);
        setNotification({
          type: "error",
          message: "Failed to load your blocklist. Please try again.",
          show: true,
        });
        // Fallback to empty list
        setList([]);
      } finally {
        setLoading(false);
      }
    };

    loadUserBlocklist();
  }, [isAuthenticated, user]);

  // Auto-dismiss notification after 3 seconds
  useEffect(() => {
    if (notification && notification.show) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const addSite = async () => {
    if (!isAuthenticated) {
      setNotification({
        type: "error",
        message: "Please log in to manage your blocklist",
        show: true,
      });
      return;
    }

    const trimmed = input.trim().toLowerCase();
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

    try {
      setSaving(true);
      await BlocklistAPI.addWebsite(trimmed);

      // Update local state optimistically
      setList([trimmed, ...list]);
      setInput("");
      setNotification({
        type: "success",
        message: "Website added successfully",
        show: true,
      });
    } catch (error) {
      console.error("Failed to add website:", error);
      setNotification({
        type: "error",
        message: "Failed to add website. Please try again.",
        show: true,
      });
    } finally {
      setSaving(false);
    }
  };

  const removeSite = async (site: string) => {
    if (!isAuthenticated) {
      setNotification({
        type: "error",
        message: "Please log in to manage your blocklist",
        show: true,
      });
      return;
    }

    // Store original list for potential revert
    const originalList = [...list];

    try {
      // Optimistically update UI
      setList(list.filter((s) => s !== site));

      // Make API call
      await BlocklistAPI.removeWebsite(site);

      setNotification({
        type: "success",
        message: `${site} removed successfully`,
        show: true,
      });
    } catch (error) {
      console.error("Failed to remove website:", error);
      // Revert optimistic update - restore original list
      setList(originalList);
      setNotification({
        type: "error",
        message: `Failed to remove ${site}. Please try again.`,
        show: true,
      });
    }
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
      {/* Extension Status */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              extensionConnected ? "bg-green-500" : "bg-gray-400"
            }`}
          ></div>
          <span className="text-xs text-black font-mono">
            Extension: {extensionConnected ? "Connected" : "Not detected"}
          </span>
          {extensionConnected && <ExtensionInfo />}
        </div>
        {!extensionConnected && (
          <a
            href="https://chrome.google.com/webstore"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Install Extension
          </a>
        )}
      </div>

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
          disabled={saving || !isAuthenticated}
          className="px-4 py-2 bg-black text-white font-medium font-dm-sans hover:bg-neutral-800 transition-colors border border-black/20 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {saving && <Loader2 size={14} className="animate-spin" />}
          Add
        </button>
      </div>
      {/* List */}
      <div className="flex flex-col gap-2">
        {loading ? (
          <div className="text-center py-8 flex items-center justify-center gap-2">
            <Loader2 size={20} className="animate-spin" />
            <span className="text-gray-600">Loading your blocklist...</span>
          </div>
        ) : !isAuthenticated ? (
          <div className="text-center py-8">
            <Shield size={24} className="text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 mb-4">
              Please log in to manage your blocklist
            </p>
            <a
              href="/login"
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
            >
              Log In
            </a>
          </div>
        ) : list.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-2">Your blocklist is empty</p>
            <p className="text-sm text-gray-500">
              Add websites above to get started blocking distractions
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {list.map((site) => (
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
            ))}
          </ul>
        )}
      </div>

      {/* Notification Card */}
      {notification && notification.show && (
        <div className="fixed bottom-6 right-6 z-50">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border transition-all duration-300 ${
              notification.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : notification.type === "info"
                ? "bg-blue-50 border-blue-200 text-blue-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : notification.type === "info" ? (
              <Info className="w-5 h-5 text-blue-600" />
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
