"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Play, Sparkles } from "lucide-react";
import Image from "next/image";
import NavbarLight from "@/components/NavbarLight";
import Features from "@/components/Features";
import Quote from "@/components/Quote";
import Footer from "@/components/Footer";
import LogoCarousel from "@/components/LogoCarousel";

export default function LandingPage() {
  const [isHeroVisible, setIsHeroVisible] = useState(false);
  const [isImageVisible, setIsImageVisible] = useState(false);
  const [isTitleLine1Visible, setIsTitleLine1Visible] = useState(false);
  const [isTitleLine2Visible, setIsTitleLine2Visible] = useState(false);
  const [isSubtitleVisible, setIsSubtitleVisible] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(false);

  useEffect(() => {
    // Set light mode by default
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");

    // Trigger hero fade-in immediately
    setIsHeroVisible(true);

    // Staggered text animations
    setTimeout(() => setIsTitleLine1Visible(true), 50);
    setTimeout(() => setIsTitleLine2Visible(true), 150);
    setTimeout(() => setIsSubtitleVisible(true), 250);
    setTimeout(() => setIsButtonVisible(true), 350);

    // Trigger image fade-in after text animations
    const timer = setTimeout(() => {
      setIsImageVisible(true);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-white text-black">
      <NavbarLight />

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center pt-10 px-6 mb-5">
        <div className="container mx-auto px-4 relative z-10">
          <div
            className={`text-center max-w-4xl mx-auto mt-4 transition-opacity duration-1000 ease-out ${
              isHeroVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <h1 className="text-7xl md:text-7.5xl font-medium mb-8 leading-none py-1 tracking-super-tight">
              <div
                className={`transition-all duration-500 ease-out ${
                  isTitleLine1Visible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                <span className="text-black">Focus. Solve.</span>
              </div>
              <div
                className={`transition-all duration-500 ease-out ${
                  isTitleLine2Visible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                <span className="text-black">Unlock your day.</span>
              </div>
            </h1>
            <div
              className={`transition-all duration-500 ease-out ${
                isSubtitleVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <p className="text-xl text-neutral-900 mb-8 max-w-2xl mx-auto font-normal tracking-wide leading-relaxed">
                A browser extension that blocks your distractions while you do
                your coding interview preperation.
              </p>
            </div>
            <div
              className={`transition-all duration-500 ease-out ${
                isButtonVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                <button className="inline-flex items-center justify-center px-6 py-3 h-12 rounded-lg bg-black text-white text-sm font-medium transition-all duration-200 border border-black/20 hover:border-black/50 hover:text-white hover:shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:shadow-black/30">
                  <span>Start Your Focus Journey</span>
                  <ArrowUpRight className="ml-2 w-5 h-5" />
                </button>
              </div>
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
          className={`w-full max-w-5xl h-[500px] shadow-lg object-cover object-top mx-auto mt-[-7rem] mb-12 z-20 relative border border-gray-200 transition-opacity duration-1000 ease-out ${
            isImageVisible ? "opacity-100" : "opacity-0"
          }`}
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
