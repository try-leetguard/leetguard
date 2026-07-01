import "./globals.css";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "LeetGuard",
  description:
    "Your coding companion that rewards deep work and eliminates distractions.",
  icons: {
    icon: [
      {
        url: "/leetguard-logo.png",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/leetguard-logo.png",
        type: "image/png",
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
      <body className={`${dmSans.variable} font-dm-sans`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
