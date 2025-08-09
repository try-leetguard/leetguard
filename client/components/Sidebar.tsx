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
    <div className="w-56 bg-[#F9F6F0] border-r border-gray-200 flex flex-col">
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
            className={`flex items-center space-x-2 px-2 py-1.5 text-black transition-colors duration-200 ${
              activePage === "activity" ? "bg-[#E5E0D5]" : "hover:bg-[#E5E0D5]"
            }`}
          >
            <Activity className="w-4 h-4" />
            <span className="font-normal text-sm">My Activity</span>
          </Link>
          <Link
            href="/blocklist"
            className={`flex items-center space-x-2 px-2 py-1.5 text-black transition-colors duration-200 ${
              activePage === "blocklist" ? "bg-[#E5E0D5]" : "hover:bg-[#E5E0D5]"
            }`}
          >
            <Shield className="w-4 h-4" />
            <span className="font-normal text-sm">Block List</span>
          </Link>
          <Link
            href="/log"
            className={`flex items-center space-x-2 px-2 py-1.5 text-black transition-colors duration-200 ${
              activePage === "log" ? "bg-[#E5E0D5]" : "hover:bg-[#E5E0D5]"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span className="font-normal text-sm">Log</span>
          </Link>

          {/* Settings with expandable subcategories */}
          <div>
            <Link
              href="/settings"
              className={`w-full flex items-center space-x-2 px-2 py-1.5 text-black transition-colors duration-200 ${
                activePage === "settings" ||
                activePage === "settings-profile" ||
                activePage === "settings-security" ||
                activePage === "settings-data"
                  ? "bg-[#E5E0D5]"
                  : "hover:bg-[#E5E0D5]"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span className="font-normal text-sm">Settings</span>
            </Link>

            {settingsExpanded && (
              <div>
                <div className="bg-[#E5E0D5] p-1 space-y-1">
                  <Link
                    href="/settings"
                    className={`flex items-center space-x-2 px-2 py-1.5 transition-colors duration-200 ${
                      activePage === "settings" ||
                      activePage === "settings-profile"
                        ? "bg-[#F3F1EB] text-black font-semibold"
                        : "text-black hover:bg-[#F3F1EB]"
                    }`}
                  >
                    <User className="w-3 h-3" />
                    <span className="font-normal text-sm">
                      Personal Profile
                    </span>
                  </Link>
                  <Link
                    href="/settings/security"
                    className={`flex items-center space-x-2 px-2 py-1.5 transition-colors duration-200 ${
                      activePage === "settings-security"
                        ? "bg-[#F3F1EB] text-black font-semibold"
                        : "text-black hover:bg-[#F3F1EB]"
                    }`}
                  >
                    <Lock className="w-3 h-3" />
                    <span className="font-normal text-sm">
                      Security & Access
                    </span>
                  </Link>
                  <Link
                    href="/settings/data"
                    className={`flex items-center space-x-2 px-2 py-1.5 transition-colors duration-200 ${
                      activePage === "settings-data"
                        ? "bg-[#F3F1EB] text-black font-semibold"
                        : "text-black hover:bg-[#F3F1EB]"
                    }`}
                  >
                    <Shield className="w-3 h-3" />
                    <span className="font-normal text-sm">Data & Privacy</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center space-x-2 px-2 py-1.5 text-black hover:bg-[#F3F1EB] transition-colors duration-200"
                  >
                    <LogOut className="w-3 h-3" />
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
          className="flex items-center space-x-2 px-2 py-1.5 text-black hover:bg-[#E5E0D5] transition-colors duration-200"
        >
          <HelpCircle className="w-4 h-4" />
          <span className="font-normal text-sm">Help Center</span>
        </Link>
      </div>

      {/* Profile */}
      <div className="p-3 border-t border-gray-200">
        <div className="flex items-center space-x-2 px-2 py-1.5">
          <div className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-gray-600" />
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
