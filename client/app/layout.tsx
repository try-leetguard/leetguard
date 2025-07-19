import "./globals.css";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";

const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LeetGuard",
  description:
    "Your coding companion that rewards deep work and eliminates distractions.",
  icons: {
    icon: [
      {
        url: "/leetguard-logo-circle.svg",
        type: "image/svg+xml",
      },
    ],
    apple: [
      {
        url: "/leetguard-logo-circle.svg",
        type: "image/svg+xml",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={dmSans.className}>{children}</body>
    </html>
  );
}
