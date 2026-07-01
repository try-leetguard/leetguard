"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Check, Play } from "lucide-react";
import * as React from "react";

import { MacOSDock, type DockApp } from "@/components/ui/mac-os-dock";

const PROBLEMS = [
  {
    title: "Two Sum",
    slug: "two-sum",
    tests: "63 / 63",
    runtime: "41 ms",
  },
  {
    title: "Valid Parentheses",
    slug: "valid-parentheses",
    tests: "98 / 98",
    runtime: "37 ms",
  },
  {
    title: "Merge Two Sorted Lists",
    slug: "merge-two-sorted-lists",
    tests: "208 / 208",
    runtime: "52 ms",
  },
] as const;

const PHASE_ORDER = ["preparing", "accepted", "progressUpdated"] as const;

type DemoPhase = (typeof PHASE_ORDER)[number];

const PHASE_DURATIONS: Record<DemoPhase, number> = {
  preparing: 900,
  accepted: 1500,
  progressUpdated: 1700,
};

const TOTAL_STEPS = PROBLEMS.length * PHASE_ORDER.length;

const CODE_SKELETON_ROWS = ["72%", "88%", "64%"] as const;

const DISTRACTION_SITES = [
  "youtube.com",
  "reddit.com",
  "facebook.com",
  "x.com",
] as const;

const DOCK_APPS: DockApp[] = [
  { id: "finder", name: "Finder", icon: "/dock/finder.png", open: true },
  { id: "chrome", name: "Google Chrome", icon: "/dock/googlechrome.png", open: true },
  { id: "vscode", name: "Visual Studio Code", icon: "/dock/vscode.png" },
  { id: "zoom", name: "Zoom", icon: "/dock/zoom.png" },
  { id: "settings", name: "System Settings", icon: "/dock/settings.png" },
  {
    id: "trash",
    name: "Trash",
    icon: "/dock/trashcan.png",
    separatorBefore: true,
    imageClassName: "scale-95",
  },
];

const CONFETTI_PARTICLES = [
  { x: -88, y: -26, rotate: -62, color: "#22c55e", delay: 0 },
  { x: -70, y: 22, rotate: 81, color: "#111827", delay: 0.02 },
  { x: -44, y: -52, rotate: -18, color: "#f59e0b", delay: 0.04 },
  { x: -24, y: 42, rotate: 122, color: "#9ca3af", delay: 0.01 },
  { x: 12, y: -64, rotate: 36, color: "#16a34a", delay: 0.03 },
  { x: 38, y: 50, rotate: -96, color: "#111827", delay: 0.06 },
  { x: 68, y: -30, rotate: 72, color: "#22c55e", delay: 0.02 },
  { x: 92, y: 18, rotate: -128, color: "#f59e0b", delay: 0.05 },
  { x: -105, y: 4, rotate: 44, color: "#16a34a", delay: 0.07 },
  { x: 108, y: -4, rotate: -42, color: "#9ca3af", delay: 0 },
] as const;

