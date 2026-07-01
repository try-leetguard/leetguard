"use client";

import Image from "next/image";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function NavbarDark() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const closeMobileMenu = () => setShowMobileMenu(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#F9F6F0]/80 border-b border-black/10">
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
              className="text-black hover:text-black hover:underline transition-colors duration-200 text-sm font-normal"
            >
              How It Works
            </Link>
            <Link
              href="/why-it-matters"
              className="text-black hover:text-black hover:underline transition-colors duration-200 text-sm font-normal"
            >
              Why It Matters
            </Link>
            <Link
              href="/pricing"
              className="text-black hover:text-black hover:underline transition-colors duration-200 text-sm font-normal"
            >
              Pricing
            </Link>
            <Link
              href="/careers"
              className="text-black hover:text-black hover:underline transition-colors duration-200 text-sm font-normal"
            >
              Join Us
            </Link>
          </div>

          {/* Right Side */}
          <div className="hidden items-center space-x-4 md:flex">
            {/* Login */}
            <Link
              href="/login"
              className="text-black hover:text-black hover:underline transition-colors duration-200 text-sm font-normal mr-4"
            >
              Login
            </Link>

            {/* Sign Up */}
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-2 py-2 h-8 rounded-lg bg-black text-white border-black/20 hover:border-black/50 hover:shadow-black/30 text-sm font-medium transition-all duration-200 border hover:text-white hover:shadow-[0_0_20px_rgba(0,0,0,0.3)]"
            >
              <span>Sign Up</span>
              <ArrowUpRight className="w-3 h-3 ml-1" />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setShowMobileMenu((current) => !current)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-black/10 bg-white/80 text-black transition-colors hover:border-black md:hidden"
            aria-label={showMobileMenu ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={showMobileMenu}
          >
            {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {showMobileMenu ? (
          <div className="mt-4 border-t border-black/10 py-4 md:hidden">
            <div className="grid gap-1">
              <Link
                href="/features"
                onClick={closeMobileMenu}
                className="rounded-lg px-3 py-3 text-sm font-normal text-black transition-colors hover:bg-black/5"
              >
                How It Works
              </Link>
              <Link
                href="/why-it-matters"
                onClick={closeMobileMenu}
                className="rounded-lg px-3 py-3 text-sm font-normal text-black transition-colors hover:bg-black/5"
              >
                Why It Matters
              </Link>
              <Link
                href="/pricing"
                onClick={closeMobileMenu}
                className="rounded-lg px-3 py-3 text-sm font-normal text-black transition-colors hover:bg-black/5"
              >
                Pricing
              </Link>
              <Link
                href="/careers"
                onClick={closeMobileMenu}
                className="rounded-lg px-3 py-3 text-sm font-normal text-black transition-colors hover:bg-black/5"
              >
                Join Us
              </Link>
            </div>

            <div className="mt-4 grid gap-3 border-t border-black/10 pt-4">
              <Link
                href="/login"
                onClick={closeMobileMenu}
                className="inline-flex h-11 items-center justify-center rounded-lg border border-black/10 bg-white/80 px-4 text-sm font-normal text-black transition-colors hover:border-black"
              >
                Login
              </Link>
              <Link
                href="/signup"
                onClick={closeMobileMenu}
                className="inline-flex h-11 items-center justify-center rounded-lg bg-black px-4 text-sm font-medium text-white transition-colors hover:bg-neutral-800 hover:text-white"
              >
                Sign Up
                <ArrowUpRight className="ml-2 h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </nav>
  );
}
