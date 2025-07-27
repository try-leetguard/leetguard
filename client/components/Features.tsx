"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function Features() {
  return (
    <section id="features" className="pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left side - Header and Subheader */}
          <div className="flex-1 text-left flex flex-col justify-center">
            <h2 className="text-7xl md:text-7.5xl font-medium text-black dark:text-black mb-8 leading-none py-1 tracking-super-tight">
              Built for Focused Coders.
            </h2>
            <p className="text-xl text-neutral-900 dark:text-neutral-900 max-w-2xl mx-auto font-normal tracking-wide leading-relaxed">
            LeetCode isn't boring - you're distracted. The grind may feel dull when your mind is split. Refocus for free. Today.
            </p>
          </div>

          {/* Right side - Demo Image */}
          <div className="flex-2 flex justify-end">
            <Image
              src="/demo2.png"
              alt="LeetGuard Demo"
              width={1000}
              height={750}
              className="shadow-lg border border-gray-200"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
