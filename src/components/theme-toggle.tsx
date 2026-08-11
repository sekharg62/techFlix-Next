"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useCustomTheme } from "@/context/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useCustomTheme();

  if (!mounted) {
    return <div className="w-10 h-10" />;
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors duration-200"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-neutral-100" />
      ) : (
        <Moon className="h-5 w-5 text-neutral-900" />
      )}
    </button>
  );
}
