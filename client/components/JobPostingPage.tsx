"use client";

import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import Footer from "@/components/Footer";
import NavbarLight from "@/components/NavbarLight";
import { applyUrl, type JobPosting } from "@/lib/jobs";

type JobPostingPageProps = {
  job: JobPosting;
};

export default function JobPostingPage({ job }: JobPostingPageProps) {
  useEffect(() => {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }, []);

  return (
    <div className="relative min-h-screen bg-white text-black">
      <NavbarLight />

      <main>
        <section className="px-6 pb-20 pt-36 md:pt-40">
          <div className="mx-auto max-w-6xl">
            <Link
              href="/careers#open-positions"
              className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 transition-colors hover:text-black"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to open positions
            </Link>

            <div className="mt-10 grid gap-10 border-y border-gray-200 py-12 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.18em] text-gray-500">
                  {job.eyebrow}
                </p>
                <h1 className="mt-5 max-w-4xl text-6xl font-normal leading-none tracking-super-tight text-black md:text-7xl">
                  {job.title}
                </h1>
                <p className="mt-8 max-w-3xl text-2xl font-normal leading-tight text-black md:text-3xl">
                  {job.headline}
                </p>
              </div>

              <div className="flex flex-col items-start gap-4 lg:items-end">
                <p className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-black">
                  <Image
                    src="/usflag.svg"
                    alt=""
                    width={18}
                    height={18}
                    aria-hidden="true"
                  />
                  {job.mode} · {job.location}
                </p>
                <a
                  href={applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center rounded-lg bg-black px-6 text-sm font-medium text-white transition-colors duration-200 hover:bg-neutral-800 hover:text-white"
                >
                  Apply Now
                  <ArrowRight className="ml-2 h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 pb-28">
          <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[0.72fr_1fr] lg:gap-20">
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="border-t border-gray-200 pt-8">
                <p className="text-xs font-mono uppercase tracking-[0.18em] text-gray-500">
                  role summary
                </p>
                <p className="mt-5 text-xl font-normal leading-relaxed text-black">
                  {job.summary}
                </p>
              </div>
            </aside>

            <article className="space-y-14">
              {job.sections.map((section) => (
                <section key={section.title}>
                  <h2 className="text-2xl font-normal leading-tight text-black">
                    {section.title}
                  </h2>

                  {section.paragraphs ? (
                    <div className="mt-6 space-y-5">
                      {section.paragraphs.map((paragraph) => (
                        <p
                          key={paragraph}
                          className="text-base leading-relaxed text-neutral-700"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  ) : null}

                  {section.bullets ? (
                    <ul className="mt-6 space-y-4">
                      {section.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="flex gap-4 text-base leading-relaxed text-neutral-700"
                        >
                          <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}
            </article>
          </div>
        </section>

        <section className="px-6 pb-28">
          <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-3">
            <RoleList
              eyebrow="ownership"
              title="What you would own"
              items={job.ownership}
            />
            <RoleList
              eyebrow="signals"
              title="What good looks like"
              items={job.signals}
            />
            <RoleList
              eyebrow="not this"
              title="What this is not"
              items={job.notThis}
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function RoleList({
  eyebrow,
  title,
  items,
}: {
  eyebrow: string;
  title: string;
  items: ReadonlyArray<string>;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 md:p-8">
      <p className="text-xs font-mono uppercase tracking-[0.18em] text-gray-500">
        {eyebrow}
      </p>
      <h3 className="mt-5 text-2xl font-normal leading-tight text-black">
        {title}
      </h3>
      <ul className="mt-8 space-y-5">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-4 text-sm leading-relaxed text-neutral-700"
          >
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-black" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
