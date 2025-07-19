import Link from "next/link";
import NavbarLight from "@/components/NavbarLight";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white text-black">
      <NavbarLight />

      {/* Header */}
      <header className="border-b border-gray-200 pt-32">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="text-6xl font-semibold text-black mb-3">
            Privacy Policy
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
                  LeetGuard, Inc. ("LeetGuard," "we," "us," or "our") values your
                  privacy. This Privacy Policy describes how we collect, use, and
                  protect your information when you use our website located at
                  www.leetguard.com (the "Site") and our related services
                  (collectively, the "Services"). By accessing or using the
                  Services, you agree to the collection and use of information in
                  accordance with this policy.
                </p>
              </div>
            </section>

            {/* Section I */}
            <section>
              <h2 className="text-2xl font-semibold text-black mb-4">
                I. Information We Collect
              </h2>

              <h3 className="text-xl font-medium text-black mb-3">
                A. Personal Information
              </h3>
              <p className="text-black leading-relaxed mb-6">
                We may collect personal information you provide when you
                register, such as your name, email address, and payment
                information if applicable.
              </p>

              <h3 className="text-xl font-medium text-black mb-3">
                B. Usage Information
              </h3>
              <p className="text-black leading-relaxed mb-6">
                We automatically collect information about your interactions
                with the Service, including device information, browser type, IP
                address, log data, and usage patterns.
              </p>

              <h3 className="text-xl font-medium text-black mb-3">
                C. Cookies and Tracking Technologies
              </h3>
              <p className="text-black leading-relaxed">
                We use cookies and similar technologies to enhance your
                experience, analyze usage, and personalize content. You can
                manage cookie preferences through your browser settings.
              </p>
            </section>

            {/* Section II */}
            <section>
              <h2 className="text-2xl font-semibold text-black mb-4">
                II. How We Use Your Information
              </h2>
              <p className="text-black leading-relaxed mb-4">
                We use your information to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-black leading-relaxed ml-4">
                <li>Provide, maintain, and improve the Services</li>
                <li>
                  Communicate with you, including sending service-related
                  messages and updates
                </li>
                <li>Process payments and prevent fraud</li>
                <li>Analyze usage and performance metrics</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            {/* Section III */}
            <section>
              <h2 className="text-2xl font-semibold text-black mb-4">
                III. Information Sharing and Disclosure
              </h2>
              <p className="text-black leading-relaxed mb-4">
                We do not sell your personal information. We may share
                information with:
              </p>
              <ul className="list-disc list-inside space-y-2 text-black leading-relaxed ml-4">
                <li>
                  Service providers who help operate our Service (under strict
                  confidentiality)
                </li>
                <li>
                  Legal authorities if required by law or to protect rights and
                  safety
                </li>
                <li>Successors in the event of a merger or acquisition</li>
              </ul>
            </section>

            {/* Section IV */}
            <section>
              <h2 className="text-2xl font-semibold text-black mb-4">
                IV. Data Security
              </h2>
              <p className="text-black leading-relaxed">
                We implement reasonable administrative, technical, and physical
                safeguards designed to protect your information. However, no
                system is completely secure, and we cannot guarantee absolute
                security.
              </p>
            </section>

            {/* Section V */}
            <section>
              <h2 className="text-2xl font-semibold text-black mb-4">
                V. Your Rights and Choices
              </h2>
              <p className="text-black leading-relaxed mb-4">
                Depending on your jurisdiction, you may have rights including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-black leading-relaxed ml-4 mb-4">
                <li>
                  Accessing, correcting, or deleting your personal information
                </li>
                <li>Opting out of marketing communications</li>
                <li>Managing cookie preferences</li>
              </ul>
              <p className="text-black leading-relaxed">
                To exercise your rights, please contact us at{" "}
                <a
                  href="mailto:privacy@leetguard.com"
                  className="text-blue-600 hover:text-blue-700 transition-colors duration-200 underline"
                >
                  privacy@leetguard.com
                </a>
                .
              </p>
            </section>

            {/* Section VI */}
            <section>
              <h2 className="text-2xl font-semibold text-black mb-4">
                VI. Children's Privacy
              </h2>
              <p className="text-black leading-relaxed">
                Our Services are not directed to children under 13, and we do
                not knowingly collect personal information from children under
                13.
              </p>
            </section>

            {/* Section VII */}
            <section>
              <h2 className="text-2xl font-semibold text-black mb-4">
                VII. International Users
              </h2>
              <p className="text-black leading-relaxed">
                If you are located outside of [Your Jurisdiction], please be
                aware that your information may be transferred to and processed
                in [Your Jurisdiction], where data protection laws may differ.
              </p>
            </section>

            {/* Section VIII */}
            <section>
              <h2 className="text-2xl font-semibold text-black mb-4">
                VIII. Changes to This Privacy Policy
              </h2>
              <p className="text-black leading-relaxed">
                We may update this Privacy Policy from time to time. We will
                notify you of significant changes via the Site or email. Your
                continued use after updates means you accept the revised policy.
              </p>
            </section>

            {/* Section IX */}
            <section>
              <h2 className="text-2xl font-semibold text-black mb-4">
                IX. Contact Us
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
              <Link href="/privacy" className="text-black font-medium text-sm">
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-black hover:text-black transition-colors duration-200 text-sm"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
