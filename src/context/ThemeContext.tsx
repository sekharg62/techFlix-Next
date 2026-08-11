"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useTheme as useNextTheme } from "next-themes";

const ThemeContext = createContext<any>(null);

export function ThemeContextProvider({ children }: any) {
  const { theme, setTheme, systemTheme } = useNextTheme();
  const [mounted, setMounted] = useState<any>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const currentTheme = mounted ? theme : "dark";

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, setTheme, toggleTheme, systemTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useCustomTheme = () => {
  return useContext(ThemeContext);
};
