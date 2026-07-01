"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Check,
  Circle,
  Clock,
  Code2,
  Globe,
  MousePointer2,
  ToggleLeft,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const steps = [
  {
    label: "Attempt",
    title: "A distraction starts",
    url: "youtube.com/watch?v=shorts",
    message: "The browser begins loading a blocked site.",
  },
  {
    label: "Blocked",
    title: "LeetGuard intercepts",
    url: "leetguard.co/blocked",
    message: "The page redirects into a focus gate.",
  },
  {
    label: "Solve",
    title: "Practice comes first",
    url: "leetcode.com/problems/two-sum",
    message: "The user returns to LeetCode and solves the problem.",
  },
  {
    label: "Progress",
    title: "Progress syncs",
    url: "leetguard.co/activity",
    message: "The extension and dashboard update together.",
  },
  {
    label: "Unlock",
    title: "The day is claimed",
    url: "youtube.com/watch?v=focus-break",
    message: "Daily goal complete. YouTube is reachable again.",
  },
] as const;

const cursorPositions = [
  { x: "20%", y: "22%" },
  { x: "50%", y: "48%" },
  { x: "70%", y: "31%" },
  { x: "80%", y: "58%" },
  { x: "56%", y: "68%" },
] as const;

const unlockedRecommendations = [
  {
    title: "I used LeetGuard for 48 hours",
    label: "Trending",
    image: "https://i.ytimg.com/vi/931s4CemMHU/hqdefault.jpg",
  },
  {
    title: "System design notes for interview prep",
    label: "Engineering",
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=720&q=80",
  },
  {
    title: "Deep focus music for builders",
    label: "Focus playlist",
    image:
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=720&q=80",
  },
] as const;

const unlockedMainVideoImage =
  "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=960&q=80";

const youtubeCommentBubbles = [
  { width: "82%", replyWidth: "58%" },
  { width: "70%", replyWidth: "44%" },
  { width: "88%", replyWidth: "62%" },
] as const;

const blockedSites = [
  {
    domain: "youtube.com",
    icon: "https://www.google.com/s2/favicons?domain=youtube.com&sz=64",
  },
  {
    domain: "instagram.com",
    icon: "https://www.google.com/s2/favicons?domain=instagram.com&sz=64",
  },
  {
    domain: "snapchat.com",
    icon: "https://www.google.com/s2/favicons?domain=snapchat.com&sz=64",
  },
  {
    domain: "facebook.com",
    icon: "https://www.google.com/s2/favicons?domain=facebook.com&sz=64",
  },
  {
    domain: "netflix.com",
    icon: "https://www.google.com/s2/favicons?domain=netflix.com&sz=64",
  },
] as const;

function BrowserChrome({ url }: { url: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-gray-200 px-3 py-2 sm:gap-3 sm:px-4 sm:py-3">
      <div className="flex gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400 sm:h-3 sm:w-3" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400 sm:h-3 sm:w-3" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-500 sm:h-3 sm:w-3" />
      </div>
      <div className="flex min-w-0 flex-1 items-center gap-2 rounded-sm border border-gray-300 bg-gray-50 px-3 py-2 text-xs font-mono text-black">
        <Globe className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate">{url}</span>
      </div>
    </div>
  );
}

function LeetGuardMark({ className }: { className: string }) {
  return <img src="/leetguard-logo.png" alt="" className={className} />;
}

