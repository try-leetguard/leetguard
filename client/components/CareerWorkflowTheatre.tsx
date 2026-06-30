"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Check,
  ClipboardList,
  Code2,
  MousePointer2,
  Search,
} from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";

const workflowSteps = [
  {
    label: "Context",
    title: "Load the truth",
    note: "Pull product behavior, user pain, and existing code into the room.",
  },
  {
    label: "Plan",
    title: "Shape the move",
    note: "Use AI to pressure-test the path before touching the product.",
  },
  {
    label: "Build",
    title: "Make the patch",
    note: "Write the smallest useful version with the system already in mind.",
  },
  {
    label: "Review",
    title: "Keep the taste",
    note: "Run the checks, trim the noise, and make the work feel intentional.",
  },
] as const;

const cursorTargets = [
  { x: "16%", y: "47%" },
  { x: "40%", y: "60%" },
  { x: "63%", y: "44%" },
  { x: "87%", y: "58%" },
] as const;

const cursorTravelMs = 520;

function WorkflowCard({
  active,
  children,
}: {
  active: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`min-h-[260px] rounded-lg border p-5 transition-colors duration-300 ${
        active
          ? "border-black bg-black text-white"
          : "border-gray-300 bg-white text-black"
      }`}
    >
      {children}
    </div>
  );
}

export default function CareerWorkflowTheatre() {
  const prefersReducedMotion = useReducedMotion();
  const [cursorStep, setCursorStep] = useState(0);
  const [touchedStep, setTouchedStep] = useState<number | null>(0);

  useEffect(() => {
    if (prefersReducedMotion) {
      setCursorStep(workflowSteps.length - 1);
      setTouchedStep(workflowSteps.length - 1);
      return;
    }

    let arrivalTimer: number | undefined;

    const timer = window.setInterval(() => {
      setCursorStep((current) => {
        const nextStep = (current + 1) % workflowSteps.length;

        setTouchedStep(null);
        if (arrivalTimer) window.clearTimeout(arrivalTimer);

        arrivalTimer = window.setTimeout(() => {
          setTouchedStep(nextStep);
        }, cursorTravelMs);

        return nextStep;
      });
    }, 2200);

    return () => {
      window.clearInterval(timer);
      if (arrivalTimer) window.clearTimeout(arrivalTimer);
    };
  }, [prefersReducedMotion]);

  const visibleCursorStep = prefersReducedMotion
    ? workflowSteps.length - 1
    : cursorStep;
  const visibleTouchedStep = prefersReducedMotion
    ? workflowSteps.length - 1
    : touchedStep;
  const detailStep = visibleTouchedStep ?? visibleCursorStep;
  const cursor = cursorTargets[visibleCursorStep];

  return (
    <section className="px-6 pb-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <p className="text-xs font-mono uppercase tracking-[0.18em] text-gray-500">
            workflow
          </p>
          <h2 className="mt-4 text-4xl font-normal leading-tight text-black md:text-5xl">
            AI moves fast. Judgment decides where.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-neutral-700">
            We use AI to plan, code, and review without outsourcing taste. The
            point is sharper judgment, not louder output.
          </p>
        </div>

        <div className="relative rounded-lg border border-gray-300 bg-white p-4 shadow-lg">
          <motion.div
            className="pointer-events-none absolute z-20 hidden text-black lg:block"
            animate={{ left: cursor.x, top: cursor.y }}
            transition={{ duration: prefersReducedMotion ? 0 : cursorTravelMs / 1000 }}
          >
            <MousePointer2 className="h-6 w-6 fill-white drop-shadow-md" />
          </motion.div>

          <div className="grid gap-4 lg:grid-cols-4">
            <WorkflowCard active={visibleTouchedStep === 0}>
              <div className="mb-5 flex items-center justify-between">
                <Search className="h-5 w-5" />
                <span className="text-xs font-mono opacity-60">01</span>
              </div>
              <p className="text-xs font-mono uppercase tracking-[0.16em] opacity-60">
                Context
              </p>
              <h3 className="mt-3 text-2xl font-normal">Load the truth</h3>
              <div className="mt-6 space-y-2 text-xs font-mono">
                {["existing code", "product intent", "user friction"].map(
                  (item) => (
                    <div
                      key={item}
                      className={`rounded-sm border px-3 py-2 ${
                        visibleTouchedStep === 0
                          ? "border-white/20 bg-white/10"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      {item}
                    </div>
                  )
                )}
              </div>
            </WorkflowCard>

            <WorkflowCard active={visibleTouchedStep === 1}>
              <div className="mb-5 flex items-center justify-between">
                <ClipboardList className="h-5 w-5" />
                <span className="text-xs font-mono opacity-60">02</span>
              </div>
              <p className="text-xs font-mono uppercase tracking-[0.16em] opacity-60">
                Plan
              </p>
              <h3 className="mt-3 text-2xl font-normal">Shape the move</h3>
              <div className="mt-6 space-y-3">
                {["Scope it", "Find risks", "Choose the boring path"].map(
                  (item, index) => (
                    <div key={item} className="flex items-center gap-3 text-sm">
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] ${
                          visibleTouchedStep === 1
                            ? "border-white/30"
                            : "border-gray-300 text-gray-500"
                        }`}
                      >
                        {index + 1}
                      </span>
                      {item}
                    </div>
                  )
                )}
              </div>
            </WorkflowCard>

            <WorkflowCard active={visibleTouchedStep === 2}>
              <div className="mb-5 flex items-center justify-between">
                <Code2 className="h-5 w-5" />
                <span className="text-xs font-mono opacity-60">03</span>
              </div>
              <p className="text-xs font-mono uppercase tracking-[0.16em] opacity-60">
                Build
              </p>
              <h3 className="mt-3 text-2xl font-normal">Make the patch</h3>
              <pre
                className={`mt-6 overflow-hidden rounded-sm border p-3 text-[11px] leading-5 ${
                  visibleTouchedStep === 2
                    ? "border-white/20 bg-white/10 text-gray-100"
                    : "border-gray-200 bg-gray-50 text-gray-500"
                }`}
              >
                {`const change = {
  small: true,
  tested: true,
  felt: true
};`}
              </pre>
            </WorkflowCard>

            <WorkflowCard active={visibleTouchedStep === 3}>
              <div className="mb-5 flex items-center justify-between">
                <Bot className="h-5 w-5" />
                <span className="text-xs font-mono opacity-60">04</span>
              </div>
              <p className="text-xs font-mono uppercase tracking-[0.16em] opacity-60">
                Review
              </p>
              <h3 className="mt-3 text-2xl font-normal">Keep the taste</h3>
              <div className="mt-6 space-y-3">
                {["Build passes", "Copy is human", "Motion earns its place"].map(
                  (item) => (
                    <div key={item} className="flex items-center gap-3 text-sm">
                      <Check className="h-4 w-4 shrink-0" />
                      {item}
                    </div>
                  )
                )}
              </div>
            </WorkflowCard>
          </div>

          <div className="mt-4 grid gap-3 rounded-lg border border-gray-300 bg-gray-50 p-4 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.16em] text-gray-500">
                {workflowSteps[detailStep].label}
              </p>
              <p className="mt-2 text-xl font-normal text-black">
                {workflowSteps[detailStep].title}
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-700">
                {workflowSteps[detailStep].note}
              </p>
            </div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.16em] text-black">
              Human-led
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
