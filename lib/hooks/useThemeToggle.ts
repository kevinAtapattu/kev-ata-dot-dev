import { useEffect, useState } from "react";

export function useThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return { theme, toggle: () => setTheme((prev) => (prev === "dark" ? "light" : "dark")) };
}
