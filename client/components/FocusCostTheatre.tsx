"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check, Circle, Globe, MousePointer2 } from "lucide-react";
import { useEffect, useState } from "react";

const phases = [
  {
    label: "Start",
    title: "LeetCode is open",
    withoutUrl: "leetcode.com/problems/two-sum",
    withUrl: "leetcode.com/problems/two-sum",
  },
  {
    label: "Drift",
    title: "A tab steals the room",
    withoutUrl: "youtube.com/watch?v=focus-break",
    withUrl: "youtube.com/watch?v=focus-break",
  },
  {
    label: "Return",
    title: "The order changes",
    withoutUrl: "youtube.com/watch?v=focus-break",
    withUrl: "leetguard.co/blocked",
  },
  {
    label: "Finish",
    title: "One solve first",
    withoutUrl: "youtube.com/watch?v=focus-break",
    withUrl: "leetcode.com/problems/two-sum",
  },
] as const;

const timeChips = ["+5 min", "+12 min", "+28 min"] as const;

const cursorTargets = [
  { x: "13%", y: "42%" },
  { x: "38%", y: "56%" },
  { x: "62%", y: "43%" },
  { x: "87%", y: "55%" },
] as const;

function LeetGuardMark({ className }: { className: string }) {
  return <img src="/leetguard-logo.png" alt="" className={className} />;
}

function BrowserBar({ url }: { url: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-gray-200 px-3 py-2 sm:gap-3 sm:px-4 sm:py-3">
      <div className="flex gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400 sm:h-3 sm:w-3" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400 sm:h-3 sm:w-3" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-500 sm:h-3 sm:w-3" />
      </div>
      <div className="flex min-w-0 flex-1 items-center gap-2 rounded-sm border border-gray-300 bg-gray-50 px-3 py-2 text-xs font-mono text-black">
        <Globe className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate">https://{url}</span>
      </div>
    </div>
  );
}

