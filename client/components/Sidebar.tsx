"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  Activity,
  Shield,
  Clock,
  Settings,
  HelpCircle,
  User,
  Lock,
  LogOut,
  ChevronDown,
  ChevronRight,
  BarChart3,
  Database,
} from "lucide-react";

interface SidebarProps {
  activePage?:
    | "dashboard"
    | "activity"
    | "blocklist"
    | "log"
    | "settings"
    | "settings-profile"
    | "settings-security"
    | "settings-data";
}

export default function Sidebar({ activePage = "dashboard" }: SidebarProps) {
  const { logout, user } = useAuth();
  const router = useRouter();

  const [settingsExpanded, setSettingsExpanded] = useState(
    activePage === "settings" ||
      activePage === "settings-profile" ||
      activePage === "settings-security" ||
      activePage === "settings-data"
  );

  const handleSignOut = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="w-56 bg-gray-50 border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-4">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <Image
            src="/leetguard-logo-black.svg"
            alt="LeetGuard Logo"
            width={28}
            height={28}
          />
          <span className="text-xl font-normal text-black">LeetGuard</span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-3">
        <nav className="space-y-1">
          <Link
            href="/activity"
            className={`flex items-center space-x-2 px-2.5 py-2 text-black transition-colors duration-200 rounded-sm ${
              activePage === "activity" ? "bg-gray-200" : "hover:bg-gray-200"
            }`}
          >
            <Activity className="w-4 h-4" strokeWidth={2.5} />
            <span className="font-normal text-sm">My Activity</span>
          </Link>
          <Link
            href="/blocklist"
            className={`flex items-center space-x-2 px-2.5 py-2 text-black transition-colors duration-200 rounded-sm ${
              activePage === "blocklist" ? "bg-gray-200" : "hover:bg-gray-200"
            }`}
          >
            <Shield className="w-4 h-4" strokeWidth={2.5} />
            <span className="font-normal text-sm">Block List</span>
          </Link>
          <Link
            href="/log"
            className={`flex items-center space-x-2 px-2.5 py-2 text-black transition-colors duration-200 rounded-sm ${
              activePage === "log" ? "bg-gray-200" : "hover:bg-gray-200"
            }`}
          >
            <BarChart3 className="w-4 h-4" strokeWidth={2.5} />
            <span className="font-normal text-sm">Progress Tracker</span>
          </Link>

          {/* Settings with expandable subcategories */}
          <div>
            <Link
              href="/settings"
              className={`w-full flex items-center space-x-2 px-2.5 py-2 text-black transition-colors duration-200 ${
                activePage === "settings" ||
                activePage === "settings-profile" ||
                activePage === "settings-security" ||
                activePage === "settings-data"
                  ? "bg-gray-200 rounded-t-sm"
                  : "hover:bg-gray-200 rounded-sm"
              }`}
            >
              <Settings className="w-4 h-4" strokeWidth={2.5} />
              <span className="font-normal text-sm">Settings</span>
            </Link>

            {settingsExpanded && (
              <div>
                <div className="bg-gray-200 p-1 space-y-1 rounded-b-sm">
                  <Link
                    href="/settings"
                    className={`flex items-center space-x-2 px-2 py-1.5 transition-colors duration-200 rounded-sm ${
                      activePage === "settings" ||
                      activePage === "settings-profile"
                        ? "bg-gray-100 text-black font-semibold"
                        : "text-black hover:bg-gray-100"
                    }`}
                  >
                    <User className="w-4 h-4" strokeWidth={2.5} />
                    <span className="font-normal text-sm">
                      Personal Profile
                    </span>
                  </Link>
                  <Link
                    href="/settings/security"
                    className={`flex items-center space-x-2 px-2 py-1.5 transition-colors duration-200 rounded-sm ${
                      activePage === "settings-security"
                        ? "bg-gray-100 text-black font-semibold"
                        : "text-black hover:bg-gray-100"
                    }`}
                  >
                    <Lock className="w-4 h-4" strokeWidth={2.5} />
                    <span className="font-normal text-sm">
                      Security & Access
                    </span>
                  </Link>
                  <Link
                    href="/settings/data"
                    className={`flex items-center space-x-2 px-2 py-1.5 transition-colors duration-200 rounded-sm ${
                      activePage === "settings-data"
                        ? "bg-gray-100 text-black font-semibold"
                        : "text-black hover:bg-gray-100"
                    }`}
                  >
                    <Database className="w-4 h-4" strokeWidth={2.5} />
                    <span className="font-normal text-sm">Data & Privacy</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center space-x-2 px-2 py-1.5 text-black hover:bg-gray-100 transition-colors duration-200 rounded-sm"
                  >
                    <LogOut className="w-4 h-4" strokeWidth={2.5} />
                    <span className="font-normal text-sm">Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Help Center */}
      <div className="p-3">
        <Link
          href="#"
          className="flex items-center space-x-2 px-2.5 py-2 text-black hover:bg-gray-200 transition-colors duration-200 rounded-sm"
        >
          <HelpCircle className="w-4 h-4" strokeWidth={2.5} />
          <span className="font-normal text-sm">Help Center</span>
        </Link>
      </div>

      {/* Profile */}
      <div className="p-3 border-t border-gray-200">
        <div className="flex items-center space-x-2 px-2 py-1.5">
          <div className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-gray-600" strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-black truncate">
              {user?.display_name ||
                (user?.email ? user.email.split("@")[0] : "User")}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email || "user@example.com"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
