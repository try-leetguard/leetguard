"use client";

import {
  ArrowRight,
  Check,
  CreditCard,
  LayoutDashboard,
  ShieldCheck,
  Target,
} from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import Footer from "@/components/Footer";
import NavbarLight from "@/components/NavbarLight";

const includedFeatures = [
  "Browser guard for distraction sites",
  "Daily problem goal and unlock loop",
  "Dashboard progress tracking",
  "Blocklist editing",
  "Chrome extension support",
] as const;

const noTricks = [
  { label: "No credit card", icon: CreditCard },
  { label: "Chrome extension", icon: ShieldCheck },
  { label: "Dashboard included", icon: LayoutDashboard },
  { label: "Daily goal unlock", icon: Target },
] as const;

const comparison = [
  {
    title: "LeetGuard",
    label: "free",
    items: [
      "The browser guard blocks first",
      "Progress decides when scrolling unlocks",
      "The dashboard keeps the rule visible",
    ],
  },
  {
    title: "Doing it manually",
    label: "expensive in attention",
    items: [
      "You negotiate with every tab",
      "The goal moves after the distraction starts",
      "Willpower becomes the product",
    ],
  },
] as const;

export default function PricingPage() {
  useEffect(() => {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }, []);

  return (
    <div className="relative min-h-screen bg-white text-black">
      <NavbarLight />

      <section className="px-6 pb-16 pt-40">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-6xl font-normal leading-none tracking-super-tight text-black md:text-7xl">
            Free means free.
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-xl font-normal leading-relaxed tracking-wide text-neutral-700">
            Start with the browser guard, dashboard, and daily unlock loop. No
            credit card, no billing puzzle.
          </p>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-lg border border-gray-300 bg-white p-8 shadow-sm">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <span className="w-fit rounded-full bg-black px-4 py-2 text-xs font-mono text-white">
                free while we build
              </span>
              <span className="text-xs font-mono text-gray-500">
                no trial clock
              </span>
            </div>

            <div>
              <p className="text-sm font-medium text-neutral-700">
                LeetGuard Free
              </p>
              <div className="mt-3 flex items-end gap-3">
                <span className="text-7xl font-normal leading-none tracking-super-tight text-black">
                  $0
                </span>
                <span className="pb-2 text-sm font-mono text-gray-500">
                  today
                </span>
              </div>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-neutral-700">
                Build the habit first. Pay nothing to make your first solve
                harder to avoid.
              </p>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {includedFeatures.map((feature) => (
                <div
                  key={feature}
                  className="flex items-start gap-3 rounded-sm border border-gray-200 bg-gray-50 px-3 py-3"
                >
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-black"
                    strokeWidth={3}
                  />
                  <span className="text-sm text-black">{feature}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-black/20 bg-black px-6 text-sm font-medium text-white transition-all duration-200 hover:border-black/50 hover:text-white hover:shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:shadow-black/30"
              >
                <span>Start Free</span>
                <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </Link>
              <Link
                href="/features"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-gray-300 bg-white px-6 text-sm font-medium text-black transition-all duration-200 hover:border-black hover:text-black"
              >
                See How It Works
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-gray-300 bg-white p-6">
            <p className="text-xs font-mono uppercase tracking-[0.18em] text-gray-500">
              no tricks
            </p>
            <h2 className="mt-4 text-4xl font-normal leading-tight text-black">
              The price should not be another thing to manage.
            </h2>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {noTricks.map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                >
                  <item.icon className="h-5 w-5 text-black" />
                  <p className="mt-4 text-sm font-medium text-black">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-lg border border-black bg-black p-5 text-white">
              <p className="text-xs font-mono text-gray-300">
                pricing philosophy
              </p>
              <p className="mt-3 text-2xl font-normal">
                First solve first. Billing page never.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p className="text-xs font-mono uppercase tracking-[0.18em] text-gray-500">
              comparison
            </p>
            <h2 className="mt-4 text-4xl font-normal leading-tight text-black md:text-5xl">
              Same internet. Different rules.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {comparison.map((plan, index) => (
              <div
                key={plan.title}
                className={`rounded-lg border p-6 ${
                  index === 0
                    ? "border-black bg-black text-white"
                    : "border-gray-300 bg-white text-black"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-3xl font-normal">{plan.title}</h3>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-mono ${
                      index === 0
                        ? "bg-white text-black"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {plan.label}
                  </span>
                </div>
                <div className="mt-8 space-y-3">
                  {plan.items.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <Check
                        className={`mt-0.5 h-4 w-4 shrink-0 ${
                          index === 0 ? "text-white" : "text-black"
                        }`}
                        strokeWidth={3}
                      />
                      <p
                        className={`text-sm leading-relaxed ${
                          index === 0 ? "text-gray-100" : "text-neutral-700"
                        }`}
                      >
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
