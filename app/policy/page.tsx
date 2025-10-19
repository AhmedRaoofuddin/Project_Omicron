'use client';

import React from "react";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { styles } from "@/utils/styles";

const PolicyPage = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Header activeItem={5} user={null} isSellerExist={false} />
      
      <div className="w-full pt-24 pb-16">
        <div className="w-[90%] md:w-[80%] xl:w-[70%] mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className={`${styles.heading} mb-4`}>
              Privacy <span className="text-[var(--accent-primary)] dark:text-[#64ff4c]">Policy</span>
            </h1>
            <p className="text-[var(--text-secondary)]">Last updated: October 2024</p>
          </div>

          {/* Content */}
          <div className="prose prose-invert dark:prose-invert max-w-none space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[var(--accent-primary)] dark:text-[#64ff4c]">1. Introduction</h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Welcome to PromptPlace. We respect your privacy and are committed to protecting your personal data. 
                This privacy policy explains how we collect, use, and safeguard your information when you use our marketplace.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[var(--accent-primary)] dark:text-[#64ff4c]">2. Information We Collect</h2>
              <div className="space-y-4 text-[var(--text-secondary)]">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Account Information</h3>
                  <p>When you create an account, we collect your name, email address, and payment information.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Usage Data</h3>
                  <p>We automatically collect information about how you interact with our platform, including browsing history and purchase patterns.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Seller Information</h3>
                  <p>If you create a shop, we collect additional business information to facilitate transactions and payouts.</p>
                </div>
              </div>
            </section>

            {/* How We Use Your Data */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[var(--accent-primary)] dark:text-[#64ff4c]">3. How We Use Your Data</h2>
              <ul className="list-disc list-inside space-y-2 text-[var(--text-secondary)]">
                <li>To provide and maintain our service</li>
                <li>To process your transactions and send notifications</li>
                <li>To improve and personalize your experience</li>
                <li>To communicate with you about updates and offers</li>
                <li>To detect and prevent fraud</li>
              </ul>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[var(--accent-primary)] dark:text-[#64ff4c]">4. Data Security</h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                We implement industry-standard security measures to protect your data, including encryption, 
                secure servers, and regular security audits. However, no method of transmission over the internet 
                is 100% secure.
              </p>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[var(--accent-primary)] dark:text-[#64ff4c]">5. Your Rights</h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-3">You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 text-[var(--text-secondary)]">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to data processing</li>
                <li>Data portability</li>
              </ul>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[var(--accent-primary)] dark:text-[#64ff4c]">6. Cookies</h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                We use cookies and similar technologies to enhance your experience, analyze usage, and deliver 
                personalized content. You can control cookies through your browser settings.
              </p>
            </section>

            {/* Third-Party Services */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[var(--accent-primary)] dark:text-[#64ff4c]">7. Third-Party Services</h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                We may share your data with trusted third-party services for payment processing, analytics, 
                and customer support. These partners are bound by confidentiality agreements.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[var(--accent-primary)] dark:text-[#64ff4c]">8. Contact Us</h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                If you have questions about this privacy policy or your data, please contact us at{' '}
                <a href="mailto:privacy@promptplace.com" className="text-[var(--accent-primary)] dark:text-[#64ff4c] hover:underline font-medium">
                  privacy@promptplace.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PolicyPage;
