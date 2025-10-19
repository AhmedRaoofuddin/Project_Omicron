'use client';

import React from "react";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { styles } from "@/utils/styles";
import { Target, Briefcase, Shield } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Header activeItem={1} user={null} isSellerExist={false} />
      
      <div className="w-full pt-24 pb-16">
        <div className="w-[90%] md:w-[80%] xl:w-[70%] mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className={`${styles.heading} mb-4`}>
              About <span className="text-[var(--accent-primary)] dark:text-[#64ff4c]">PromptPlace</span>
            </h1>
            <p className="text-[var(--text-secondary)] text-lg max-w-3xl mx-auto">
              The premier marketplace for buying and selling high-quality AI prompts
              for ChatGPT, Midjourney, DALL-E, and more.
            </p>
          </div>

          {/* Mission Section */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-[var(--accent-primary)] dark:text-[#64ff4c]">Our Mission</h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                PromptPlace empowers creators and businesses by connecting prompt engineers
                with users who need high-quality AI prompts. We believe in democratizing
                AI by making effective prompts accessible to everyone.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-[var(--accent-primary)] dark:text-[#64ff4c]">Why Choose Us</h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Every prompt on our platform is crafted by experienced prompt engineers,
                tested for quality, and optimized for results. We provide a secure marketplace
                where creativity meets opportunity.
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-[var(--card-bg)] dark:bg-gray-900/50 p-6 rounded-2xl border border-[var(--border-color)]">
              <div className="w-12 h-12 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-[var(--accent-primary)]" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[var(--text-primary)]">Quality Prompts</h3>
              <p className="text-[var(--text-secondary)]">
                All prompts are tested and verified to deliver exceptional results.
              </p>
            </div>
            <div className="bg-[var(--card-bg)] dark:bg-gray-900/50 p-6 rounded-2xl border border-[var(--border-color)]">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[var(--text-primary)]">For Creators</h3>
              <p className="text-[var(--text-secondary)]">
                Monetize your prompt engineering skills and reach a global audience.
              </p>
            </div>
            <div className="bg-[var(--card-bg)] dark:bg-gray-900/50 p-6 rounded-2xl border border-[var(--border-color)]">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[var(--text-primary)]">Secure Platform</h3>
              <p className="text-[var(--text-secondary)]">
                Safe transactions, instant delivery, and buyer protection.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-gradient-to-r from-[var(--accent-primary)]/10 to-transparent p-8 rounded-lg border border-[var(--border-color)]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-[var(--accent-primary)] dark:text-[#64ff4c]">10K+</div>
                <div className="text-[var(--text-secondary)] text-sm mt-1">Prompts</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[var(--accent-primary)] dark:text-[#64ff4c]">5K+</div>
                <div className="text-[var(--text-secondary)] text-sm mt-1">Creators</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[var(--accent-primary)] dark:text-[#64ff4c]">50K+</div>
                <div className="text-[var(--text-secondary)] text-sm mt-1">Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[var(--accent-primary)]">4.8★</div>
                <div className="text-[var(--text-secondary)] text-sm mt-1">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutPage;
