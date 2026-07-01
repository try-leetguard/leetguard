"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white px-4 pb-10 pt-16 sm:px-6 md:pt-28 lg:pt-32">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-lg bg-black p-6 text-white sm:p-8 md:p-10">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.18em] text-gray-400">
                solve first
              </p>
              <h2 className="mt-4 max-w-2xl text-3xl font-normal leading-tight text-white sm:text-4xl md:text-5xl">
                Protect the first solve.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-300">
                Finish one problem, then choose what comes next.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
              <Link
                href="/signup"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-white px-5 text-sm font-medium text-black transition-all duration-200 hover:bg-gray-100 hover:text-black"
              >
                Start Free
                <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </Link>
              <Link
                href="/features"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-white/20 px-5 text-sm font-medium text-white transition-all duration-200 hover:border-white/50 hover:text-white"
              >
                See How It Works
                <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-10 border-b border-gray-200 py-12 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <div className="mb-5 flex items-center space-x-2">
              <Image
                src="/leetguard-logo.png"
                alt="LeetGuard Logo"
                width={40}
                height={40}
              />
              <span className="text-2xl font-normal text-black">LeetGuard</span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-neutral-700">
              LeetGuard helps leetcoders practice before the distractions take over.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-mono uppercase tracking-[0.18em] text-gray-500">
              Product
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/features"
                  className="text-sm text-neutral-700 transition-colors duration-200 hover:text-black hover:underline hover:underline-offset-4"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/why-it-matters"
                  className="text-sm text-neutral-700 transition-colors duration-200 hover:text-black hover:underline hover:underline-offset-4"
                >
                  Why It Matters
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-sm text-neutral-700 transition-colors duration-200 hover:text-black hover:underline hover:underline-offset-4"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-mono uppercase tracking-[0.18em] text-gray-500">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/careers"
                  className="text-sm text-neutral-700 transition-colors duration-200 hover:text-black hover:underline hover:underline-offset-4"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/notes"
                  className="text-sm text-neutral-700 transition-colors duration-200 hover:text-black hover:underline hover:underline-offset-4"
                >
                  Notes
                </Link>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/company/leetguard/"
                  className="text-sm text-neutral-700 transition-colors duration-200 hover:text-black hover:underline hover:underline-offset-4"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/try-leetguard"
                  className="text-sm text-neutral-700 transition-colors duration-200 hover:text-black hover:underline hover:underline-offset-4"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-mono uppercase tracking-[0.18em] text-gray-500">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-neutral-700 transition-colors duration-200 hover:text-black hover:underline hover:underline-offset-4"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-neutral-700 transition-colors duration-200 hover:text-black hover:underline hover:underline-offset-4"
                >
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-6 text-sm text-neutral-700 sm:flex-row sm:items-center sm:justify-between">
          <p className="inline-flex items-center gap-2">
            <span aria-hidden="true">🇺🇸</span>
            <span>United States</span>
          </p>

          <p>© {currentYear} LeetGuard. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
