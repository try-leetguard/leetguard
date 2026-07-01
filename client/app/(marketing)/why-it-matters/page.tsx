"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import FocusCostTheatre from "@/components/FocusCostTheatre";
import Footer from "@/components/Footer";
import NavbarLight from "@/components/NavbarLight";

const proofCards = [
  {
    label: "01",
    title: "Re-entry is the tax",
    copy: "A distraction is rarely just the time spent away. The real cost is rebuilding the mental stack you had before the tab opened.",
  },
  {
    label: "02",
    title: "Momentum needs a first win",
    copy: "One accepted problem creates forward motion. LeetGuard protects that first win before the internet gets a vote.",
  },
  {
    label: "03",
    title: "Scrolling feels better after closure",
    copy: "The reward is not deleted. It moves after the solve, when your practice session has a clean ending.",
  },
] as const;

export default function WhyItMattersPage() {
  useEffect(() => {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }, []);

  return (
    <div className="relative min-h-screen bg-white text-black">
      <NavbarLight />

      <section className="px-4 pb-12 pt-32 sm:px-6 md:pb-16 md:pt-40">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-normal leading-none tracking-super-tight text-black sm:text-5xl md:text-7xl">
            One tab becomes the whole session.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base font-normal leading-relaxed tracking-wide text-neutral-700 sm:text-lg md:mt-8 md:text-xl">
            LeetGuard changes the order: solve first, scroll after.
          </p>
        </div>
      </section>

      <FocusCostTheatre />

      <section className="px-4 pb-20 sm:px-6 md:pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p className="text-xs font-mono uppercase tracking-[0.18em] text-gray-500">
              why it matters
            </p>
            <h2 className="mt-4 text-3xl font-normal leading-tight text-black sm:text-4xl md:text-5xl">
              Focus fails quietly.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {proofCards.map((card) => (
              <div
                key={card.title}
                className="rounded-lg border border-gray-300 bg-white p-6"
              >
                <p className="text-xs font-mono text-gray-500">{card.label}</p>
                <h3 className="mt-5 text-2xl font-normal text-black">
                  {card.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-neutral-700">
                  {card.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 md:pb-28">
        <div className="mx-auto max-w-4xl rounded-lg border border-gray-300 bg-white p-5 text-center shadow-sm sm:p-8">
          <p className="text-xs font-mono uppercase tracking-[0.18em] text-gray-500">
            first solve first
          </p>
          <h2 className="mt-5 text-3xl font-normal leading-none tracking-super-tight text-black sm:text-4xl md:text-6xl">
            Protect the first solve.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-neutral-700">
            Finish one problem, then choose what comes next.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/features"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-black/20 bg-black px-6 text-sm font-medium text-white transition-all duration-200 hover:border-black/50 hover:text-white hover:shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:shadow-black/30"
            >
              <span>See How It Works</span>
              <ArrowRight className="ml-2 h-3.5 w-3.5" />
            </Link>
            <Link
              href="/signup"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-gray-300 bg-white px-6 text-sm font-medium text-black transition-all duration-200 hover:border-black hover:text-black"
            >
              Start Free
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
