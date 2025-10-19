import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import Provider from "./(Providers)/NextUiProvider";
import { Toaster } from "react-hot-toast";
import { config } from "@/lib/config";
import DemoModeBadge from "@/components/Layout/DemoModeBadge";
import { AuthProvider } from "@/providers/auth-provider";

// Demo banner removed - was too noisy

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const monserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "PromptPlace - AI Prompts Marketplace",
  description: "Buy and sell high-quality AI prompts. The premier marketplace for ChatGPT, Midjourney, DALL-E, and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // In demo mode, skip ClerkProvider entirely
  if (config.demo) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable} ${monserrat.variable}`}>
          <AuthProvider>
            <Provider>
              <Toaster position="top-center" reverseOrder={false} />
              {children}
              <DemoModeBadge />
            </Provider>
          </AuthProvider>
        </body>
      </html>
    );
  }

  // Production mode: use ClerkProvider
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable} ${monserrat.variable}`}>
          <Provider>
            <Toaster position="top-center" reverseOrder={false} />
            {children}
          </Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}
