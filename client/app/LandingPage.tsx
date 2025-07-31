"use client";

import { useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import NavbarLight from "@/components/NavbarLight";
import Features from "@/components/Features";
import Quote from "@/components/Quote";
import Footer from "@/components/Footer";
import LogoCarousel from "@/components/LogoCarousel";

export default function LandingPage() {
  useEffect(() => {
    // Set light mode by default
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }, []);

  return (
    <div className="relative min-h-screen bg-white text-black">
      <NavbarLight />

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center pt-2 px-6 mb-5">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto mt-4">
            {/* Coming Soon Badge */}
            <div className="inline-flex items-center pl-1 pr-4 py-1 rounded-full bg-gray-100 border border-gray-400 text-gray-700 text-sm font-medium mb-6 hover:border-gray-800 transition-all duration-200 cursor-pointer relative overflow-hidden">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent from-20% via-white/80 via-50% to-transparent to-80% animate-shine"></div>
              <div className="relative z-10 mr-2 inline-flex items-center px-2.5 py-1 rounded-full bg-gradient-to-r from-[#e8e6f9] to-[#cdc9f5] text-black text-xs font-semibold">
                Up Next
              </div>
              <span className="relative z-10">
                Your distractions blocked while you apply &nbsp; {">"}
              </span>
            </div>

            <h1 className="text-7xl font-medium mb-6 leading-none py-1 tracking-super-tight">
              <div className="mb-2">Focus. Solve.</div>
              <div>Claim your day.</div>
            </h1>
            <p className="text-xl text-neutral-600 mb-4 max-w-lg mx-auto font-normal tracking-wide leading-loose">
              Your coding prep, uninterrupted. Zero distractions. Only pure
              LeetCode focus.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <button className="inline-flex items-center justify-center px-6 py-3 h-12 rounded-lg bg-black text-white text-sm font-medium transition-all duration-200 border border-black/20 hover:border-black/50 hover:text-white hover:shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:shadow-black/30">
                <span>Start Your Focus Journey</span>
                <ArrowUpRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Image Section */}
      <div className="mt-0">
        <Image
          src="/demo.png"
          alt="Demo"
          width={1600}
          height={500}
          className="w-full max-w-5xl h-[500px] shadow-lg object-cover object-top mx-auto mt-[-7rem] mb-12 z-20 relative border border-gray-200"
          priority
        />
      </div>

      {/* Logo Carousel */}
      <LogoCarousel />

      <div id="features">
        <Features />
      </div>

      {/* Separator Line */}
      <div id="why-important" className="w-full flex justify-center py-8">
        <div className="w-24 h-px"></div>
      </div>

      <div>
        <Quote />
      </div>
      <Footer />
    </div>
  );
}
