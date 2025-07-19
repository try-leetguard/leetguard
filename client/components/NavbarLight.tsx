"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function NavbarLight() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/80">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/leetguard-logo-black.svg"
              alt="LeetGuard Logo"
              width={32}
              height={32}
            />
            <span className="text-2xl font-normal text-black">LeetGuard</span>
          </Link>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href={"/#features"}
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
          <div className="flex items-center space-x-4">
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
          </div>
        </div>
      </div>
    </nav>
  );
}
