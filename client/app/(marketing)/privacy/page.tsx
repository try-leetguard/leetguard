"use client";

import Footer from "@/components/Footer";
import NavbarLight from "@/components/NavbarLight";

const dataReceipts = [
  {
    label: "Account",
    title: "Who are you?",
    copy: "Email, optional display name, verification state, OAuth basics, and password auth data when you use password login.",
  },
  {
    label: "Focus",
    title: "What are you blocking?",
    copy: "Blocklist domains, daily goal, daily progress, and activity history when LeetGuard logs a solved or attempted problem.",
  },
  {
    label: "Extension",
    title: "Can the blocker work?",
    copy: "Chrome storage may hold tokens, settings, progress cache, and synced blocklist data so the extension can do its job.",
  },
  {
    label: "Ops",
    title: "Is the app alive?",
    copy: "Basic technical logs can help us debug, secure, and keep the product from falling over at the worst possible time.",
  },
] as const;

const privacyMoves = [
  {
    title: "We use data to run the loop.",
    copy: "Sign in, sync the extension, remember your blocklist, count your daily progress, send verification emails, show activity, fix bugs, and keep the service safe.",
  },
  {
    title: "We do not sell your personal information.",
    copy: "Your focus habits are not our marketplace. Your blocked sites are not a lead magnet. Your progress is not ad inventory.",
  },
  {
    title: "Some helpers touch the machinery.",
    copy: "Hosting, database, email, auth, infrastructure, and debugging providers may process data only where needed to provide the service.",
  },
  {
    title: "OAuth is a handshake with another company.",
    copy: "If you use Google or GitHub login, those providers handle their side under their own terms and privacy policies.",
  },
  {
    title: "Local storage is part of the product.",
    copy: "The app and extension use browser or Chrome storage. Clearing it may sign you out, reset cached state, or make sync grumpy until you reconnect.",
  },
  {
    title: "Security is serious, not magical.",
    copy: "We use reasonable safeguards like password hashing and token-based auth. No online system gets to promise invincibility with a straight face.",
  },
] as const;

const controls = [
  "Update your blocklist, goal, profile name, and extension settings where the app supports it.",
  "Ask to access, correct, or delete personal information by emailing support@leetguard.com.",
  "Remove the extension or clear local browser storage when you want a local reset.",
  "Expect some records to remain if law, fraud prevention, security, or dispute handling requires it.",
] as const;

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white text-black">
      <NavbarLight />

      <main>
        <section className="px-6 pb-24 pt-40">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-mono uppercase tracking-[0.18em] text-gray-500">
              privacy policy
            </p>

            <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-lg bg-black p-8 text-white md:p-10">
                <p className="text-xs font-mono uppercase tracking-[0.18em] text-gray-400">
                  the whole mood
                </p>
                <h1 className="mt-6 text-6xl font-normal leading-none tracking-super-tight md:text-7xl">
                  No weird stuff.
                </h1>
                <p className="mt-8 max-w-2xl text-lg leading-relaxed text-gray-300">
                  LeetGuard needs enough data to block distractions, sync your
                  progress, and let you back in after the solve. That is the
                  assignment. Not a surveillance side quest.
                </p>
              </div>

              <div className="grid gap-5">
                <div className="rounded-lg border border-gray-300 bg-gray-50 p-6">
                  <p className="text-xs font-mono uppercase tracking-[0.18em] text-gray-500">
                    last updated
                  </p>
                  <p className="mt-4 text-4xl font-normal text-black">
                    June 30, 2026
                  </p>
                </div>
                <div className="rounded-lg border border-gray-300 bg-white p-6">
                  <p className="text-xs font-mono uppercase tracking-[0.18em] text-gray-500">
                    tiny thesis
                  </p>
                  <p className="mt-4 text-3xl font-normal leading-tight text-black">
                    We protect focus. We do not flip your data into confetti.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 pb-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.18em] text-gray-500">
                  data receipts
                </p>
                <h2 className="mt-4 text-4xl font-normal leading-tight md:text-5xl">
                  What enters the room.
                </h2>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-neutral-700">
                If a data category does not help the focus loop work, it should
                not be hanging around pretending to be useful.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              {dataReceipts.map((item) => (
                <div
                  key={item.title}
                  className="min-h-[250px] rounded-lg border border-gray-300 bg-white p-5"
                >
                  <p className="text-xs font-mono uppercase tracking-[0.16em] text-gray-500">
                    {item.label}
                  </p>
                  <h3 className="mt-14 text-2xl font-normal leading-tight">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-neutral-700">
                    {item.copy}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 pb-24">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-5 md:grid-cols-2">
              {privacyMoves.map((move) => (
                <section key={move.title} className="rounded-lg bg-gray-100 p-8">
                  <h2 className="text-3xl font-normal leading-tight">
                    {move.title}
                  </h2>
                  <p className="mt-5 text-sm leading-relaxed text-neutral-700">
                    {move.copy}
                  </p>
                </section>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 pb-28">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-lg bg-black p-8 text-white md:p-10">
                <p className="text-xs font-mono uppercase tracking-[0.18em] text-gray-400">
                  your controls
                </p>
                <h2 className="mt-5 text-5xl font-normal leading-tight">
                  You still get buttons.
                </h2>
                <p className="mt-6 text-sm leading-relaxed text-gray-300">
                  Privacy without controls is just a speech. Here is what you
                  can actually do.
                </p>
              </div>

              <div className="divide-y divide-gray-200 rounded-lg border border-gray-300 bg-white">
                {controls.map((control) => (
                  <p
                    key={control}
                    className="p-6 text-sm leading-relaxed text-neutral-700"
                  >
                    {control}
                  </p>
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-lg border border-gray-300 bg-gray-50 p-6">
              <p className="text-sm leading-relaxed text-neutral-700">
                LeetGuard is not for children under 13. We operate from the
                United States, and your information may be processed in the
                United States or wherever our service providers operate. If this
                policy changes meaningfully, we update this page and may provide
                extra notice when appropriate. Privacy questions go to{" "}
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
