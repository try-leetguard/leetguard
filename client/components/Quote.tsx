"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function Quote() {
  return (
    <section className="pt-24 pb-40 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <blockquote className="text-4xl md:text-5xl font-medium text-black dark:text-black leading-relaxed mb-8">
          "Finally locked in."
        </blockquote>
        <Link href="/why-it-matters">
          <button className="inline-flex items-center justify-center px-6 py-3 h-12 rounded-lg bg-black text-white text-sm font-medium transition-all duration-200 border border-black/20 hover:border-black/50 hover:text-white hover:shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:shadow-black/30">
            <span>Why It Matters</span>
            <ArrowUpRight className="w-3 h-3 ml-1" />
          </button>
        </Link>
      </div>
    </section>
  );
}
