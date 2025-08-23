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
              className="inline-flex items-center text-neutral-600 hover:text-black mb-8 transition-colors"
            >
              ← Back to Careers
            </Link>

            <div className="mb-2">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-4xl font-semibold">Anything else</h1>
                <div className="flex items-center text-neutral-500">
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
              <div className="text-lg text-neutral-600 mb-2">
                Remote • Contribute your ideas
              </div>
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div className="relative pb-32 px-6">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-semibold mb-6">About This Role</h2>
              <p className="text-neutral-700 mb-6 leading-relaxed">
                We believe that great ideas can come from anywhere, and we're
                always looking for passionate individuals who can bring unique
                perspectives and skills to our team. If you don't see a specific
                role that fits your background, but you're excited about what
                we're building at LeetGuard, we'd love to hear from you!
              </p>

              <h3 className="text-xl font-semibold mb-4 mt-8">
                What We're Looking For
              </h3>
              <p className="text-neutral-700 mb-6 leading-relaxed">
                We're open to various roles and skill sets that could help us
                grow and improve LeetGuard. This might include:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-neutral-700">
                <li>Product management and user experience design</li>
                <li>Marketing, growth, and community building</li>
                <li>Data analysis and user research</li>
                <li>Content creation and technical writing</li>
                <li>DevOps and infrastructure expertise</li>
                <li>Quality assurance and testing</li>
                <li>Customer support and success</li>
                <li>Business development and partnerships</li>
                <li>
                  Or something completely different that you think would be
                  valuable!
                </li>
              </ul>

              <h3 className="text-xl font-semibold mb-4 mt-8">
                What You'll Bring
              </h3>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-neutral-700">
                <li>Passion for developer tools and productivity</li>
                <li>Strong communication and collaboration skills</li>
                <li>Ability to work independently in a remote environment</li>
                <li>Creative problem-solving approach</li>
                <li>Willingness to learn and adapt</li>
                <li>
                  Understanding of the developer community and their needs
                </li>
              </ul>

              <h3 className="text-xl font-semibold mb-4 mt-8">What We Offer</h3>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-neutral-700">
                <li>Flexible remote work environment</li>
                <li>
                  Opportunity to shape your role and contribute to our growth
                </li>
                <li>Direct impact on a product used by developers worldwide</li>
                <li>Learning and professional development opportunities</li>
                <li>Collaborative team environment</li>
                <li>Competitive compensation</li>
              </ul>

              <div className="bg-gray-50 p-6 rounded-lg mt-8">
                <h3 className="text-xl font-semibold mb-4">How to Apply</h3>
                <p className="text-neutral-700 mb-4">
                  We're a small team of students passionate about building
                  innovative solutions. If you have a unique skill set or
                  perspective that you think could help us improve LeetGuard,
                  we'd love to hear from you!
                </p>
                <p className="text-neutral-700 mb-4">
                  Please tell us about yourself, your background, and how you
                  think you could contribute to our team. Include your resume
                  and any relevant projects or experience that showcase your
                  skills.
                </p>
                <p className="text-neutral-700">
                  Don't worry if your background doesn't fit a traditional role
                  - we're more interested in finding the right person who's
                  excited about what we're building!
                </p>
              </div>
            </div>

            {/* Apply Button */}
            <div className="mt-12 text-center">
              <a
                href="mailto:careers@leetguard.com?subject=General Application - LeetGuard"
                className="inline-block bg-black text-white px-8 py-4 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200"
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
