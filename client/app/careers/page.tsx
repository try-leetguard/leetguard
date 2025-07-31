"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import NavbarLight from "@/components/NavbarLight";
import Footer from "@/components/Footer";
import Image from "next/image";
import { MarketingPageWrapper } from "@/components/MarketingPageWrapper";

export default function CareersPage() {
  useEffect(() => {
    // Set light mode for careers page
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }, []);

  return (
    <MarketingPageWrapper>
      <div className="relative min-h-screen bg-white text-black">
        <NavbarLight />

        {/* Hero Section */}
        <div className="relative min-h-screen flex flex-col items-center justify-center px-6">
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-7xl md:text-7xl font-medium mb-8 leading-none py-1 tracking-super-tight">
                <span className="text-black">Join the team.</span>
                <br />
                <span className="text-black">Help us create solutions.</span>
              </h1>

              <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto font-normal tracking-wide leading-relaxed">
                We're a small team of students who are passionate about building
                innovative solutions for the community.
              </p>
            </div>
          </div>
        </div>

        {/* Careers Section */}
        <div className="relative pb-32 px-6 -mt-40">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Engineering Section */}
              <div>
                <h2 className="text-2xl font-semibold mb-6">Engineering</h2>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="bg-white border border-gray-200 p-8 transition-all duration-300 shadow-sm hover:shadow-lg hover:scale-[1.025] cursor-pointer"
                >
                  <div className="mb-2 text-lg font-medium">
                    Software Engineer
                  </div>
                  <div className="flex items-center text-neutral-500 mb-2">
                    <Image
                      src="/usflag.svg"
                      alt="US Flag"
                      width={20}
                      height={20}
                      className="mr-2 inline-block align-middle"
                    />
                    US only
                  </div>
                  <div className="text-sm text-neutral-500">
                    Remote • Scale and build
                  </div>
                </motion.div>
              </div>
              {/* Other Section */}
              <div>
                <h2 className="text-2xl font-semibold mb-6">Other</h2>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="bg-white border border-gray-200 p-8 transition-all duration-300 shadow-sm hover:shadow-lg hover:scale-[1.025] cursor-pointer"
                >
                  <div className="mb-2 text-lg font-medium">Anything else</div>
                  <div className="flex items-center text-neutral-500 mb-2">
                    <Image
                      src="/usflag.svg"
                      alt="US Flag"
                      width={20}
                      height={20}
                      className="mr-2 inline-block align-middle"
                    />
                    US only
                  </div>
                  <div className="text-sm text-neutral-500">
                    Remote • Contribute your ideas
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </MarketingPageWrapper>
  );
}
