"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Image
                src="/leetguard-logo-black.svg"
                alt="LeetGuard Logo"
                width={48}
                height={48}
              />
              <span className="text-2xl font-normal text-black">LeetGuard</span>
            </div>
            <p className="text-black max-w-sm leading-relaxed font-light text-md">
              Built for coders who get distracted too easily. LeetGuard blocks
              the noise so you can actually finish what you started on LeetCode.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-black font-medium mb-4">PRODUCT</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/#features"
                  className="text-black hover:text-black hover:underline hover:underline-offset-4 transition-colors duration-200 text-sm"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/why-it-matters"
                  className="text-black hover:text-black hover:underline hover:underline-offset-4 transition-colors duration-200 text-sm"
                >
                  Why It Matters
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-black hover:text-black hover:underline hover:underline-offset-4 transition-colors duration-200 text-sm"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-black font-medium mb-4">COMPANY</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/careers"
                  className="text-black hover:text-black hover:underline hover:underline-offset-4 transition-colors duration-200 text-sm"
                >
                  Careers
                </Link>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/company/leetguard/"
                  className="text-black hover:text-black hover:underline hover:underline-offset-4 transition-colors duration-200 text-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/try-leetguard"
                  className="text-black hover:text-black hover:underline hover:underline-offset-4 transition-colors duration-200 text-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/leetguard"
                  className="text-black hover:text-black hover:underline hover:underline-offset-4 transition-colors duration-200 text-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-black font-medium mb-4">SUPPORT</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/privacy"
                  className="text-black hover:text-black hover:underline hover:underline-offset-4 transition-colors duration-200 text-sm"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-black hover:text-black hover:underline hover:underline-offset-4 transition-colors duration-200 text-sm"
                >
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8">
          <p className="text-black text-lg mb-4 md:mb-0">
            Built in Austin, Texas.
          </p>

          <p className="text-black text-lg">All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
