"use client";

import { useEffect } from "react";
import NavbarLight from "@/components/NavbarLight";
import Footer from "@/components/Footer";
import Image from "next/image";
import { MarketingPageWrapper } from "@/components/MarketingPageWrapper";
import Link from "next/link";

export default function SoftwareEngineerPage() {
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
            <div>
              <Link
                href="/careers"
                className="inline-flex items-center text-neutral-600 hover:text-black mb-8 transition-colors"
              >
                ← Back to Careers
              </Link>

              <div className="mb-2">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-4xl font-semibold">Software Engineer</h1>
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
                  Remote • Full-time • Build and scale
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div className="relative pb-32 px-6">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-semibold mb-6">About the Role</h2>
              <p className="text-neutral-700 mb-6 leading-relaxed">
                We're looking for a passionate Software Engineer to join our
                small but growing team. You'll be working on LeetGuard, a
                browser extension that helps developers stay focused and
                productive while coding. This is a unique opportunity to build
                something that directly impacts the developer community.
              </p>

              <h3 className="text-xl font-semibold mb-4 mt-8">
                What You'll Do
              </h3>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-neutral-700">
                <li>
                  Develop and maintain our browser extension using
                  JavaScript/TypeScript
                </li>
                <li>
                  Build and scale our web application using Next.js and React
                </li>
                <li>Work on our backend API using Python and FastAPI</li>
                <li>
                  Collaborate with the team to design and implement new features
                </li>
                <li>
                  Write clean, maintainable code and contribute to code reviews
                </li>
                <li>Help improve our development processes and tooling</li>
              </ul>

              <h3 className="text-xl font-semibold mb-4 mt-8">
                What We're Looking For
              </h3>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-neutral-700">
                <li>
                  Strong proficiency in JavaScript/TypeScript and modern web
                  technologies
                </li>
                <li>
                  Experience with React, Next.js, or similar frontend frameworks
                </li>
                <li>Knowledge of Python and web development concepts</li>
                <li>
                  Experience with browser extension development (Chrome APIs)
                </li>
                <li>Understanding of web security and best practices</li>
                <li>
                  Ability to work independently and in a remote team environment
                </li>
                <li>Passion for developer tools and productivity</li>
              </ul>

              <h3 className="text-xl font-semibold mb-4 mt-8">Nice to Have</h3>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-neutral-700">
                <li>Experience with Chrome Extension Manifest V3</li>
                <li>Knowledge of database design and SQL</li>
                <li>Experience with authentication systems and OAuth</li>
                <li>Familiarity with LeetCode or similar coding platforms</li>
                <li>Open source contributions or personal projects</li>
              </ul>

              <h3 className="text-xl font-semibold mb-4 mt-8">What We Offer</h3>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-neutral-700">
                <li>Remote-first work environment with flexible hours</li>
                <li>
                  Opportunity to work on a product used by developers worldwide
                </li>
                <li>Small team where your contributions have real impact</li>
                <li>Learning and growth opportunities</li>
                <li>Competitive compensation</li>
              </ul>

              <div className="bg-gray-50 p-6 rounded-lg mt-8">
                <h3 className="text-xl font-semibold mb-4">How to Apply</h3>
                <p className="text-neutral-700 mb-4">
                  We're a small team of students passionate about building
                  innovative solutions. If you're excited about this role and
                  think you'd be a great fit, we'd love to hear from you!
                </p>
                <p className="text-neutral-700">
                  Please include your resume, a brief introduction about
                  yourself, and any relevant projects or experience that you
                  think would make you a great addition to our team.
                </p>
              </div>
            </div>

            {/* Apply Button */}
            <div className="mt-12 text-center">
              <a
                href="mailto:careers@leetguard.com?subject=Software Engineer Application - LeetGuard"
                className="inline-block bg-black text-white px-8 py-4 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200"
              >
                Apply for Software Engineer
              </a>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </MarketingPageWrapper>
  );
}
