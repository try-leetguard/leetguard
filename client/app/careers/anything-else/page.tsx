"use client";

import { useEffect } from "react";
import NavbarLight from "@/components/NavbarLight";
import Footer from "@/components/Footer";
import Image from "next/image";
import { MarketingPageWrapper } from "@/components/MarketingPageWrapper";
import Link from "next/link";

export default function AnythingElsePage() {
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
        <div className="relative pt-32 pb-16 px-6">
          <div className="container mx-auto px-4 max-w-4xl">
            <Link
              href="/careers"
              className="inline-flex items-center text-neutral-600 hover:text-black mb-8 transition-colors font-mono text-sm"
            >
              ← Back to Careers
            </Link>

            <div className="mb-2">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-normal text-black font-mono">Anything else</h1>
                <div className="flex items-center text-neutral-500 font-mono text-sm">
                  <Image
                    src="/usflag.svg"
                    alt="US Flag"
                    width={20}
                    height={20}
                    className="mr-2"
                  />
                  US only
                </div>
              </div>
              <div className="text-sm text-neutral-600 mb-2 font-mono">
                Remote • Contribute your ideas
              </div>
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div className="relative pb-32 px-6">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-xl font-normal mb-6 font-mono">About This Role</h2>
              <p className="text-neutral-700 mb-6 leading-relaxed font-mono text-sm">
                We believe that great ideas can come from anywhere, and we're
                always looking for passionate students who can bring unique
                perspectives and skills to our team. If you don't see a specific
                role that fits your background, but you're excited about what
                we're building at LeetGuard, we'd love to hear from you regardless!
              </p>

              <h3 className="text-lg font-normal mb-4 mt-8 font-mono">
                What We're Looking For
              </h3>
              <p className="text-neutral-700 mb-6 leading-relaxed font-mono text-sm">
                We're open to various roles and skill sets that could help us
                grow and improve LeetGuard. This includes:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-neutral-700 font-mono text-sm">
                <li>Product management and user experience design</li>
                <li>Marketing, growth, and community building</li>
                <li>Content creation and technical writing</li>
              </ul>

              <h3 className="text-lg font-normal mb-4 mt-8 font-mono">
                What You'll Bring
              </h3>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-neutral-700 font-mono text-sm">
                <li>Passion for developer tools and productivity</li>
                <li>Ability to work independently in a remote environment</li>
                <li>Out of the box thinking and creativity</li>
                <li>Willingness to learn and adapt</li>
              </ul>

              <h3 className="text-lg font-normal mb-4 mt-8 font-mono">What We Offer</h3>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-neutral-700 font-mono text-sm">
                <li>Remote-first work environment with flexible hours</li>
                <li>Small team where your contributions have real impact</li>
                <li>Learning and growth opportunities</li>
              </ul>

              <div className="bg-gray-50 p-6 rounded-lg mt-8 border border-gray-400">
                <h3 className="text-lg font-normal mb-4 font-mono">How to Apply</h3>
                <p className="text-neutral-700 mb-4 font-mono text-sm">
                  We're a small team of students passionate about building
                  innovative solutions. If you're excited about this role and
                  think you'd be a great fit, we'd love to hear from you!
                </p>
                <p className="text-neutral-700 mb-4 font-mono text-sm">
                  Please include your name, resume, and any relevant projects or experience that you
                  think would make you a great addition to our team.
                </p>
                <p className="text-neutral-700 font-mono text-sm">
                  Don't worry if your background doesn't fit a traditional role
                  - we're more interested in finding the right person who's
                  excited about what we're building!
                </p>
              </div>
            </div>

            {/* Apply Button */}
            <div className="mt-12 text-center">
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSfg0yXSpA9LvbdPWxy26_41pVep2-vDRHxf3vMvryE2RSsfFQ/viewform?usp=dialog"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-black text-white px-8 py-4 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200 font-mono text-sm"
              >
                Apply for General Position
              </a>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </MarketingPageWrapper>
  );
}
