"use client";

import ProgressiveImage from "@/components/ProgressiveImage";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Features() {
  return (
    <section id="features" className="px-4 pb-20 pt-24 sm:px-6 md:pb-24 md:pt-32">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:gap-12">
          {/* Left side - Header and Subheader */}
          <div className="flex-1 text-left flex flex-col justify-center">
            <h2 className="mb-6 py-1 text-4xl font-normal leading-none tracking-super-tight text-black dark:text-black sm:text-5xl md:mb-8 md:text-7.5xl">
              Built for Focused Coders.
            </h2>
            <p className="mx-auto max-w-2xl text-base font-normal leading-relaxed tracking-wide text-neutral-900 dark:text-neutral-900 sm:text-lg md:text-xl">
              LeetCode isn't boring - you're distracted. The grind may feel
              dull when your mind is split. Refocus for free. Today.
            </p>
            <Link
              href="/features"
              className="inline-flex items-center justify-center px-6 py-3 h-12 rounded-lg bg-black text-white text-sm font-medium transition-all duration-200 border border-black/20 hover:border-black/50 hover:text-white hover:shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:shadow-black/30 mt-8 w-fit"
            >
              <span>See How It Works</span>
              <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </div>

          {/* Right side - Demo Image */}
          <div className="flex-2 flex w-full justify-end">
            <ProgressiveImage
              name="demo-feature"
              alt="LeetGuard Demo"
              width={1000}
              height={750}
              sizes="(max-width: 1024px) calc(100vw - 3rem), 1000px"
              className="w-full max-w-[1000px] border border-gray-200 shadow-lg"
              imageClassName="object-cover object-[10%_top]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
