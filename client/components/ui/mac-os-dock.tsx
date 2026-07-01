"use client";

import { motion } from "framer-motion";
import * as React from "react";

import { cn } from "@/lib/utils";

export type DockApp = {
  id: string;
  name: string;
  icon: string;
  open?: boolean;
  separatorBefore?: boolean;
  imageClassName?: string;
};

export type MacOSDockProps = {
  apps: DockApp[];
  baseSize?: number;
  className?: string;
  onAppClick?: (appId: string) => void;
};

export function MacOSDock({
  apps,
  baseSize = 42,
  className,
  onAppClick,
}: MacOSDockProps) {
  return (
    <div
      className={cn(
        "relative inline-flex items-end overflow-hidden rounded-[22px] border border-white/60 bg-white/45 px-2.5 py-1.5 shadow-[0_24px_70px_rgba(15,23,42,0.24),0_6px_16px_rgba(15,23,42,0.12),inset_0_1px_0_rgba(255,255,255,0.90),inset_0_-1px_0_rgba(15,23,42,0.08)] backdrop-blur-2xl",
        className
      )}
    >
      <span className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/65 via-white/25 to-white/10" />
      <div className="relative flex items-end gap-1.5">
        {apps.map((app) => (
          <React.Fragment key={app.id}>
            {app.separatorBefore && (
              <span className="mx-0.5 mb-2 h-9 w-px rounded-full bg-white/60 shadow-[1px_0_0_rgba(15,23,42,0.10)]" />
            )}
            <DockItem
              app={app}
              baseSize={baseSize}
              onAppClick={onAppClick}
            />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function DockItem({
  app,
  baseSize,
  onAppClick,
}: {
  app: DockApp;
  baseSize: number;
  onAppClick?: (appId: string) => void;
}) {
  const isInteractive = Boolean(onAppClick);

  return (
    <div className="flex min-w-0 flex-col items-center gap-0.5">
      <motion.button
        style={{ height: baseSize, width: baseSize }}
        type="button"
        aria-label={app.name}
        aria-hidden={!isInteractive}
        tabIndex={isInteractive ? 0 : -1}
        className="relative flex shrink-0 cursor-default items-center justify-center rounded-[26%] outline-none transition-[filter] hover:drop-shadow-[0_10px_16px_rgba(15,23,42,0.20)] focus-visible:ring-2 focus-visible:ring-black/20"
        onClick={() => onAppClick?.(app.id)}
        whileTap={{ y: -5 }}
      >
        <img
          src={app.icon}
          alt=""
          draggable={false}
          className={cn(
            "h-full w-full select-none object-contain drop-shadow-[0_4px_8px_rgba(15,23,42,0.18)]",
            app.imageClassName
          )}
        />
      </motion.button>
      <span
        className={
          app.open
            ? "h-1 w-1 rounded-full bg-gray-700/80 shadow-[0_0_4px_rgba(255,255,255,0.85)]"
            : "h-1 w-1 rounded-full bg-transparent"
        }
      />
    </div>
  );
}