function StatusPing({ status }: { status: "blocked" | "unlocked" }) {
  const colorClasses =
    status === "blocked"
      ? "bg-red-500 text-red-500"
      : "bg-green-600 text-green-600";

  return (
    <span className="relative flex h-2.5 w-2.5 shrink-0">
      <span
        className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-25 ${colorClasses}`}
      />
      <span
        className={`relative inline-flex h-2.5 w-2.5 rounded-full ${colorClasses}`}
      />
    </span>
  );
}

function BlocklistRows({ status }: { status: "blocked" | "unlocked" }) {
  return (
    <div className="space-y-2">
      {blockedSites.map((site) => (
        <div
          key={site.domain}
          className="flex items-center justify-between rounded-sm border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-mono text-black"
        >
          <span className="flex min-w-0 items-center gap-2">
            <img
              src={site.icon}
              alt=""
              loading="lazy"
              className="h-4 w-4 shrink-0 rounded-sm"
            />
            <span className="truncate">{site.domain}</span>
          </span>
          <StatusPing status={status} />
        </div>
      ))}
    </div>
  );
}

function BlockedSiteScene() {
  return (
    <div className="grid h-full gap-4 p-4 md:grid-cols-[1fr_0.8fr] md:p-5">
      <div className="flex flex-col justify-between rounded-lg border border-gray-300 bg-white p-4 md:p-5">
        <div>
          <div className="mb-4 flex items-center gap-2 text-xs font-mono text-red-600">
            <Circle className="h-2.5 w-2.5 fill-red-600" />
            blocked domain detected
          </div>
          <h3 className="text-2xl font-normal leading-tight text-black md:text-3xl">
            youtube.com
          </h3>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-neutral-700">
            The page tries to pull attention away before the daily goal is done.
          </p>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3">
          {["Shorts", "Recommended", "Autoplay", "Comments"].map((item) => (
            <div
              key={item}
              className="rounded-sm border border-gray-200 bg-gray-50 p-3 text-xs font-medium text-gray-500"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-lg border border-gray-300 bg-gray-50 p-4 md:p-5">
        <div className="mb-4 h-3 w-24 rounded-full bg-gray-200" />
        <div className="space-y-3">
          <div className="h-16 rounded-sm bg-white" />
          <div className="h-16 rounded-sm bg-white" />
          <div className="h-16 rounded-sm bg-white" />
        </div>
      </div>
    </div>
  );
}

function BlockedGateScene() {
  return (
    <div className="grid h-full gap-4 p-4 md:grid-cols-[0.9fr_1fr] md:p-5">
      <div className="rounded-lg border border-gray-400 bg-white p-4 md:p-5">
        <div className="mb-5 flex items-center gap-3">
          <LeetGuardMark className="h-9 w-9" />
          <div>
            <p className="text-xs font-mono text-gray-500">
              Synced from extension
            </p>
            <h3 className="text-xl font-medium text-black">LeetGuard</h3>
          </div>
        </div>
        <h4 className="text-2xl font-normal text-black md:text-3xl">This site is blocked</h4>
        <p className="mt-3 text-sm leading-relaxed text-neutral-700">
          Complete 1 problem to unlock your blocked websites.
        </p>
        <div className="mt-6">
          <div className="mb-2 flex justify-between text-xs font-medium text-black">
            <span>Questions Completed</span>
            <span>0 / 1</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-gray-200">
            <div className="h-full w-0 rounded-full bg-green-600" />
          </div>
        </div>
      </div>
      <div className="rounded-lg border border-gray-300 bg-white p-4 md:p-5">
        <p className="mb-3 text-xs font-mono text-gray-500">blocked sites</p>
        <BlocklistRows status="blocked" />
      </div>
    </div>
  );
}

function LeetCodeScene() {
  return (
    <div className="grid h-full gap-4 p-4 md:grid-cols-[1fr_1fr] md:p-5">
      <div className="rounded-lg border border-gray-300 bg-white p-4 md:p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-normal text-black md:text-2xl">Two Sum</h3>
          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-mono text-green-700">
            Accepted
          </span>
        </div>
        <p className="text-sm leading-relaxed text-neutral-700">
          Return indices of the two numbers such that they add up to target.
        </p>
        <div className="mt-6 rounded-sm border border-gray-200 bg-gray-50 p-4">
          <p className="mb-2 text-xs font-mono text-gray-500">test result</p>
          <div className="flex items-center gap-2 text-sm font-medium text-green-700">
            <Check className="h-4 w-4" />
            Runtime beats focus drift.
          </div>
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border border-black bg-black p-4 font-mono text-[11px] text-gray-100 md:p-5 md:text-xs">
        <div className="mb-4 flex items-center gap-2 text-gray-400">
          <Code2 className="h-4 w-4" />
          solution.ts
        </div>
        <pre className="whitespace-pre-wrap leading-6">
          {`function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
}`}
        </pre>
      </div>
    </div>
  );
}

function ProgressScene({ complete = false }: { complete?: boolean }) {
  return (
    <div className="grid h-full gap-4 p-4 md:grid-cols-[0.8fr_1fr] md:p-5">
      <div className="rounded-lg border border-gray-400 bg-white p-4 md:p-5">
        <p className="mb-2 text-xs font-mono text-gray-500">my activity</p>
        <h3 className="text-xl font-medium text-black md:text-2xl">Today's Progress</h3>
        <p className="mt-2 text-sm text-neutral-700">
          Track your daily question completion progress.
        </p>
        <div className="mt-6">
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
      </div>
      <div className="rounded-lg border border-gray-400 bg-white p-4 md:p-5">
        <p className="mb-2 text-xs font-mono text-gray-500">
          extension control
        </p>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-black md:text-xl">
              Block/Unblock Websites
            </h3>
            <p className="mt-1 text-xs text-neutral-700">
              {complete
                ? "Daily goal completed. Extension automatically disabled."
                : "Extension is active until the goal is complete."}
            </p>
          </div>
          <div
            className={`flex h-7 w-12 items-center rounded-full p-1 transition-colors ${
              complete ? "justify-start bg-gray-300" : "justify-end bg-green-600"
            }`}
          >
            <span className="h-5 w-5 rounded-full bg-white shadow-sm" />
          </div>
        </div>
        <div className="mt-8">
          <p className="mb-3 text-xs font-mono text-gray-500">block list</p>
          <BlocklistRows status="unlocked" />
        </div>
      </div>
    </div>
  );
}

function UnlockedYouTubeScene() {
  return (
    <div className="grid h-full gap-4 p-4 md:grid-cols-[1fr_0.8fr] md:p-5">
      <div className="flex flex-col rounded-lg border border-gray-300 bg-white p-4 md:p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-green-700">
            <Check className="h-4 w-4" />
            access restored
          </div>
          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-mono text-green-700">
            goal complete
          </span>
        </div>

        <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg bg-[#111827]">
          <img
            src={unlockedMainVideoImage}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/15" />
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-lg sm:h-20 sm:w-20">
            <div className="ml-1 h-0 w-0 border-y-[10px] border-l-[16px] border-y-transparent border-l-black sm:border-y-[14px] sm:border-l-[22px]" />
          </div>
        </div>

        <div className="mt-5 border-b border-gray-200 pb-4">
          <h3 className="text-xl font-normal text-black md:text-2xl">
            YouTube is available again
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-neutral-700">
            LeetGuard steps out of the way after the daily problem is solved.
          </p>
        </div>

        <div className="mt-4 space-y-3">
          {youtubeCommentBubbles.map((comment, index) => (
            <div key={comment.width} className="flex gap-3">
              <div className="h-8 w-8 shrink-0 rounded-full bg-gray-200" />
              <div className="min-w-0 flex-1">
                <div className="mb-2 h-3 w-20 rounded-full bg-gray-200" />
                <div
                  className="mb-1.5 h-3 rounded-full bg-gray-100"
                  style={{ width: comment.width }}
                />
                <div
                  className="h-3 rounded-full bg-gray-100"
                  style={{ width: comment.replyWidth }}
                />
                {index === 0 ? (
                  <div className="mt-2 h-2 w-24 rounded-full bg-gray-100" />
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-gray-300 bg-white p-4 md:p-5">
        <p className="mb-3 text-xs font-mono text-gray-500">
          recommended, but optional
        </p>
        {unlockedRecommendations.map((item) => (
            <div
              key={item.title}
              className="mb-3 rounded-sm border border-gray-200 bg-gray-50 p-3"
            >
              <img
                src={item.image}
                alt=""
                loading="lazy"
                className="mb-2 aspect-video w-full rounded-sm object-cover"
              />
              <p className="text-xs font-medium text-black">{item.title}</p>
              <p className="mt-1 text-[11px] font-mono text-gray-500">
                {item.label} · unlocked after 1 / 1
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}

function Scene({ step }: { step: number }) {
  if (step === 0) return <BlockedSiteScene />;
  if (step === 1) return <BlockedGateScene />;
  if (step === 2) return <LeetCodeScene />;
  if (step === 3) return <ProgressScene complete />;
  return <UnlockedYouTubeScene />;
}

function ExtensionPopup({ step }: { step: number }) {
  const complete = step >= 3;

  return (
    <div className="rounded-lg border border-gray-300 bg-white p-4 shadow-lg">
      <div className="mb-4 text-center">
        <LeetGuardMark className="mx-auto mb-2 h-10 w-10" />
        <h3 className="text-sm font-semibold tracking-wide text-black">
          MY ACTIVITY
        </h3>
      </div>
      <div className="rounded border border-gray-300 bg-white p-3 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-medium text-black">Today's Progress</h4>
          <span className="flex items-center gap-1 text-[11px] font-mono text-gray-600">
            <Clock className="h-3 w-3" />
            23:45:12
          </span>
        </div>
        <div className="mb-2 flex justify-between text-xs font-medium text-black">
          <span>Questions Completed</span>
          <span>{complete ? "1 / 1" : "0 / 1"}</span>
        </div>
        <div className="mb-2 h-3 overflow-hidden rounded-full bg-gray-200">
          <motion.div
            className="h-full rounded-full bg-green-600"
            animate={{ width: complete ? "100%" : "0%" }}
            transition={{ duration: 0.6 }}
          />
        </div>
        <p className="text-[10px] font-mono text-black">
          {complete
            ? "Daily goal completed! Enjoy your scroll."
            : "Complete 1 more question to unlock."}
        </p>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded border border-gray-300 bg-white p-3 text-center">
          <p className="mb-2 text-xs font-medium text-black">Edit Blocklist</p>
          <button className="w-full rounded border border-gray-300 px-2 py-1 text-xs text-black">
            Edit
          </button>
        </div>
        <div className="rounded border border-gray-300 bg-white p-3 text-center">
          <p className="mb-2 text-xs font-medium text-black">Extension</p>
          <div className="flex justify-center">
            <ToggleLeft
              className={`h-7 w-7 ${complete ? "text-gray-400" : "text-green-600"}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductTheatre() {
  const prefersReducedMotion = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const timer = window.setInterval(() => {
      setStep((current) => (current + 1) % steps.length);
    }, 2300);

    return () => window.clearInterval(timer);
  }, [prefersReducedMotion]);

  const visibleStep = prefersReducedMotion ? steps.length - 1 : step;
  const activeStep = steps[visibleStep];
  const cursor = useMemo(() => cursorPositions[visibleStep], [visibleStep]);

  return (
    <section className="px-4 pb-20 sm:px-6 md:pb-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {steps.map((item, index) => (
            <div
              key={item.label}
              className={`rounded-lg border px-4 py-3 transition-colors ${
                index === visibleStep
                  ? "border-black bg-black text-white"
                  : "border-gray-200 bg-white text-black"
              }`}
            >
              <p className="text-xs font-mono">{item.label}</p>
              <p className="mt-1 text-sm font-medium">{item.title}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="relative overflow-hidden rounded-lg border border-gray-300 bg-white shadow-lg">
            <BrowserChrome url={`https://${activeStep.url}`} />
            <div className="relative bg-white md:min-h-[560px]">
              <motion.div
                className="pointer-events-none absolute z-20 hidden text-black lg:block"
                animate={{
                  left: cursor.x,
                  top: cursor.y,
                }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
              >
                <MousePointer2 className="h-6 w-6 fill-white drop-shadow-md" />
              </motion.div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={visibleStep}
                  className="relative md:absolute md:inset-0"
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                >
                  <Scene step={visibleStep} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="space-y-4">
            <ExtensionPopup step={visibleStep} />
            <div className="rounded-lg border border-gray-300 bg-white p-5">
              <p className="text-xs font-mono text-gray-500">
                {activeStep.label.toLowerCase()} state
              </p>
              <h3 className="mt-2 text-2xl font-normal text-black">
                {activeStep.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-neutral-700">
                {activeStep.message}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
