"use client";

import { useEffect } from "react";
import { ArrowRight, ArrowUpRight, Check, LockKeyhole } from "lucide-react";
import { motion, useInView } from "framer-motion";
import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import NavbarLight from "@/components/NavbarLight";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import LogoCarousel from "@/components/LogoCarousel";
import ProgressiveImage from "@/components/ProgressiveImage";
import { featuredNote } from "@/lib/notes";
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

const loopSteps = [
  "Blocked tab",
  "Solve one",
  "Progress sync",
  "Scroll unlocked",
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

function HeroLoopStrip() {
  return (
    <div className="mx-auto mt-8 grid max-w-3xl grid-cols-2 overflow-hidden rounded-lg border border-gray-200 bg-white text-left shadow-sm md:grid-cols-4">
      {loopSteps.map((step, index) => (
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: index * 0.08 }}
          className="min-h-[76px] border-gray-200 p-4 even:border-l md:border-l md:first:border-l-0"
        >
          <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-gray-500">
            0{index + 1}
          </p>
          <p className="mt-3 text-sm font-medium leading-tight text-black">
            {step}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

function HomepagePreviews() {
  return (
    <section className="px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 grid gap-8 lg:grid-cols-[0.8fr_1fr] lg:items-end">
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.18em] text-gray-500">
              the trailer version
            </p>
            <h2 className="mt-5 text-5xl font-normal leading-none tracking-super-tight text-black md:text-6xl">
              See the loop before the deep dive.
            </h2>
          </div>
          <p className="max-w-2xl text-lg leading-relaxed text-neutral-700 lg:justify-self-end">
            Start with the behavior: a blocked tab, one solved problem, and
            the day opening back up. The deeper pages carry the details.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <PreviewLink
            href="/features"
            label="how it works"
            title="Blocked, solved, unlocked."
            copy="A compact view of the core product loop before the full theatre."
            className="lg:col-span-2"
          >
            <MiniLoopPreview />
          </PreviewLink>

          <PreviewLink
            href="/pricing"
            label="pricing"
            title="Free means free."
            copy="No credit card. No billing puzzle. Start with the guard and dashboard."
          >
            <PricingPreview />
          </PreviewLink>

          <PreviewLink
            href="/why-it-matters"
            label="why it matters"
            title="One tab becomes the session."
            copy="The cost is not the click. It is the return trip."
            className="lg:col-span-3"
          >
            <DriftPreview />
          </PreviewLink>
        </div>
      </div>
    </section>
  );
}

function PreviewLink({
  href,
  label,
  title,
  copy,
  children,
  className = "",
}: {
  href: string;
  label: string;
  title: string;
  copy: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group grid min-h-[360px] rounded-lg border border-gray-200 bg-white p-6 transition-colors duration-200 hover:border-black",
        className
      )}
    >
      <div>
        <p className="text-xs font-mono uppercase tracking-[0.18em] text-gray-500">
          {label}
        </p>
        <h3 className="mt-4 max-w-xl text-3xl font-normal leading-tight text-black">
          {title}
        </h3>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-700">
          {copy}
        </p>
      </div>
      <div className="mt-8 self-end">{children}</div>
      <span className="mt-6 inline-flex items-center text-sm font-medium text-black">
        Explore
        <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

function MiniLoopPreview() {
  return (
    <div className="grid gap-3 md:grid-cols-4">
      {[
        { label: "attempt", value: "youtube.com", progress: "22%" },
        { label: "gate", value: "blocked", progress: "46%" },
        { label: "solve", value: "Two Sum", progress: "72%" },
        { label: "unlock", value: "1 / 1", progress: "100%" },
      ].map((item, index) => (
        <div key={item.label} className="rounded-lg bg-gray-100 p-4">
          <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-gray-500">
            {item.label}
          </p>
          <p className="mt-4 text-lg font-medium text-black">{item.value}</p>
          <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-gray-200">
            <motion.div
              initial={{ width: "0%" }}
              whileInView={{ width: item.progress }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.12 }}
              className="h-full rounded-full bg-black"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function PricingPreview() {
  return (
    <div className="rounded-lg bg-black p-5 text-white">
      <p className="text-xs font-mono uppercase tracking-[0.18em] text-gray-400">
        free while we build
      </p>
      <p className="mt-5 text-6xl font-normal leading-none">$0</p>
      <div className="mt-6 space-y-3 text-sm text-gray-200">
        {["No credit card", "Chrome extension", "Dashboard included"].map(
          (item) => (
            <p key={item} className="flex items-center gap-3">
              <Check className="h-4 w-4 text-white" />
              <span>{item}</span>
            </p>
          )
        )}
      </div>
    </div>
  );
}

function DriftPreview() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.15fr]">
      <div className="rounded-lg bg-gray-100 p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-mono uppercase tracking-[0.18em] text-gray-500">
            without leetguard
          </p>
          <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-mono text-red-700">
            0 / 1
          </span>
        </div>
        <div className="mt-8 rounded-lg bg-black p-5 text-white">
          <p className="text-sm text-gray-300">Recommended next</p>
          <p className="mt-4 text-3xl font-normal">One quick video</p>
          <div className="mt-6 h-24 rounded bg-white/10" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {["+5 min", "+12 min", "+28 min"].map((chip, index) => (
            <motion.span
              key={chip}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.14 }}
              className="rounded-full border border-red-200 bg-white px-3 py-1 text-xs font-mono text-red-700"
            >
              {chip}
            </motion.span>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-mono uppercase tracking-[0.18em] text-gray-500">
            with leetguard
          </p>
          <span className="inline-flex items-center gap-2 rounded-full bg-black px-3 py-1 text-xs font-mono text-white">
            <LockKeyhole className="h-3 w-3" />
            guarded
          </span>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-2xl font-normal text-black">Two Sum</p>
            <div className="mt-5 space-y-2 rounded-lg bg-gray-50 p-4">
              <div className="h-2 w-10/12 rounded bg-gray-200" />
              <div className="h-2 w-8/12 rounded bg-gray-200" />
              <div className="h-2 w-9/12 rounded bg-gray-200" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-normal text-black">Accepted</p>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-gray-200">
              <motion.div
                initial={{ width: "0%" }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.85, delay: 0.2 }}
                className="h-full rounded-full bg-green-500"
              />
            </div>
            <p className="mt-4 text-sm text-neutral-700">
              Scroll unlocked after the first solve.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotesPreviewSection() {
  return (
    <section className="px-6 pb-28 pt-8">
      <div className="mx-auto max-w-6xl border-t border-gray-200 pt-16">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1fr] lg:items-start">
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.18em] text-gray-500">
              notes
            </p>
            <h2 className="mt-5 max-w-2xl text-5xl font-normal leading-none tracking-super-tight text-black md:text-6xl">
              Build notes for the product we are building.
            </h2>
          </div>

          <Link
            href={`/notes/${featuredNote.slug}`}
            className="group rounded-lg border border-gray-200 bg-white p-6 transition-colors duration-200 hover:border-black"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs font-mono uppercase tracking-[0.18em] text-gray-500">
                {featuredNote.label}
              </p>
              <p className="text-sm text-neutral-600">
                {featuredNote.date} · {featuredNote.readTime}
              </p>
            </div>
            <h3 className="mt-8 max-w-2xl text-4xl font-normal leading-tight text-black">
              {featuredNote.title}
            </h3>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-700">
              {featuredNote.excerpt}
            </p>
            <span className="mt-8 inline-flex items-center text-sm font-medium text-black">
              Read the first note
              <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
      </div>
    </section>
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
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center px-6 py-3 h-12 rounded-lg bg-black text-white text-sm font-medium transition-all duration-200 border border-black/20 hover:border-black/50 hover:text-white hover:shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:shadow-black/30"
                >
                  <span>Start Your Focus Journey</span>
                  <ArrowUpRight className="ml-2 w-5 h-5" />
                </Link>
              </div>

              <HeroLoopStrip />
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

      <HomepagePreviews />

      <div id="features">
        <Features />
      </div>
      <NotesPreviewSection />
      <Footer />
    </div>
  );
}
