"use client";

import { MarketingPageWrapper } from "@/components/MarketingPageWrapper";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MarketingPageWrapper>{children}</MarketingPageWrapper>;
}
