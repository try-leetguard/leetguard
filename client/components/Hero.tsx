"use client";

import { ArrowRight, Play } from "lucide-react";

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center pt-40 px-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* Main Headline */}
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          <span className="text-white">Focus. Solve.</span>
          <br />
          <span className="text-[#FFA116]">Unlock your day</span>
          <br />
          <span className="text-white">with LeetGuard.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-neutral-100 mb-12 max-w-2xl mx-auto leading-relaxed">
          Your coding companion that rewards deep work and eliminates
          distractions.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="bg-white text-black px-8 py-4 rounded-xl font-semibold text-lg hover:bg-neutral-100 transition-colors duration-200 flex items-center space-x-2 shadow-lg">
            <span>Start Your Focus Journey</span>
          </button>
          <button className="border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-colors duration-200 flex items-center space-x-2 backdrop-blur-sm">
            <Play className="w-5 h-5" />
            <span>See How It Works</span>
          </button>
        </div>
      </div>
    </section>
  );
}
