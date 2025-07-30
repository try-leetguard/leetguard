"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import Image from "next/image";
import NavbarLight from "@/components/NavbarLight";
import Footer from "@/components/Footer";
import { MarketingPageWrapper } from "@/components/MarketingPageWrapper";

export default function PricingPage() {
  useEffect(() => {
    // Set light mode for pricing page
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }, []);

  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const price = billing === "monthly" ? 0 : 0;
  const priceLabel = billing === "monthly" ? "$0/mo" : "$0/yr";

  return (
    <MarketingPageWrapper>
      <div className="relative min-h-screen bg-white text-black">
        <NavbarLight />

        {/* Hero Section */}
        <div className="relative min-h-screen flex flex-col items-center justify-center px-6">
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-7xl md:text-7xl font-medium mb-8 leading-none py-1 tracking-super-tight">
                <span className="text-black">Start for free.</span>
                <br />
                <span className="text-black">Cut the distractions.</span>
              </h1>

              <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto font-normal tracking-wide leading-relaxed">
                Install the extension and start focusing better today. LeetGuard
                is always free to start.
              </p>
            </div>
          </div>
        </div>

        <div className="relative -mt-48 pb-32 px-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center">
              {/* Billing Toggle */}
              <div className="mb-6 flex items-center">
                <div className="flex border border-black rounded-full overflow-hidden">
                  <button
                    className={`px-6 py-2 font-medium transition-colors duration-200 focus:outline-none ${
                      billing === "monthly"
                        ? "bg-black text-white"
                        : "bg-white text-black"
                    } rounded-l-full border-r border-black`}
                    onClick={() => setBilling("monthly")}
                  >
                    Monthly
                  </button>
                  <button
                    className={`px-6 py-2 font-medium transition-colors duration-200 focus:outline-none ${
                      billing === "yearly"
                        ? "bg-black text-white"
                        : "bg-white text-black"
                    } rounded-r-full`}
                    onClick={() => setBilling("yearly")}
                  >
                    Yearly
                  </button>
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  opacity: { duration: 0.6, delay: 0.4 },
                  y: { duration: 0.2, delay: 1.2 },
                }}
                className="w-full max-w-md mt-4"
              >
                <div className="bg-white border border-gray-200 p-8 transition-all duration-300">
                  <div className="text-center mb-8">
                    <h3 className="text-4xl font-medium text-black mb-2">
                      Free
                    </h3>
                    <div className="text-4xl font-medium text-black">
                      {priceLabel}
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-start space-x-3">
                      <Check
                        className="w-5 h-5 text-black mt-0.5 flex-shrink-0"
                        strokeWidth={4}
                      />
                      <span className="text-black font-normal">
                        Distraction blocker for coding sessions
                      </span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Check
                        className="w-5 h-5 text-black mt-0.5 flex-shrink-0"
                        strokeWidth={4}
                      />
                      <span className="text-black font-normal">
                        Track problems solved & time spent
                      </span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Check
                        className="w-5 h-5 text-black mt-0.5 flex-shrink-0"
                        strokeWidth={4}
                      />
                      <span className="text-black font-normal">
                        Daily streak & focus mode
                      </span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Check
                        className="w-5 h-5 text-black mt-0.5 flex-shrink-0"
                        strokeWidth={4}
                      />
                      <span className="text-black font-normal">
                        Works offline, data stays on your device
                      </span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Check
                        className="w-5 h-5 text-black mt-0.5 flex-shrink-0"
                        strokeWidth={4}
                      />
                      <span className="text-black font-normal">
                        Chrome & Edge support
                      </span>
                    </div>
                  </div>

                  <button className="w-full inline-flex items-center justify-center px-8 py-4 h-14 rounded-lg bg-white text-black text-base font-medium border border-black transition-all duration-200 relative hover:shadow-md">
                    <span>Install now</span>
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </MarketingPageWrapper>
  );
}
