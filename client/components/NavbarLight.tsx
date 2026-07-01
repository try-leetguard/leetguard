"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowUpRight, User, ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function NavbarLight() {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    router.push("/login");
    setShowUserMenu(false);
    setShowMobileMenu(false);
  };

  const closeMobileMenu = () => setShowMobileMenu(false);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/80">
      <div className="max-w-7xl mx-auto px-4 py-4 md:px-6 md:py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/leetguard-logo.png"
              alt="LeetGuard Logo"
              width={32}
              height={32}
            />
            <span className="text-xl font-normal text-black md:text-2xl">LeetGuard</span>
          </Link>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href={"/features"}
              className="text-black hover:text-black hover:underline hover:underline-offset-4 transition-colors duration-200 text-sm font-medium"
            >
              How It Works
            </Link>
            <Link
              href="/why-it-matters"
              className="text-black hover:text-black hover:underline hover:underline-offset-4 transition-colors duration-200 text-sm font-medium"
            >
              Why It Matters
            </Link>
            <Link
              href="/pricing"
              className="text-black hover:text-black hover:underline hover:underline-offset-4 transition-colors duration-200 text-sm font-medium"
            >
              Pricing
            </Link>
            <Link
              href="/careers"
              className="text-black hover:text-black hover:underline hover:underline-offset-4 transition-colors duration-200 text-sm font-medium"
            >
              Join Us
            </Link>
          </div>

          {/* Right Side */}
          <div className="hidden items-center space-x-4 md:flex">
            {isLoading ? (
              <div className="h-8 w-[140px]" aria-hidden="true" />
            ) : isAuthenticated ? (
              /* User Menu */
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-black text-white text-sm font-medium transition-all duration-200 hover:bg-gray-800"
                >
                  <User className="w-4 h-4" />
                  <span>
                    {user?.display_name ||
                      (user?.email ? user.email.split("@")[0] : "User")}
                  </span>
                  <ChevronDown
                    className={`w-3 h-3 transition-transform duration-200 ${
                      showUserMenu ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                    <button
                      onClick={() => {
                        router.push("/activity");
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-50 transition-colors duration-200"
                    >
                      Activity
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors duration-200"
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Login */}
                <Link
                  href="/login"
                  className="text-black hover:text-black hover:underline hover:underline-offset-4 transition-colors duration-200 text-sm font-medium mr-4"
                >
                  Login
                </Link>

                {/* Sign Up */}
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center px-2 py-2 h-8 rounded-lg bg-black text-white text-sm font-medium transition-all duration-200 hover:text-white hover:shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:shadow-black/30"
                >
                  <span>Sign Up</span>
                  <ArrowUpRight className="w-3 h-3 ml-1" />
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowMobileMenu((current) => !current)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-black transition-colors hover:border-black md:hidden"
            aria-label={showMobileMenu ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={showMobileMenu}
          >
            {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {showMobileMenu ? (
          <div className="mt-4 border-t border-gray-200 py-4 md:hidden">
            <div className="grid gap-1">
              <Link
                href="/features"
                onClick={closeMobileMenu}
                className="rounded-lg px-3 py-3 text-sm font-medium text-black transition-colors hover:bg-gray-50"
              >
                How It Works
              </Link>
              <Link
                href="/why-it-matters"
                onClick={closeMobileMenu}
                className="rounded-lg px-3 py-3 text-sm font-medium text-black transition-colors hover:bg-gray-50"
              >
                Why It Matters
              </Link>
              <Link
                href="/pricing"
                onClick={closeMobileMenu}
                className="rounded-lg px-3 py-3 text-sm font-medium text-black transition-colors hover:bg-gray-50"
              >
                Pricing
              </Link>
              <Link
                href="/careers"
                onClick={closeMobileMenu}
                className="rounded-lg px-3 py-3 text-sm font-medium text-black transition-colors hover:bg-gray-50"
              >
                Join Us
              </Link>
            </div>

            <div className="mt-4 grid gap-3 border-t border-gray-200 pt-4">
              {isLoading ? (
                <div className="h-11 rounded-lg bg-gray-100" aria-hidden="true" />
              ) : isAuthenticated ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      router.push("/activity");
                      closeMobileMenu();
                    }}
                    className="inline-flex h-11 items-center justify-center rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-black transition-colors hover:border-black"
                  >
                    Activity
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex h-11 items-center justify-center rounded-lg bg-black px-4 text-sm font-medium text-white transition-colors hover:bg-gray-800"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={closeMobileMenu}
                    className="inline-flex h-11 items-center justify-center rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-black transition-colors hover:border-black"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    onClick={closeMobileMenu}
                    className="inline-flex h-11 items-center justify-center rounded-lg bg-black px-4 text-sm font-medium text-white transition-colors hover:bg-gray-800"
                  >
                    Sign Up
                    <ArrowUpRight className="ml-2 h-3.5 w-3.5" />
                  </Link>
                </>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </nav>
  );
}
