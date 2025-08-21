"use client";

import Image from "next/image";
import * as React from "react";

type LogoItem = { name: string; logo: string };

type LogoCarouselProps = {
  logos: LogoItem[];
  speedSeconds?: number; // default slower
  heading?: string;
  subheading?: string;
};

export default function LogoCarousel({
  logos,
  speedSeconds = 22,
  heading = "Our Clients",
  subheading = "LeetGuard users have reported receiving offer letters from",
}: LogoCarouselProps) {
  // Intrinsic aspect ratios (width / height) derived from each SVG's width/height or viewBox
  // Fallback ratio if unknown
  const ratioByName: Record<string, number> = {
    amazon: 2500 / 752,
    google: 2500 / 752,
    apple: 2423.5 / 829,
    gusto: 2423.5 / 829,
    coinbase: 1101.64 / 196.79,
    netflix: 1024 / 276.742,
    nvidia: 946.4 / 179.7,
    meta: 948 / 191,
    palantir: 926.905 / 321.777,
    ramp: 26.485 / 6.324,
    uber: 281.9 / 75, // from palantir.svg style – Uber wordmark often ~3.75
    lyft: 199 / 141,
    doordash: 154.1365 / 17.862,
    adobe: 1891 / 493,
    datadog: 1891 / 493, // placeholder if needed
  };

  // Compute slot sizes: equal height, width from ratio, clamped to avoid extremes
  // Use CSS variables for responsiveness
  const baseHeightPx = 48; // ~h-12
  const minWidthPx = 120;
  const maxWidthPx = 220;

  // Apply slight downscale to specified brands
  const scaleByName: Record<string, number> = {
    apple: 0.6,
    doordash: 0.5,
    meta: 0.6,
    coinbase: 0.6,
    google: 0.8,
    uber: 0.5,
    ramp: 0.7,
    netflix: 0.7,
    nvidia: 0.6,
    amazon: 0.7,
    adobe: 0.7,
  };

  // Optional per-logo width clamps (overrides global min/max)
  const minWidthByName: Record<string, number> = {
    uber: 80,
  };
  const maxWidthByName: Record<string, number> = {};

  const Track = React.useCallback(
    () => (
      <div
        className="animate-slide-left-infinite inline-block w-max"
        style={{ animationDuration: `${speedSeconds}s` }}
      >
        {logos.map((c) => {
          const key = c.name.toLowerCase();
          const ratio = ratioByName[key] ?? 3.2;
          const rawWidth = Math.round(baseHeightPx * ratio);
          const scaled = Math.round(rawWidth * (scaleByName[key] ?? 1));
          const minW = minWidthByName[key] ?? minWidthPx;
          const maxW = maxWidthByName[key] ?? maxWidthPx;
          const computedWidth = Math.min(maxW, Math.max(minW, scaled));
          return (
            <div
              key={c.name}
              className="mr-20 inline-flex items-center justify-center"
              aria-label={c.name}
            >
              <div
                className="relative h-12 sm:h-14 md:h-12 lg:h-12"
                style={{ width: `${computedWidth}px` }}
              >
                <Image
                  src={c.logo}
                  alt={c.name}
                  fill
                  sizes="(max-width: 640px) 10rem, (max-width: 768px) 12rem, 14rem"
                  className="object-contain"
                  priority={false}
                />
              </div>
            </div>
          );
        })}
      </div>
    ),
    [logos, speedSeconds]
  );

  return (
    <section className="bg-white text-black pt-8 pb-4">
      <h2 className="text-center text-2xl mb-2 font-semibold leading-8 ">
        {heading}
      </h2>
      <p className="text-center text-lg font-normal leading-8 ">{subheading}</p>
      <div className="logos relative overflow-hidden whitespace-nowrap py-10 [mask-image:_linear-gradient(to_right,_transparent_0,_white_128px,white_calc(100%-128px),_transparent_100%)]">
        <Track />
        <Track />
      </div>
    </section>
  );
}
