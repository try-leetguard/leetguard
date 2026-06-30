"use client";

import Footer from "@/components/Footer";
import NavbarLight from "@/components/NavbarLight";

const pactCards = [
  {
    label: "You",
    title: "Use it for focus.",
    copy: "Block sites, solve problems, track progress, and enjoy the scroll after the work is done.",
  },
  {
    label: "Not you",
    title: "Do not make it cursed.",
    copy: "No attacking, scraping, reselling, impersonating, breaking security, or making the service worse for everyone else.",
  },
  {
    label: "Us",
    title: "Keep the tool honest.",
    copy: "We build the blocker, sync the data, improve the product, and tell you when the rules meaningfully change.",
  },
] as const;

const rules = [
  {
    title: "The deal",
    copy: "LeetGuard is a web app and Chrome extension that helps block distracting websites until your daily coding goal is complete. It may include accounts, blocklists, progress tracking, activity history, extension controls, and related focus features.",
  },
  {
    title: "The account",
    copy: "Keep your login info accurate and safe. You are responsible for activity under your account. You must be at least 13, or older if your local law requires it.",
  },
  {
    title: "The free part",
    copy: "LeetGuard is currently free. If paid plans arrive, pricing and terms need to explain the money part before charges begin. No billing jump scare.",
  },
  {
    title: "Your stuff",
    copy: "Your blocklist, goal settings, profile name, and activity data remain yours. You give us permission to host, process, display, and sync them so LeetGuard can work.",
  },
  {
    title: "Our stuff",
    copy: "The LeetGuard product, brand, design, code, copy, logos, and related materials belong to LeetGuard or its licensors. Please do not copy, clone, sell, or repackage it as your own.",
  },
  {
    title: "Third-party reality",
    copy: "You are still responsible for following the terms of Chrome, Google, GitHub, LeetCode, and any websites you use or block. We do not control their rules.",
  },
  {
    title: "No perfect blocker promise",
    copy: "LeetGuard is provided as is and as available. We work hard, but we do not promise perfect blocking, perfect sync, nonstop access, or compatibility with every browser/site change.",
  },
  {
    title: "If things go sideways",
    copy: "We may suspend or terminate access if you violate these terms, create risk, or abuse the service. To the fullest extent allowed by law, we are not liable for indirect, incidental, special, consequential, or punitive damages.",
  },
] as const;

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white text-black">
      <NavbarLight />

      <main>
        <section className="px-6 pb-24 pt-40">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-mono uppercase tracking-[0.18em] text-gray-500">
              terms of service
            </p>

            <div className="mt-6 rounded-lg bg-black p-8 text-white md:p-10">
              <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
                <div>
                  <p className="text-xs font-mono uppercase tracking-[0.18em] text-gray-400">
                    the focus pact
                  </p>
                  <h1 className="mt-6 text-6xl font-normal leading-none tracking-super-tight md:text-7xl">
                    Do the hard thing first.
                  </h1>
                </div>
                <div>
                  <p className="text-lg leading-relaxed text-gray-300">
                    These are the rules for using LeetGuard without turning a
                    focus tool into a courtroom subplot.
                  </p>
                  <p className="mt-6 text-xs font-mono uppercase tracking-[0.18em] text-gray-400">
                    updated June 30, 2026
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 pb-24">
          <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
            {pactCards.map((card) => (
              <div
                key={card.title}
                className="rounded-lg border border-gray-300 bg-white p-6"
              >
                <p className="text-xs font-mono uppercase tracking-[0.18em] text-gray-500">
                  {card.label}
                </p>
                <h2 className="mt-12 text-3xl font-normal leading-tight">
                  {card.title}
                </h2>
                <p className="mt-5 text-sm leading-relaxed text-neutral-700">
                  {card.copy}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-6 pb-28">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-end">
              <h2 className="text-5xl font-normal leading-tight">
                The actual rules, still not tiny.
              </h2>
              <p className="text-sm leading-relaxed text-neutral-700">
                We made this readable because nobody should need a nap after
                checking the terms. Readable does not mean optional.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {rules.map((rule) => (
                <section
                  key={rule.title}
                  className="min-h-[230px] rounded-lg bg-gray-100 p-8"
                >
                  <h3 className="text-3xl font-normal leading-tight">
                    {rule.title}
                  </h3>
                  <p className="mt-5 text-sm leading-relaxed text-neutral-700">
                    {rule.copy}
                  </p>
                </section>
              ))}
            </div>

            <div className="mt-5 rounded-lg border border-gray-300 bg-white p-6">
              <p className="text-sm leading-relaxed text-neutral-700">
                These terms are intended to be governed by United States law and
                applicable state law, without regard to conflict-of-law rules. We
                may update them as the product changes; if you keep using
                LeetGuard after updated terms take effect, you accept the
                updated terms. Questions go to{" "}
                <a
                  href="mailto:support@leetguard.com"
                  className="text-black underline underline-offset-4"
                >
                  support@leetguard.com
                </a>
                .
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
