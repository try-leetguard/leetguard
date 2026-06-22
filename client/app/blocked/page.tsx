"use client";

import Image from "next/image";
import Link from "next/link";
import {
  type CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Info } from "lucide-react";
import { apiClient, type GoalResponse } from "@/lib/api";
import BlocklistAPI from "@/lib/blocklist-api";
import { useAuth } from "@/lib/auth-context";

const INTRO_ITEMS = [
  { type: "text", content: "Discipline over impulse" },
  { type: "text", content: "Take back your time" },
  { type: "video", content: "/logo.mp4" },
] as const;

const CORE_BLOCKED_SITES = [
  "facebook.com",
  "reddit.com",
  "youtube.com",
  "instagram.com",
  "x.com",
];

type ExtensionGoal = {
  target_daily?: number;
  progress_today?: number;
  progress_date?: string;
  is_goal_completed?: boolean;
};

type BlockedPageSnapshot = {
  daily_progress?: number;
  user_goal?: ExtensionGoal | null;
  guest_progress?: ExtensionGoal | null;
  user_blocklist?: string[];
  effective_blocklist?: string[];
  extension_blocking_enabled?: boolean;
  is_authenticated?: boolean;
  user?: unknown;
  source?: string;
  timestamp?: number;
};

type DisplayData = {
  completedToday: number;
  targetDaily: number;
  blockedSites: string[];
  extensionActive: boolean;
  isGuest: boolean;
  sourceLabel: string;
};

type ExtensionDetails = {
  version?: string;
  isDeveloperMode?: boolean;
  extensionId?: string;
};

const DEFAULT_DISPLAY_DATA: DisplayData = {
  completedToday: 0,
  targetDaily: 1,
  blockedSites: CORE_BLOCKED_SITES,
  extensionActive: true,
  isGuest: true,
  sourceLabel: "Guest defaults",
};

function normalizeSites(sites: string[] | undefined): string[] {
  if (!sites || sites.length === 0) return CORE_BLOCKED_SITES;

  const cleaned = sites
    .map((site) => site.trim().toLowerCase())
    .filter(Boolean);

  return Array.from(new Set(cleaned));
}

function toSafeNumber(value: unknown, fallback: number): number {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function formatCountdown(ms: number) {
  if (ms <= 0) return "00:00:00";

  const totalSeconds = Math.floor(ms / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
    2,
    "0"
  );
  const seconds = String(totalSeconds % 60).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}

function nextUtcMidnight() {
  const now = new Date();
  return new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + 1,
      0,
      0,
      0,
      0
    )
  );
}

function deriveSnapshotDisplayData(
  snapshot: BlockedPageSnapshot
): DisplayData {
  const activeGoal = snapshot.user_goal ?? snapshot.guest_progress ?? null;
  const targetDaily = Math.max(
    1,
    toSafeNumber(activeGoal?.target_daily, DEFAULT_DISPLAY_DATA.targetDaily)
  );
  const completedToday = Math.max(
    0,
    toSafeNumber(
      snapshot.daily_progress ?? activeGoal?.progress_today,
      DEFAULT_DISPLAY_DATA.completedToday
    )
  );

  return {
    completedToday,
    targetDaily,
    blockedSites: normalizeSites(
      snapshot.effective_blocklist ?? snapshot.user_blocklist
    ),
    extensionActive: snapshot.extension_blocking_enabled !== false,
    isGuest: snapshot.is_authenticated !== true,
    sourceLabel: "Synced from extension",
  };
}

function deriveGoalDisplayData(
  goal: GoalResponse,
  blockedSites: string[],
  isGuest: boolean
): DisplayData {
  return {
    completedToday: Math.max(0, goal.progress_today),
    targetDaily: Math.max(1, goal.target_daily),
    blockedSites: normalizeSites(blockedSites),
    extensionActive: !goal.is_goal_completed,
    isGuest,
    sourceLabel: isGuest ? "Guest defaults" : "Synced from account",
  };
}

