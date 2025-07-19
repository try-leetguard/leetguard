import Link from "next/link";
import NavbarLight from "@/components/NavbarLight";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white text-black">
      <NavbarLight />

      {/* Header */}
      <header className="border-b border-gray-200 pt-32">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="text-6xl font-semibold text-black mb-3">
            Terms of Service
          </h1>
          <p className="text-lg text-black">Last Updated: June 26, 2025</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="prose prose-lg max-w-none">
          <div className="space-y-8">
            {/* Introduction */}
            <section>
              <div className="bg-[#F9F6F0] border border-black rounded-lg p-6 mb-6">
                <p className="text-black leading-relaxed">
                  LeetGuard, Inc., a corporation registered in [Your
                  Jurisdiction], with registered address at [Your Address]
                  ("LeetGuard," "we," "us," or "our"), provides its services (the
                  "Service") to you through its website located at
                  www.leetguard.com (the "Site") and related services
                  (collectively, the "Services"), subject to the following Terms
                  of Service ("Terms"). We may update these Terms from time to
                  time in accordance with the section titled "Modifications"
                  below. Your continued use of the Service constitutes your
                  acceptance of the updated Terms.
                </p>
              </div>
            </section>

            {/* Section I */}
            <section>
              <h2 className="text-2xl font-semibold text-black mb-4">
                I. Service and Modifications
              </h2>

              <h3 className="text-xl font-medium text-black mb-3">
                Services Description
              </h3>
              <p className="text-black leading-relaxed mb-6">
                LeetGuard provides software tools aimed at helping users improve
                focus and productivity by blocking distracting websites and
                applications during specified sessions. We offer both free and
                paid subscription plans with varying features.
              </p>

              <h3 className="text-xl font-medium text-black mb-3">
                Modifications
              </h3>
              <p className="text-black leading-relaxed">
                We reserve the right to modify or discontinue, temporarily or
                permanently, the Service or these Terms at any time, with or
                without notice. Material changes will be communicated via email
                or on the Site and will take effect at the next subscription
                renewal unless immediate changes are necessary to comply with
                law or protect security.
              </p>
            </section>

            {/* Section II */}
            <section>
              <h2 className="text-2xl font-semibold text-black mb-4">
                II. Registration
              </h2>

              <h3 className="text-xl font-medium text-black mb-3">
                Your Obligations
              </h3>
              <p className="text-black leading-relaxed mb-6">
                You may need to register for an account to access some features.
                You agree to provide accurate, current, and complete information
                and to update it promptly as necessary. You must be at least 13
                years old to use the Service, or older if required by your
                jurisdiction.
              </p>

              <h3 className="text-xl font-medium text-black mb-3">
                Account Security
              </h3>
              <p className="text-black leading-relaxed">
                You are responsible for safeguarding your password and account
                information and for all activities under your account. You agree
                to notify us immediately of any unauthorized use or security
                breaches.
              </p>
            </section>

            {/* Section III */}
            <section>
              <h2 className="text-2xl font-semibold text-black mb-4">
                III. User Content
              </h2>

              <h3 className="text-xl font-medium text-black mb-3">
                Responsibility for Content
              </h3>
              <p className="text-black leading-relaxed mb-6">
                You are solely responsible for any content you provide through
                the Service ("User Content"). You agree not to upload or share
                content that violates laws, infringes on intellectual property,
                contains malware, or is otherwise objectionable.
              </p>

              <h3 className="text-xl font-medium text-black mb-3">
                Rights Granted
              </h3>
              <p className="text-black leading-relaxed">
                By submitting User Content, you grant LeetGuard a non-exclusive,
                worldwide, royalty-free license to use, host, store, reproduce,
                and display such content solely to provide the Service.
              </p>
            </section>

            {/* Section IV */}
            <section>
              <h2 className="text-2xl font-semibold text-black mb-4">
                IV. Intellectual Property
              </h2>
              <p className="text-black leading-relaxed">
                All rights, title, and interest in and to the Service, including
                software, trademarks, logos, and content, are owned by LeetGuard
                or its licensors. You may not copy, modify, distribute, or
                create derivative works without prior written consent.
              </p>
            </section>

            {/* Section V */}
            <section>
              <h2 className="text-2xl font-semibold text-black mb-4">
                V. Termination
              </h2>
              <p className="text-black leading-relaxed">
                We may suspend or terminate your access immediately if you
                violate these Terms or for other reasons. Upon termination, your
                right to use the Service ends, but provisions intended to
                survive termination will remain in effect.
              </p>
            </section>

            {/* Section VI */}
            <section>
              <h2 className="text-2xl font-semibold text-black mb-4">
                VI. Disclaimer and Limitation of Liability
              </h2>
              <p className="text-black leading-relaxed">
                The Service is provided "as is" and "as available," without
                warranties of any kind. LeetGuard is not liable for any
                indirect, incidental, consequential, or punitive damages arising
                from your use of the Service.
              </p>
            </section>

            {/* Section VII */}
            <section>
              <h2 className="text-2xl font-semibold text-black mb-4">
                VII. Changes to Terms
              </h2>
              <p className="text-black leading-relaxed">
                We may update these Terms occasionally. We will notify you of
                material changes and post the updated Terms on our Site.
                Continued use after changes means you accept the new Terms.
              </p>
            </section>

            {/* Section VIII */}
            <section>
              <h2 className="text-2xl font-semibold text-black mb-4">
                VIII. Governing Law
              </h2>
              <p className="text-black leading-relaxed">
                These Terms are governed by the laws of [Your Jurisdiction],
                without regard to conflict of law principles.
              </p>
            </section>

            {/* Section IX */}
            <section>
              <h2 className="text-2xl font-semibold text-black mb-4">
                IX. Contact Information
              </h2>
              <p className="text-black leading-relaxed">
                For questions or concerns, contact us at{" "}
                <a
                  href="mailto:support@leetguard.com"
                  className="text-blue-600 hover:text-blue-700 transition-colors duration-200 underline"
                >
                  support@leetguard.com
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-16">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-black text-sm">
              © 2025 LeetGuard, Inc. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                href="/privacy"
                className="text-black hover:text-black transition-colors duration-200 text-sm"
              >
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-black font-medium text-sm">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
