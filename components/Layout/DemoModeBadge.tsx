"use client";

import { config } from "@/lib/config";

export default function DemoModeBadge() {
  // Only show in actual demo mode (can be toggled off via env)
  if (!config.demo) return null;
  
  return (
    <div className="fixed bottom-4 right-4 bg-yellow-400/90 text-black px-3 py-1.5 rounded-full shadow-lg z-50 font-medium text-xs flex items-center gap-1.5 hover:bg-yellow-400 transition-colors">
      <span className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />
      <span>Demo Mode</span>
    </div>
  );
}

