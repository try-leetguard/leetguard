"use client";

import { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";
import NavbarLight from "@/components/NavbarLight";
import { notes } from "@/lib/notes";

export default function NotesPage() {
  useEffect(() => {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }, []);

  return (
    <div className="relative min-h-screen bg-white text-black">
      <NavbarLight />

      <section className="px-4 pb-14 pt-32 sm:px-6 md:pb-20 md:pt-40">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-xs font-mono uppercase tracking-[0.18em] text-gray-500">
            notes
          </p>
          <h1 className="mt-5 text-4xl font-normal leading-none tracking-super-tight text-black sm:text-5xl md:text-7xl">
            Field notes for building focus.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base font-normal leading-relaxed tracking-wide text-neutral-700 sm:text-lg md:mt-8 md:text-xl">
            Product decisions, build progress, and the small things we learn
            while making LeetGuard sharper.
          </p>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 md:pb-32">
        <div className="mx-auto max-w-5xl">
          <div className="border-y border-gray-200">
            {notes.map((note) => (
              <Link
                key={note.slug}
                href={`/notes/${note.slug}`}
                className="group grid gap-8 py-10 transition-colors duration-200 hover:bg-gray-50 md:grid-cols-[0.7fr_1fr_auto] md:items-center"
              >
                <div>
                  <p className="text-xs font-mono uppercase tracking-[0.18em] text-gray-500">
                    {note.label}
                  </p>
                  <p className="mt-3 text-sm text-neutral-600">
                    {note.date} · {note.readTime}
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-normal leading-tight text-black sm:text-3xl md:text-4xl">
                    {note.title}
                  </h2>
                  <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-700">
                    {note.excerpt}
                  </p>
                </div>

                <span className="inline-flex items-center text-sm font-medium text-black md:justify-self-end">
                  Read
                  <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
