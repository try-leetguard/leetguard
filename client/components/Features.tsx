"use client";

import ProgressiveImage from "@/components/ProgressiveImage";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Features() {
  return (
    <section id="features" className="pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left side - Header and Subheader */}
          <div className="flex-1 text-left flex flex-col justify-center">
            <h2 className="text-7xl md:text-7.5xl font-normal text-black dark:text-black mb-8 leading-none py-1 tracking-super-tight">
              Built for Focused Coders.
            </h2>
            <p className="text-xl text-neutral-900 dark:text-neutral-900 max-w-2xl mx-auto font-normal tracking-wide leading-relaxed">
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
              className="w-full max-w-[1000px] shadow-lg border border-gray-200"
              imageClassName="object-cover object-[10%_top]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
