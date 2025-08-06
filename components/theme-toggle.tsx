"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      onClick={() => {
        console.log("Current theme:", resolvedTheme);
        console.log("Toggling theme");
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
      }}
      className="relative p-2.5 rounded-xl bg-background/50 backdrop-blur-sm border border-border/50 text-foreground hover:text-primary hover:bg-accent/50 hover:border-primary/50 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 group"
      aria-label="Toggle theme"
    >
      <span className="relative flex items-center justify-center">
        <Sun className="h-5 w-5 transition-all duration-300 rotate-0 scale-100 dark:rotate-90 dark:scale-0 group-hover:rotate-12" />
        <Moon className="absolute h-5 w-5 transition-all duration-300 rotate-90 scale-0 dark:rotate-0 dark:scale-100 group-hover:dark:-rotate-12" />
      </span>
    </button>
  )
}