export default function SolveProgressDemo() {
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.35 });
  const reduceMotion = Boolean(useReducedMotion());
  const [step, setStep] = React.useState(0);

  const displayStep = reduceMotion ? TOTAL_STEPS - 1 : step;
  const currentProblemIndex = Math.min(
    Math.floor(displayStep / PHASE_ORDER.length),
    PROBLEMS.length - 1
  );
  const phase = PHASE_ORDER[displayStep % PHASE_ORDER.length];
  const solvedCount = Math.min(
    currentProblemIndex + (phase === "progressUpdated" ? 1 : 0),
    PROBLEMS.length
  );
  const currentProblem = PROBLEMS[currentProblemIndex];

  React.useEffect(() => {
    if (!isInView || reduceMotion) {
      return;
    }

    const duration =
      PHASE_DURATIONS[phase] +
      (currentProblemIndex === PROBLEMS.length - 1 && phase === "progressUpdated"
        ? 900
        : 0);
    const timer = window.setTimeout(() => {
      setStep((current) => (current + 1) % TOTAL_STEPS);
    }, duration);

    return () => window.clearTimeout(timer);
  }, [currentProblemIndex, isInView, phase, reduceMotion]);

  return (
    <section id="solve-loop" ref={sectionRef} className="px-4 py-20 sm:px-6 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1fr] lg:items-end">
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.18em] text-gray-500">
              the solve loop
            </p>
            <h2 className="mt-5 max-w-3xl text-3xl font-normal leading-none tracking-super-tight text-black sm:text-4xl md:text-6xl">
              Every solve moves the progress bar.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-relaxed text-neutral-700 sm:text-lg lg:justify-self-end">
            LeetGuard watches for accepted submissions, updates your daily
            progress, and keeps distractions blocked until the goal is done.
          </p>
        </div>

        <div className="relative mt-12 overflow-hidden rounded-lg border border-gray-200 bg-slate-100 bg-[url('/marketing/sequoia-1600.jpg')] bg-cover bg-[center_5%] p-4 shadow-sm sm:p-5 lg:p-6">
          <div className="pointer-events-none absolute inset-0 bg-white/10" />
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 hidden h-8 items-center justify-between bg-gray-100/60 px-5 text-[13px] font-medium text-gray-700 shadow-[0_1px_10px_rgba(15,23,42,0.08)] backdrop-blur-md sm:flex">
            <div className="flex items-center gap-4">
              <img src="/menu-bar/appleicon.svg" alt="" className="h-4 w-4" />
              <span className="font-semibold text-black">Chrome</span>
              <span>File</span>
              <span>Edit</span>
              <span>View</span>
              <span>History</span>
              <span>Bookmarks</span>
            </div>
            <div className="flex items-center gap-3 text-[13px] font-medium text-gray-800">
              <img src="/menu-bar/wifi.svg" alt="" className="h-[18px] w-[18px]" />
              <img src="/menu-bar/battery.svg" alt="" className="h-[18px] w-7" />
              <img
                src="/menu-bar/control-centre.svg"
                alt=""
                className="h-4 w-4"
              />
              <span>Wed 1 Jul 18:06</span>
            </div>
          </div>

          <div className="relative z-10 grid gap-5 pb-20 sm:pt-10 lg:grid-cols-[1.2fr_0.8fr] lg:pb-24">
            <SubmissionCard
              isComplete={solvedCount === PROBLEMS.length}
              phase={phase}
              problem={currentProblem}
              problemIndex={currentProblemIndex}
              reduceMotion={reduceMotion}
            />
            <ProgressCard
              currentProblemIndex={currentProblemIndex}
              phase={phase}
              solvedCount={solvedCount}
            />
          </div>

          <div className="absolute bottom-4 left-1/2 z-10 hidden -translate-x-1/2 sm:block">
            <MacOSDock apps={DOCK_APPS} baseSize={48} />
          </div>
        </div>
      </div>
    </section>
  );
}

