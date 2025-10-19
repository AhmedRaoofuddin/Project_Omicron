"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-full bg-white/10 animate-pulse" />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 bg-white/10 hover:bg-white/20 dark:bg-white/10 dark:hover:bg-white/20"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-[#64ff4c] transition-transform duration-300" />
      ) : (
        <Moon className="w-5 h-5 text-[#004b3e] transition-transform duration-300" />
      )}
    </button>
  );
};

export default ThemeToggle;

