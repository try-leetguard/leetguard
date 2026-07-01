"use client";

import {
  ArrowRight,
  ChevronDown,
  CircuitBoard,
  Megaphone,
  Spline,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { type MouseEvent, useEffect, useState } from "react";
import CareerWorkflowTheatre from "@/components/CareerWorkflowTheatre";
import Footer from "@/components/Footer";
import {
  DepthIcon,
  FlowIcon,
  ImpactIcon,
  QualityIcon,
} from "@/components/icons/CareerValueIcons";
import NavbarLight from "@/components/NavbarLight";

const departments = [
  {
    id: "engineering",
    name: "Engineering",
    icon: CircuitBoard,
    roles: [
      {
        title: "Backend Engineer",
        detail: "FastAPI, data integrity, and focus rules that stay true.",
        href: "/careers/backend-engineer",
        location: "Remote",
      },
      {
        title: "Frontend Engineer",
        detail: "Next.js surfaces, product polish, and flows users feel.",
        href: "/careers/frontend-engineer",
        location: "Remote",
      },
      {
        title: "Full-Stack Engineer",
        detail: "Work across the extension, dashboard, API, and product loops.",
        href: "/careers/full-stack-engineer",
        location: "Remote",
      },
    ],
  },
  {
    id: "product",
    name: "Product",
    icon: Spline,
    roles: [
      {
        title: "Product Designer",
        detail: "Shape the interaction language for focus and restraint.",
        href: "/careers/product-designer",
        location: "Remote",
      },
    ],
  },
  {
    id: "go-to-market",
    name: "Go-to-market",
    icon: Megaphone,
    roles: [
      {
        title: "Marketing / Growth",
        detail: "Tell the story to coders who know the scroll is costing them.",
        href: "/careers/marketing-growth",
        location: "Remote",
      },
    ],
  },
  {
    id: "open-lane",
    name: "Open lane",
    icon: Sparkles,
    roles: [
      {
        title: "Anything Else",
        detail: "Bring a useful angle we have not named yet.",
        href: "/careers/anything-else",
        location: "Remote",
      },
    ],
  },
] as const;

const coreValues = [
  {
    label: "01",
    icon: QualityIcon,
    title: "Quality is the bar",
    copy: "Frontend polish and backend logic matter more than whether we use AI or not. AI helps us move; quality decides whether the work earned its place.",
  },
  {
    label: "02",
    icon: DepthIcon,
    title: "Think past the first consequence",
    copy: "Before shipping, we ask what can break: edge cases, vulnerabilities, use cases, and the second-order effects that follow the obvious ones.",
  },
  {
    label: "03",
    icon: FlowIcon,
    title: "Ideas move together",
    copy: "Good work comes from listening well. We share context early, disagree cleanly, and let the strongest version of an idea survive the room.",
  },
  {
    label: "04",
    icon: ImpactIcon,
    title: "Impact before effort",
    copy: "We do not protect work just because it was hard. If the outcome is weak, we change direction and put energy where users actually feel it.",
  },
] as const;

export default function CareersPage() {
  const [expandedDepartments, setExpandedDepartments] = useState<string[]>([]);

  useEffect(() => {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }, []);

  const roleCount = departments.reduce(
    (total, department) => total + department.roles.length,
    0
  );
  const allExpanded = expandedDepartments.length === departments.length;

  const toggleDepartment = (departmentId: string) => {
    setExpandedDepartments((current) =>
      current.includes(departmentId)
        ? current.filter((id) => id !== departmentId)
        : [...current, departmentId]
    );
  };

  const toggleAllDepartments = () => {
    setExpandedDepartments(
      allExpanded ? [] : departments.map((department) => department.id)
    );
  };

  const scrollToOpenPositions = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    const target = document.getElementById("open-positions");
    if (!target) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    window.history.pushState(null, "", "#open-positions");

    const navbarOffset = 60;
    const targetTop = target.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
      top: Math.max(targetTop - navbarOffset, 0),
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <div className="relative min-h-screen bg-white text-black">
      <NavbarLight />

      <section className="px-4 pb-20 pt-32 sm:px-6 md:pb-28 md:pt-40">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-xs font-mono uppercase tracking-[0.18em] text-gray-500">
            careers
          </p>
          <h1 className="text-4xl font-normal leading-none tracking-super-tight text-black sm:text-5xl md:text-7xl">
            Build where focus gets made.
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-base font-normal leading-relaxed tracking-wide text-neutral-700 sm:text-lg md:mt-8 md:text-xl">
            We are a small team using AI, taste, and careful engineering to make
            practice happen before the internet takes over.
          </p>
          <div className="mt-8 flex justify-center">
            <a
              href="#open-positions"
              onClick={scrollToOpenPositions}
              className="inline-flex h-12 items-center justify-center rounded-lg border border-black/20 bg-black px-6 text-sm font-medium text-white transition-all duration-200 hover:border-black/50 hover:text-white hover:shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:shadow-black/30"
            >
              View Open Positions
              <ArrowRight className="ml-2 h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </section>

      <CareerWorkflowTheatre />

      <section className="px-4 py-20 sm:px-6 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p className="text-xs font-mono uppercase tracking-[0.18em] text-gray-500">
              why
            </p>
            <h2 className="mt-4 text-3xl font-normal leading-tight text-black sm:text-4xl md:text-5xl">
              Our Mission
            </h2>
          </div>

          <div className="grid gap-10 md:grid-cols-2">
            <p className="text-xl font-normal leading-relaxed text-black sm:text-2xl md:text-3xl">
              LeetGuard exists to help people do the hard useful thing before
              the easy distracting thing.
            </p>
            <div className="space-y-6 text-sm leading-relaxed text-neutral-700">
              <p>
                The product starts with LeetCode because the loop is clear:
                practice, progress, then permission. But the deeper mission is
                bigger than one site. We want focus to feel engineered, not
                negotiated.
              </p>
              <p>
                We build with AI because it lets a small team move with unusual
                leverage. We still own the taste, the tradeoffs, and the final
                product people have to trust.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <p className="text-xs font-mono uppercase tracking-[0.18em] text-gray-500">
              our values
            </p>
            <h2 className="mt-5 text-3xl font-normal leading-tight text-black sm:text-4xl md:text-6xl">
              Our Internal Core Values
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-neutral-700">
              A framework for how we use AI, make decisions, and keep product
              quality higher than our own attachment to the work.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {coreValues.map((value) => {
              const Icon = value.icon;

              return (
                <div
                  key={value.title}
                  className="flex min-h-[280px] flex-col justify-center rounded-lg bg-gray-100 p-6 sm:p-8 md:min-h-[340px] md:p-10"
                >
                  <div className="flex justify-start">
                    <Icon className="h-16 w-16 text-black sm:h-20 sm:w-20 md:h-24 md:w-24" />
                  </div>
                  <h3 className="mt-8 text-2xl font-normal leading-tight text-black md:mt-12 md:text-3xl">
                    {value.title}
                  </h3>
                  <p className="mt-5 max-w-xl text-sm leading-relaxed text-neutral-700">
                    {value.copy}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="open-positions"
        className="scroll-mt-24 px-4 pb-20 pt-8 sm:px-6 md:pb-32 md:pt-12"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p className="text-xs font-mono uppercase tracking-[0.18em] text-gray-500">
              open positions
            </p>
            <h2 className="mt-4 text-3xl font-normal leading-tight text-black sm:text-4xl md:text-5xl">
              Find the lane where you can raise the bar.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-neutral-700">
              Every lane has a shape now. Read the role, steal the vibe, and
              decide where you would raise the bar.
            </p>
          </div>

          <div className="mb-5 flex flex-col gap-3 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-mono uppercase tracking-[0.16em] text-gray-500">
              {roleCount} roles across {departments.length} teams
            </p>
            <button
              type="button"
              onClick={toggleAllDepartments}
              className="w-fit text-xs font-mono uppercase tracking-[0.16em] text-gray-500 transition-colors hover:text-black"
            >
              {allExpanded ? "Collapse all" : "Expand all"} ·{" "}
              {expandedDepartments.length} of {departments.length} expanded
            </button>
          </div>

          <div className="divide-y divide-gray-200 border-b border-gray-200">
            {departments.map((department) => {
              const isExpanded = expandedDepartments.includes(department.id);

              return (
                <div key={department.id}>
                  <button
                    type="button"
                    onClick={() => toggleDepartment(department.id)}
                    className="flex w-full items-center justify-between gap-5 py-7 text-left transition-colors hover:bg-gray-50"
                  >
                    <div className="flex min-w-0 items-center gap-5 px-3">
                      <department.icon className="h-5 w-5 shrink-0 text-gray-500" />
                      <div>
                        <h3 className="text-xl font-normal text-black md:text-2xl">
                          {department.name}
                        </h3>
                        <p className="mt-1 text-xs font-mono uppercase tracking-[0.16em] text-gray-500">
                          {department.roles.length}{" "}
                          {department.roles.length === 1 ? "role" : "roles"}
                        </p>
                      </div>
                    </div>
                    <ChevronDown
                      className={`mr-3 h-5 w-5 shrink-0 text-gray-500 transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isExpanded ? (
                    <div className="bg-gray-50">
                      {department.roles.map((role) => (
                        <Link
                          key={role.title}
                          href={role.href}
                          className="group grid gap-3 border-t border-gray-200 px-6 py-5 transition-colors hover:bg-white md:grid-cols-[1fr_1.4fr_auto]"
                        >
                          <div>
                            <h4 className="text-lg font-normal text-black">
                              {role.title}
                            </h4>
                            <p className="mt-1 text-xs font-mono uppercase tracking-[0.16em] text-gray-500">
                              {department.name}
                            </p>
                          </div>
                          <p className="max-w-xl text-sm leading-relaxed text-neutral-700">
                            {role.detail}
                          </p>
                          <div className="flex items-center gap-5 text-xs font-mono uppercase tracking-[0.16em] text-gray-500 md:justify-end">
                            <span>{role.location}</span>
                            <span className="inline-flex items-center gap-2 text-black">
                              Apply
                              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>

          <div className="mt-6 rounded-lg border border-black bg-black p-6 text-white">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.18em] text-gray-300">
                  not sure where you fit?
                </p>
                <h3 className="mt-3 text-2xl font-normal md:text-3xl">
                  Useful people rarely fit clean boxes.
                </h3>
              </div>
              <Link
                href="/careers/anything-else"
                className="inline-flex h-12 shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white px-6 text-sm font-medium text-black transition-all duration-200 hover:border-white hover:text-black"
              >
                Tell Us Anyway
                <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