function ProblemCard({ dimmed, solved }: { dimmed?: boolean; solved?: boolean }) {
  return (
    <div
      className={`rounded-lg border bg-white p-4 transition-opacity ${
        dimmed ? "border-gray-200 opacity-40" : "border-gray-300 opacity-100"
      }`}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h4 className="text-lg font-normal text-black sm:text-xl">Two Sum</h4>
        {solved ? (
          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-mono text-green-700">
            Accepted
          </span>
        ) : (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-mono text-gray-500">
            Waiting
          </span>
        )}
      </div>
      <p className="text-sm leading-relaxed text-neutral-700">
        Return indices of two numbers such that they add up to target.
      </p>
      <div className="mt-5 rounded-sm border border-gray-200 bg-gray-50 p-3 font-mono text-[11px] text-gray-500">
        solve.ts
        <div className="mt-3 space-y-2">
          <div className="h-2 w-5/6 rounded-full bg-gray-200" />
          <div className="h-2 w-3/5 rounded-full bg-gray-200" />
          <div className="h-2 w-4/6 rounded-full bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

function ProgressMeter({ complete }: { complete: boolean }) {
  return (
    <div className="rounded-lg border border-gray-300 bg-white p-4">
      <div className="mb-2 flex justify-between text-sm font-medium text-black">
        <span>Questions Completed</span>
        <span>{complete ? "1 / 1" : "0 / 1"}</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-gray-200">
        <motion.div
          className="h-full rounded-full bg-green-600"
          animate={{ width: complete ? "100%" : "0%" }}
          transition={{ duration: 0.6 }}
        />
      </div>
    </div>
  );
}

function DistractionPanel({ phase }: { phase: number }) {
  const visibleChips = phase <= 0 ? 0 : Math.min(phase, timeChips.length);

  return (
    <div className="rounded-lg border border-gray-300 bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-mono text-red-600">
          <Circle className="h-2.5 w-2.5 fill-red-600" />
          attention drift
        </div>
        <span className="text-xs font-mono text-gray-500">0 / 1 solved</span>
      </div>
      <div className="rounded-lg bg-black p-4 text-white">
        <p className="text-sm font-medium">Recommended next</p>
        <p className="mt-2 text-xl font-normal sm:text-2xl">One quick video</p>
        <div className="mt-5 aspect-video rounded-sm bg-neutral-800" />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {timeChips.map((chip, index) => (
          <motion.span
            key={chip}
            className={`rounded-full border px-3 py-1 text-xs font-mono ${
              index < visibleChips
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-gray-200 bg-gray-50 text-gray-300"
            }`}
            animate={{
              opacity: index < visibleChips ? 1 : 0.35,
              y: index < visibleChips ? 0 : 6,
            }}
            transition={{ duration: 0.35 }}
          >
            {chip}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

function GuardPanel({
  state,
}: {
  state: "armed" | "blocked" | "unlocked";
}) {
  const isUnlocked = state === "unlocked";

  return (
    <div className="rounded-lg border border-gray-300 bg-white p-4">
      <div className="mb-4 flex items-center gap-3">
        <LeetGuardMark className="h-9 w-9" />
        <div>
          <p className="text-xs font-mono text-gray-500">focus gate</p>
          <h4 className="text-lg font-medium text-black">LeetGuard</h4>
        </div>
      </div>
      {isUnlocked ? (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-green-700">
            <Check className="h-4 w-4" />
            Scroll unlocked
          </div>
          <p className="text-sm leading-relaxed text-green-800">
            The practice is done, so the distraction is optional again.
          </p>
        </div>
      ) : state === "blocked" ? (
        <div className="rounded-lg border border-gray-300 bg-white p-4">
          <p className="text-xl font-normal text-black sm:text-2xl">Blocked for now</p>
          <p className="mt-2 text-sm leading-relaxed text-neutral-700">
            Finish one problem before the scroll starts.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-300 bg-white p-4">
          <p className="text-xl font-normal text-black sm:text-2xl">Guard is armed</p>
          <p className="mt-2 text-sm leading-relaxed text-neutral-700">
            Distraction sites wait behind the first solve.
          </p>
        </div>
      )}
    </div>
  );
}

function WithoutLeetGuard({ phase }: { phase: number }) {
  const drifted = phase >= 1;

  return (
    <div className="overflow-hidden rounded-lg border border-gray-300 bg-white shadow-lg">
      <BrowserBar url={phases[phase].withoutUrl} />
      <div className="p-4 md:min-h-[480px] md:p-5">
        <div className="mb-5 flex items-start justify-between gap-3 sm:items-center">
          <div>
            <p className="text-xs font-mono text-gray-500">without leetguard</p>
            <h3 className="mt-1 text-xl font-normal text-black md:text-2xl">
              {drifted ? "Session drifted" : "Practice starts clean"}
            </h3>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-mono ${
              drifted
                ? "bg-red-50 text-red-700"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {drifted ? "0 / 1" : "ready"}
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <ProblemCard dimmed={drifted} />
          <DistractionPanel phase={phase} />
        </div>

        <div className="mt-4">
          <ProgressMeter complete={false} />
        </div>
      </div>
    </div>
  );
}

function WithLeetGuard({ phase }: { phase: number }) {
  const solved = phase >= 3;
  const guardState = solved ? "unlocked" : phase >= 1 ? "blocked" : "armed";

  return (
    <div className="overflow-hidden rounded-lg border border-gray-300 bg-white shadow-lg">
      <BrowserBar url={phases[phase].withUrl} />
      <div className="p-4 md:min-h-[480px] md:p-5">
        <div className="mb-5 flex items-start justify-between gap-3 sm:items-center">
          <div>
            <p className="text-xs font-mono text-gray-500">with leetguard</p>
            <h3 className="mt-1 text-xl font-normal text-black md:text-2xl">
              {solved ? "Scroll unlocked" : "Solve first"}
            </h3>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-mono ${
              solved
                ? "bg-green-50 text-green-700"
                : "bg-black text-white"
            }`}
          >
            {solved ? "1 / 1" : "guarded"}
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <ProblemCard dimmed={phase === 1} solved={solved} />
          <GuardPanel state={guardState} />
        </div>

        <div className="mt-4">
          <ProgressMeter complete={solved} />
        </div>
      </div>
    </div>
  );
}

export default function FocusCostTheatre() {
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const timer = window.setInterval(() => {
      setPhase((current) => (current + 1) % phases.length);
    }, 2400);

    return () => window.clearInterval(timer);
  }, [prefersReducedMotion]);

  const visiblePhase = prefersReducedMotion ? phases.length - 1 : phase;
  const activePhase = phases[visiblePhase];
  const cursor = cursorTargets[visiblePhase];

  return (
    <section className="px-4 pb-20 sm:px-6 md:pb-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {phases.map((item, index) => (
            <div
              key={item.label}
              className={`rounded-lg border px-4 py-3 transition-colors ${
                index === visiblePhase
                  ? "border-black bg-black text-white"
                  : "border-gray-200 bg-white text-black"
              }`}
            >
              <p className="text-xs font-mono">{item.label}</p>
              <p className="mt-1 text-sm font-medium">{item.title}</p>
            </div>
          ))}
        </div>

        <div className="relative">
          <motion.div
            className="pointer-events-none absolute z-20 hidden text-black lg:block"
            animate={{ left: cursor.x, top: cursor.y }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
          >
            <MousePointer2 className="h-6 w-6 fill-white drop-shadow-md" />
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-2">
            <WithoutLeetGuard phase={visiblePhase} />
            <WithLeetGuard phase={visiblePhase} />
          </div>
        </div>

        <div className="mx-auto mt-6 max-w-3xl rounded-lg border border-gray-300 bg-white p-5 text-center">
          <p className="text-xs font-mono text-gray-500">
            {activePhase.label.toLowerCase()} state
          </p>
          <p className="mt-2 text-xl font-normal text-black md:text-2xl">
            {visiblePhase === phases.length - 1
              ? "Same urge. Different order."
              : activePhase.title}
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-neutral-700">
            {visiblePhase === phases.length - 1
              ? "LeetGuard does not remove the reward. It moves it after the first completed problem."
              : "The cost is not one click. The cost is what the click interrupts."}
          </p>
        </div>
      </div>
    </section>
  );
}