function SubmissionCard({
  isComplete,
  phase,
  problem,
  problemIndex,
  reduceMotion,
}: {
  isComplete: boolean;
  phase: DemoPhase;
  problem: (typeof PROBLEMS)[number];
  problemIndex: number;
  reduceMotion: boolean;
}) {
  const isAccepted = phase !== "preparing";
  const showToast = phase === "accepted" || phase === "progressUpdated";

  return (
    <div className="relative flex h-full min-h-[560px] flex-col overflow-hidden rounded-lg border border-white/80 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.10)]">
      <div className="flex min-w-0 items-center gap-2 border-b border-gray-200 bg-gray-50 px-3 py-2.5 sm:px-4">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
        <p className="ml-2 min-w-0 truncate text-xs font-mono text-gray-500">
          leetcode.com/problems/{problem.slug}
        </p>
      </div>

      <div className="grid min-h-[410px] flex-1 gap-0 md:grid-cols-[minmax(0,1fr)_minmax(270px,0.72fr)]">
          <div className="min-w-0 border-b border-gray-200 p-4 md:border-b-0 md:border-r md:p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-mono uppercase tracking-[0.18em] text-gray-500">
                  question {problemIndex + 1} of 3
                </p>
                <motion.h3
                  key={problem.title}
                  initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="mt-4 truncate text-2xl font-normal leading-tight text-black sm:text-3xl"
                >
                  {problem.title}
                </motion.h3>
              </div>
              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-mono text-green-700">
                Easy
              </span>
            </div>

            <div className="mt-8 h-[170px] rounded-md bg-gray-50 p-4 font-mono text-xs text-gray-600 sm:text-sm">
              {CODE_SKELETON_ROWS.map((width, index) => (
                <motion.p
                  key={`${problem.slug}-${index}`}
                  initial={reduceMotion ? false : { opacity: 0.35 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25, delay: index * 0.06 }}
                  className="flex h-9 items-center"
                >
                  <span className="mr-4 shrink-0 text-gray-400">{index + 1}</span>
                  <span
                    className="block h-2 rounded-full bg-gray-300"
                    style={{ width }}
                  />
                </motion.p>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {["Run", "Submit", "Analyze"].map((label) => (
                <span
                  key={label}
                  className="inline-flex h-9 items-center justify-center rounded-md border border-gray-200 px-4 text-sm font-medium text-gray-700"
                >
                  {label === "Submit" && <Play className="mr-2 h-3.5 w-3.5 fill-current" />}
                  {label}
                </span>
              ))}
            </div>

          </div>

          <div className="min-w-0 p-4 md:p-5">
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs font-mono uppercase tracking-[0.18em] text-gray-500">
                submission
              </p>
              <motion.span
                key={`${problem.slug}-${isAccepted}`}
                initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className={
                  isAccepted
                    ? "flex min-h-10 w-28 items-center justify-end whitespace-nowrap text-right text-sm font-medium text-green-600"
                    : "flex min-h-10 w-28 items-center justify-end whitespace-nowrap text-right text-sm font-medium text-amber-600"
                }
              >
                {isAccepted ? "Accepted" : "Running tests"}
              </motion.span>
            </div>

            <div className="mt-8 grid gap-4">
              <MetricBlock
                label="Testcases"
                value={isAccepted ? problem.tests : "checking"}
                active={isAccepted}
              />
              <MetricBlock
                label="Runtime"
                value={isAccepted ? problem.runtime : "--"}
                active={isAccepted}
              />
              <div className="rounded-md bg-gray-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-black">Result</span>
                  <span
                    className={
                      isAccepted
                        ? "inline-flex items-center gap-2 text-sm font-medium text-green-600"
                        : "text-sm font-medium text-amber-600"
                    }
                  >
                    {isAccepted && <Check className="h-4 w-4" />}
                    {isAccepted ? "Accepted" : "Judging"}
                  </span>
                </div>
              </div>
            </div>
          </div>
      </div>

      <DistractionPanel isComplete={isComplete} />

      <AnimatePresence>
        {showToast && (
          <SolveToast
            key={`${problem.slug}-toast`}
            brandPhase={phase === "progressUpdated"}
            problemTitle={problem.title}
            reduceMotion={reduceMotion}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function SolveToast({
  brandPhase,
  problemTitle,
  reduceMotion,
}: {
  brandPhase: boolean;
  problemTitle: string;
  reduceMotion: boolean;
}) {
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: -10, x: "-50%", scale: 0.98 }}
      animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
      exit={reduceMotion ? undefined : { opacity: 0, y: -8, x: "-50%", scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute left-1/2 top-7 z-20 grid w-[min(360px,calc(100%-2rem))] grid-cols-[34px_minmax(0,1fr)] items-center gap-3 overflow-visible rounded-lg border border-gray-200 bg-white px-3 py-2.5 shadow-[0_12px_30px_rgba(0,0,0,0.16),0_2px_8px_rgba(0,0,0,0.08)]"
    >
      {!brandPhase && !reduceMotion && <ToastConfetti />}
      <span
        className={
          brandPhase
            ? "relative z-10 flex h-[34px] w-[34px] items-center justify-center rounded bg-black"
            : "relative z-10 flex h-[34px] w-[34px] items-center justify-center rounded-full bg-green-500 text-white"
        }
      >
        {brandPhase ? (
          <img
            src="/leetguard-logo.png"
            alt=""
            className="h-[34px] w-[34px] rounded object-cover"
          />
        ) : (
          <Check className="h-[18px] w-[18px] stroke-[3]" />
        )}
      </span>
      <motion.div
        key={brandPhase ? "brand" : "solve"}
        initial={reduceMotion ? false : { opacity: 0, y: 3 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        className="relative z-10 min-w-0"
      >
        <p
          className={
            brandPhase
              ? "text-[10px] font-bold uppercase leading-tight tracking-[0.12em] text-black"
              : "text-[10px] font-bold uppercase leading-tight tracking-[0.14em] text-green-600"
          }
        >
          {brandPhase ? "LeetGuard" : "Solved"}
        </p>
        <p className="mt-0.5 truncate text-[15px] font-semibold leading-tight text-gray-800">
          {brandPhase ? "Progress updated" : problemTitle}
        </p>
      </motion.div>
    </motion.div>
  );
}

function DistractionPanel({ isComplete }: { isComplete: boolean }) {
  return (
    <div className="border-t border-gray-200 bg-white px-4 py-4 md:px-5">
      <div className="grid gap-4 lg:grid-cols-[minmax(120px,max-content)_minmax(0,1fr)] lg:items-center">
        <div className="flex min-w-[120px] items-center gap-2">
          <StatusPing isComplete={isComplete} />
          <p className="whitespace-nowrap text-sm font-medium text-black">
            {isComplete ? "Access restored" : "Blocked sites"}
          </p>
        </div>
        <div className="flex min-w-0 flex-wrap gap-1.5 lg:justify-end">
          {DISTRACTION_SITES.map((site) => (
            <span
              key={site}
              className={
                isComplete
                  ? "inline-flex items-center gap-1.5 rounded-full border border-green-300 px-2.5 py-1 text-[11px] font-mono text-gray-600 shadow-[0_0_18px_rgba(34,197,94,0.18)]"
                  : "inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-2.5 py-1 text-[11px] font-mono text-gray-600"
              }
            >
              <img
                src={`https://www.google.com/s2/favicons?domain=${site}&sz=32`}
                alt=""
                className="h-4 w-4 rounded-sm"
              />
              {site}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatusPing({ isComplete }: { isComplete: boolean }) {
  return (
    <span aria-hidden="true" className="relative flex h-3 w-3 shrink-0">
      <span
        className={
          isComplete
            ? "absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-45"
            : "absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-45"
        }
      />
      <span
        className={
          isComplete
            ? "relative inline-flex h-3 w-3 rounded-full bg-green-500"
            : "relative inline-flex h-3 w-3 rounded-full bg-red-500"
        }
      />
    </span>
  );
}

function ToastConfetti() {
  return (
    <div className="pointer-events-none absolute inset-[-34px] overflow-visible">
      {CONFETTI_PARTICLES.map((particle, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, x: 0, y: 0, rotate: 0, scale: 0.9 }}
          animate={{
            opacity: [0, 1, 0],
            x: particle.x,
            y: particle.y,
            rotate: particle.rotate,
            scale: 0.72,
          }}
          transition={{ duration: 0.9, delay: particle.delay, ease: [0.16, 1, 0.3, 1] }}
          style={{ backgroundColor: particle.color }}
          className="absolute left-1/2 top-1/2 h-2.5 w-1 rounded-sm"
        />
      ))}
    </div>
  );
}

function MetricBlock({
  label,
  value,
  active,
}: {
  label: string;
  value: string;
  active: boolean;
}) {
  return (
    <div className="rounded-md bg-gray-50 p-4">
      <p className="text-xs font-mono uppercase tracking-[0.16em] text-gray-500">
        {label}
      </p>
      <p className={active ? "mt-3 text-2xl font-medium text-black" : "mt-3 text-2xl font-medium text-gray-400"}>
        {value}
      </p>
    </div>
  );
}

function ProgressCard({
  currentProblemIndex,
  phase,
  solvedCount,
}: {
  currentProblemIndex: number;
  phase: DemoPhase;
  solvedCount: number;
}) {
  const progress = (solvedCount / PROBLEMS.length) * 100;
  const remaining = PROBLEMS.length - solvedCount;
  const isComplete = solvedCount === PROBLEMS.length;

  return (
    <div className="h-full min-h-[560px] overflow-hidden rounded-lg border border-white/80 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.10)]">
      <div className="flex min-w-0 items-center gap-2 border-b border-gray-200 bg-gray-50 px-3 py-2.5 sm:px-4">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
        <p className="ml-2 min-w-0 truncate text-xs font-mono text-gray-500">
          leetguard.co/activity
        </p>
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <img
            src="/leetguard-logo.png"
            alt=""
            className="h-9 w-9 rounded object-cover"
          />
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.18em] text-gray-500">
              LeetGuard
            </p>
            <h3 className="text-2xl font-normal leading-tight text-black">My Activity</h3>
          </div>
        </div>

        <div className="mt-9">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-lg font-medium text-black">Today's Progress</p>
              <p className="mt-1 text-sm text-gray-500">Questions Completed</p>
            </div>
            <motion.p
              key={solvedCount}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22 }}
              className="font-mono text-xl font-semibold text-black"
            >
              {solvedCount} / 3
            </motion.p>
          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-gray-200">
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="h-full rounded-full bg-green-500"
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.p
              key={isComplete ? "complete" : remaining}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="mt-4 min-h-[48px] font-mono text-sm text-gray-700"
            >
              {isComplete
                ? "Focus complete. Distractions unlocked."
                : `Complete ${remaining} more ${remaining === 1 ? "question" : "questions"} to unlock.`}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="mt-8 space-y-3">
          {PROBLEMS.map((problem, index) => {
            const isSolved = index < solvedCount;
            const isActive = index === currentProblemIndex && phase !== "progressUpdated";

            return (
              <div
                key={problem.slug}
                className={
                  isActive
                    ? "flex items-center justify-between gap-4 rounded-md border border-green-200 bg-green-50 px-4 py-3"
                    : "flex items-center justify-between gap-4 rounded-md border border-gray-200 px-4 py-3"
                }
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-black">{problem.title}</p>
                  <p className="mt-1 text-xs font-mono text-gray-500">accepted submission</p>
                </div>
                <span
                  className={
                    isSolved
                      ? "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-500 text-white"
                      : "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500"
                  }
                >
                  {isSolved ? <Check className="h-4 w-4 stroke-[3]" /> : index + 1}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
