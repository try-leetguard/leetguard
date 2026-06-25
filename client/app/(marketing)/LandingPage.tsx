"use client";

import { useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import { motion, useInView } from "framer-motion";
import * as React from "react";
import { cn } from "@/lib/utils";
import NavbarLight from "@/components/NavbarLight";
import Features from "@/components/Features";
import Quote from "@/components/Quote";
import Footer from "@/components/Footer";
import LogoCarousel from "@/components/LogoCarousel";
import ProgressiveImage from "@/components/ProgressiveImage";
const companies = [
  { name: "adobe", logo: "/companies/adobe.svg" },
  { name: "amazon", logo: "/companies/amazon.svg" },
  { name: "apple", logo: "/companies/apple.svg" },
  { name: "coinbase", logo: "/companies/coinbase.svg" },
  { name: "datadog", logo: "/companies/datadog.svg" },
  { name: "doordash", logo: "/companies/doordash.svg" },
  { name: "google", logo: "/companies/google.svg" },
  { name: "lyft", logo: "/companies/lyft.svg" },
  { name: "meta", logo: "/companies/meta.svg" },
  { name: "netflix", logo: "/companies/netflix.svg" },
  { name: "nvidia", logo: "/companies/nvidia.svg" },
  { name: "palantir", logo: "/companies/palantir.svg" },
  { name: "ramp", logo: "/companies/ramp.svg" },
  { name: "reddit", logo: "/companies/reddit.svg" },
  { name: "uber", logo: "/companies/uber.svg" },
] as const;

export function TextFade({
  direction,
  children,
  className = "",
  staggerChildren = 0.1,
  delay = 0,
}: {
  direction: "up" | "down";
  children: React.ReactNode;
  className?: string;
  staggerChildren?: number;
  delay?: number;
}) {
  const FADE_DOWN = {
    show: { opacity: 1, y: 0, transition: { type: "spring" as const } },
    hidden: { opacity: 0, y: direction === "down" ? -18 : 18 },
  };
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={isInView ? "show" : ""}
      variants={{
        hidden: {},
        show: {
          transition: {
            delay: delay,
            staggerChildren: staggerChildren,
          },
        },
      }}
      className={className}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child) ? (
          <motion.div variants={FADE_DOWN}>{child}</motion.div>
        ) : (
          child
        )
      )}
    </motion.div>
  );
}

const BlurIn = ({
  children,
  delay = 0,
  yOffset = 0,
}: {
  children: React.ReactNode;
  delay?: number;
  yOffset?: number;
}) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ filter: "blur(20px)", opacity: 0, y: yOffset }}
      animate={isInView ? { filter: "blur(0px)", opacity: 1, y: 0 } : {}}
      transition={{ duration: 2, delay }}
    >
      {children}
    </motion.div>
  );
};

export function WordsPullUp({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const splittedText = text.split(" ");

  const pullupVariant = {
    initial: { y: 20, opacity: 0 },
    animate: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
      },
    }),
  };
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  // Split into two lines: "Focus. Solve." and "Claim your day."
  const firstLine = splittedText.slice(0, 2); // "Focus. Solve."
  const secondLine = splittedText.slice(2); // "Claim your day."

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center">
        {firstLine.map((current, i) => (
          <motion.div
            key={i}
            ref={ref}
            variants={pullupVariant}
            initial={false}
            animate={isInView ? "animate" : ""}
            custom={i}
            className={cn(
              "text-xl text-center sm:text-4xl font-bold tracking-tighter md:text-7xl md:leading-[3rem]",
              "pr-4", // class to separate words
              className
            )}
          >
            {current == "" ? <span>&nbsp;</span> : current}
          </motion.div>
        ))}
      </div>
      <div className="flex justify-center">
        {secondLine.map((current, i) => (
          <motion.div
            key={i + firstLine.length}
            ref={ref}
            variants={pullupVariant}
            initial={false}
            animate={isInView ? "animate" : ""}
            custom={i + firstLine.length}
            className={cn(
              "text-xl text-center sm:text-4xl font-bold tracking-tighter md:text-7xl md:leading-[6rem]",
              "pr-4", // class to separate words
              className
            )}
          >
            {current == "" ? <span>&nbsp;</span> : current}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

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


            <TextFade direction="up" delay={0.1}>
              <div className="mb-2 mt-4">
                <WordsPullUp
                  text="Focus. Solve. Claim your day."
                  className="text-8xl font-normal leading-none py-1 tracking-super-tight"
                />
              </div>
            </TextFade>

            <TextFade direction="up" delay={0.2}>
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
            </TextFade>
          </div>
        </div>
      </div>

      {/* Demo Image Section */}
      <div className="mt-0 px-6">
        <ProgressiveImage
          name="demo-hero"
          alt="Demo"
          width={1600}
          height={500}
          sizes="(max-width: 768px) calc(100vw - 3rem), 1024px"
          loading="eager"
          fetchPriority="high"
          className="w-full max-w-5xl h-[320px] sm:h-[420px] lg:h-[500px] shadow-lg mx-auto mt-[-7rem] mb-12 z-20 relative border border-gray-200"
          imageClassName="object-cover object-top"
        />
      </div>

      {/* Logo Carousel */}
      <LogoCarousel
        logos={companies as unknown as { name: string; logo: string }[]}
        speedSeconds={50}
      />

      <div id="features">
        <Features />
      </div>

      {/* Separator Line */}
      <div id="how-important" className="w-full flex justify-center py-8">
        <div className="w-24 h-px"></div>
      </div>

      <div>
        <Quote />
      </div>
      <Footer />
    </div>
  );
}