function SiteIcon({ site }: { site: string }) {
  const [hasError, setHasError] = useState(false);
  const domain = site.replace(/^https?:\/\//, "").replace(/^www\./, "");
  const letter = domain.charAt(0).toUpperCase();

  if (hasError) {
    return (
      <span className="mr-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-none border border-gray-200 bg-white text-[10px] font-semibold text-gray-700">
        {letter}
      </span>
    );
  }

  return (
    <img
      src={`https://icons.duckduckgo.com/ip3/${domain}.ico`}
      alt=""
      className="mr-2 h-5 w-5 shrink-0 rounded-none bg-white object-contain"
      style={{ minWidth: 20 }}
      onError={() => setHasError(true)}
    />
  );
}

function ReadOnlySwitch({ enabled }: { enabled: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`flex h-8 w-14 shrink-0 items-center rounded-full border p-1 transition-colors ${
        enabled
          ? "border-green-400 bg-green-400"
          : "border-slate-300 bg-slate-200"
      }`}
    >
      <span
        className={`h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${
          enabled ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </div>
  );
}

export default function BlockedPage() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [introIndex, setIntroIndex] = useState(0);
  const [isIntroVisible, setIsIntroVisible] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);
  const [isDashboardVisible, setIsDashboardVisible] = useState(false);
  const [countdownText, setCountdownText] = useState("24:00:00");
  const [extensionSnapshot, setExtensionSnapshot] =
    useState<BlockedPageSnapshot | null>(null);
  const [extensionTimedOut, setExtensionTimedOut] = useState(false);
  const [fallbackData, setFallbackData] =
    useState<DisplayData>(DEFAULT_DISPLAY_DATA);
  const [isFallbackLoading, setIsFallbackLoading] = useState(true);
  const controlCardRef = useRef<HTMLElement | null>(null);
  const [controlCardHeight, setControlCardHeight] = useState<number | null>(
    null
  );
  const extensionInfoRef = useRef<HTMLDivElement | null>(null);
  const [showExtensionDetails, setShowExtensionDetails] = useState(false);
  const [extensionDetails, setExtensionDetails] =
    useState<ExtensionDetails | null>(null);

  useEffect(() => {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }, []);

  useEffect(() => {
    const readExtensionDetails = () => {
      const marker = document.getElementById("leetguard-extension-installed");

      if (marker) {
        setExtensionDetails({
          version: marker.getAttribute("data-version") ?? undefined,
          isDeveloperMode: marker.getAttribute("data-dev-mode") === "true",
          extensionId: marker.getAttribute("data-extension-id") ?? undefined,
        });
        return;
      }

      if (window.leetguardExtension) {
        setExtensionDetails({
          version: window.leetguardExtension.version,
          isDeveloperMode: window.leetguardExtension.isDeveloperMode,
          extensionId: window.leetguardExtension.extensionId,
        });
      }
    };

    readExtensionDetails();
    window.addEventListener("leetguardExtensionReady", readExtensionDetails);

    return () => {
      window.removeEventListener(
        "leetguardExtensionReady",
        readExtensionDetails
      );
    };
  }, []);

  useEffect(() => {
    if (!showExtensionDetails) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        extensionInfoRef.current &&
        !extensionInfoRef.current.contains(target)
      ) {
        setShowExtensionDetails(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showExtensionDetails]);

  useEffect(() => {
    if (introComplete) return;

    const currentItem = INTRO_ITEMS[introIndex];
    const displayDuration = currentItem.type === "video" ? 2200 : 1600;
    const entryTimer = window.setTimeout(() => setIsIntroVisible(true), 80);
    const fadeTimer = window.setTimeout(
      () => setIsIntroVisible(false),
      displayDuration
    );
    const nextTimer = window.setTimeout(() => {
      if (introIndex === INTRO_ITEMS.length - 1) {
        setIntroComplete(true);
        return;
      }

      setIntroIndex((current) => current + 1);
    }, displayDuration + 500);

    return () => {
      window.clearTimeout(entryTimer);
      window.clearTimeout(fadeTimer);
      window.clearTimeout(nextTimer);
    };
  }, [introComplete, introIndex]);

  useEffect(() => {
    if (!introComplete) return;

    const dashboardTimer = window.setTimeout(
      () => setIsDashboardVisible(true),
      80
    );

    return () => window.clearTimeout(dashboardTimer);
  }, [introComplete]);

  useEffect(() => {
    let deadline = nextUtcMidnight();

    const tick = () => {
      const remaining = deadline.getTime() - Date.now();
      if (remaining <= 0) {
        deadline = nextUtcMidnight();
        setCountdownText("24:00:00");
        return;
      }

      setCountdownText(formatCountdown(remaining));
    };

    tick();
    const interval = window.setInterval(tick, 1000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const controlCard = controlCardRef.current;
    if (!controlCard) return;

    const syncControlCardHeight = () => {
      setControlCardHeight(
        Math.ceil(controlCard.getBoundingClientRect().height)
      );
    };

    syncControlCardHeight();
    window.addEventListener("resize", syncControlCardHeight);

    if (typeof ResizeObserver === "undefined") {
      return () => {
        window.removeEventListener("resize", syncControlCardHeight);
      };
    }

    const observer = new ResizeObserver(syncControlCardHeight);
    observer.observe(controlCard);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncControlCardHeight);
    };
  }, []);

  const requestExtensionSnapshot = useCallback(() => {
    window.postMessage(
      { type: "REQUEST_BLOCKED_PAGE_SNAPSHOT" },
      window.location.origin
    );
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.source !== window || event.origin !== window.location.origin) {
        return;
      }

      if (event.data?.type === "BLOCKED_PAGE_SNAPSHOT") {
        setExtensionSnapshot(event.data.snapshot ?? null);
        setExtensionTimedOut(false);
      }
    };

    const handleExtensionReady = () => requestExtensionSnapshot();

    window.addEventListener("message", handleMessage);
    window.addEventListener("leetguardExtensionReady", handleExtensionReady);
    requestExtensionSnapshot();

    const timeout = window.setTimeout(() => {
      setExtensionTimedOut(true);
    }, 900);

    return () => {
      window.removeEventListener("message", handleMessage);
      window.removeEventListener(
        "leetguardExtensionReady",
        handleExtensionReady
      );
      window.clearTimeout(timeout);
    };
  }, [requestExtensionSnapshot]);

  useEffect(() => {
    let cancelled = false;

    const loadFallbackData = async () => {
      if (isAuthLoading) return;

      setIsFallbackLoading(true);

      if (!isAuthenticated) {
        if (!cancelled) {
          setFallbackData(DEFAULT_DISPLAY_DATA);
          setIsFallbackLoading(false);
        }
        return;
      }

      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("Missing access token");

        const [goal, sites] = await Promise.all([
          apiClient.getGoal(token),
          BlocklistAPI.getUserBlocklist(),
        ]);

        if (!cancelled) {
          setFallbackData(deriveGoalDisplayData(goal, sites, false));
        }
      } catch (error) {
        console.error("Failed to load blocked-page fallback data:", error);
        if (!cancelled) {
          setFallbackData({
            ...DEFAULT_DISPLAY_DATA,
            isGuest: false,
            sourceLabel: "Account fallback",
          });
        }
      } finally {
        if (!cancelled) {
          setIsFallbackLoading(false);
        }
      }
    };

    loadFallbackData();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isAuthLoading]);

  const displayData = useMemo(() => {
    if (extensionSnapshot) {
      return deriveSnapshotDisplayData(extensionSnapshot);
    }

    return fallbackData;
  }, [extensionSnapshot, fallbackData]);

  const progressPercent = Math.min(
    100,
    Math.round((displayData.completedToday / displayData.targetDaily) * 100)
  );
  const remainingQuestions = Math.max(
    displayData.targetDaily - displayData.completedToday,
    0
  );
  const isGoalComplete = remainingQuestions === 0;
  const isLoading = !extensionSnapshot && !extensionTimedOut && isFallbackLoading;
  const currentIntroItem = INTRO_ITEMS[introIndex];
  const matchedCardHeightStyle = controlCardHeight
    ? ({
        "--control-card-height": `${controlCardHeight}px`,
      } as CSSProperties)
    : undefined;

  if (!introComplete) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-black">
        <div
          className={`transition-opacity duration-500 ${
            isIntroVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {currentIntroItem.type === "video" ? (
            <div className="flex items-center justify-center">
              <video
                src={currentIntroItem.content}
                autoPlay
                muted
                loop={false}
                playsInline
                className="h-32 w-32 border-0 object-contain outline-none"
              />
            </div>
          ) : (
            <h1 className="px-6 text-center text-4xl font-medium text-black sm:text-5xl">
              {currentIntroItem.content}
            </h1>
          )}
        </div>
      </div>
    );
  }

  return (
    <main
      className={`min-h-screen bg-slate-50 text-black transition-opacity duration-700 ease-out ${
        isDashboardVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/leetguard-logo-black.svg"
              alt="LeetGuard"
              width={36}
              height={36}
              priority
            />
            <span className="text-2xl font-medium tracking-normal">
              LeetGuard
            </span>
          </Link>

          <div className="flex w-fit items-center gap-2">
            <span
              className={`h-3 w-3 rounded-full ${
                extensionSnapshot ? "bg-green-500" : "bg-slate-400"
              }`}
            />
            <span className="font-mono text-xs text-black">
              {extensionSnapshot ? displayData.sourceLabel : "Fallback mode"}
            </span>
          </div>
        </header>

        <section className="mb-6 rounded-lg border border-gray-400 bg-white p-6 shadow-md">
          <div className="mb-6">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`h-3 w-3 rounded-full ${
                    isGoalComplete ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <span className="font-mono text-xs text-black">
                  Status: Goal {isGoalComplete ? "finished" : "not finished"}
                </span>
              </div>

              <span className="font-mono text-xs text-black">
                UTC resets in {countdownText}
              </span>
            </div>

            <h1 className="text-4xl font-medium tracking-normal text-black sm:text-5xl">
              This site is blocked
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-black">
              Your focus gate is active. Solve today&apos;s LeetCode target and
              the distraction layer will unlock.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-black">
                Questions Completed
              </span>
              <span className="text-sm text-black">
                {isLoading
                  ? "Loading..."
                  : `${displayData.completedToday} / ${displayData.targetDaily}`}
              </span>
            </div>

            <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-green-600 transition-all duration-700 ease-out"
                style={{ width: `${isLoading ? 0 : progressPercent}%` }}
              />
            </div>

            <div className="-mx-6 flex flex-col gap-3 border-t border-gray-200 px-6 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-mono text-xs text-black">
                {isLoading
                  ? "Syncing your extension stats..."
                  : isGoalComplete
                  ? "Daily goal completed. Websites are unlocked."
                  : `Complete ${remainingQuestions} more questions to unlock websites.`}
              </p>
            </div>
          </div>
        </section>

        <div className="grid flex-1 gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <section
            className={`flex min-h-0 flex-col overflow-visible rounded-lg border border-gray-400 bg-white p-6 shadow-md ${
              controlCardHeight ? "lg:h-[var(--control-card-height)]" : ""
            }`}
            style={matchedCardHeightStyle}
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`h-3 w-3 rounded-full ${
                    extensionSnapshot ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
                <span className="font-mono text-xs text-black">
                  Extension: {extensionSnapshot ? "Connected" : "Not detected"}
                </span>
                {extensionSnapshot && (
                  <div ref={extensionInfoRef} className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setShowExtensionDetails((current) => !current)
                      }
                      className="inline-flex h-4 w-4 items-center justify-center text-blue-600 transition-colors hover:text-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                      aria-label="Extension details"
                    >
                      <Info className="h-3.5 w-3.5" />
                    </button>

                    {showExtensionDetails && (
                      <div className="absolute left-0 top-6 z-20 min-w-64 rounded-lg border border-gray-400 bg-white p-3 shadow-lg">
                        <div className="space-y-2 font-mono text-xs text-black">
                          <div>
                            <strong>Version:</strong>{" "}
                            {extensionDetails?.version ?? "unknown"}
                          </div>
                          <div>
                            <strong>Mode:</strong>{" "}
                            {extensionDetails?.isDeveloperMode
                              ? "Developer"
                              : "Production"}
                          </div>
                          {extensionDetails?.isDeveloperMode && (
                            <div className="text-xs text-orange-600">
                              Warning: Running in developer mode
                            </div>
                          )}
                          <div>
                            <strong>ID:</strong>{" "}
                            <code className="rounded bg-gray-100 px-1 text-xs">
                              {extensionDetails?.extensionId ?? "unknown"}
                            </code>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="blocked-sites-scroll max-h-72 min-h-0 flex-1 overflow-y-auto lg:max-h-none">
              <div className="flex flex-col gap-2">
                {displayData.blockedSites.map((site) => (
                  <div
                    key={site}
                    className="flex items-center justify-between rounded-sm border border-gray-200 bg-gray-50 px-4 py-2 font-dm-sans"
                  >
                    <span className="flex items-center break-all font-mono text-xs text-black">
                      <SiteIcon site={site} />
                      {site}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {displayData.isGuest && (
              <div className="mt-5 shrink-0 rounded-lg border border-gray-200 bg-white p-4">
                <p className="text-sm leading-relaxed text-black">
                  Want to customize? Sign in to add your own distracting sites
                  and sync across devices
                </p>
                <Link
                  href="/login?redirect=extension"
                  className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-lg bg-black px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                >
                  Login to Customize
                </Link>
              </div>
            )}
          </section>

          <section
            ref={controlCardRef}
            className="h-fit overflow-hidden rounded-lg border border-gray-400 bg-white shadow-md"
          >
            <div className="p-6">
              <h3 className="mb-2 text-xl font-medium text-black">
                Extension Control
              </h3>
              <p className="mb-4 text-sm leading-relaxed text-black">
                Control whether websites are blocked or unblocked.
              </p>
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-sm font-medium text-black">
                    Block/Unblock Websites
                  </span>
                  <p className="text-xs text-black">
                    Extension is{" "}
                    {displayData.extensionActive ? "active" : "disabled"}
                  </p>
                </div>
                <Link
                  href="/activity"
                  aria-label="Open activity page to change extension control"
                  className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                >
                  <ReadOnlySwitch enabled={displayData.extensionActive} />
                </Link>
              </div>
            </div>

            <div className="border-t border-gray-200 px-6 py-4">
              <p className="text-xs text-black">
                When enabled, websites will be blocked until you complete your
                daily goal.
              </p>
            </div>
          </section>
        </div>
      </div>
      <style jsx global>{`
        .blocked-sites-scroll {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }

        .blocked-sites-scroll::-webkit-scrollbar {
          display: block;
          width: 8px;
        }

        .blocked-sites-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .blocked-sites-scroll::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 999px;
        }
      `}</style>
    </main>
  );
}
