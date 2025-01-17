"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();
  return (
    <div className="flex justify-end p-4">
      <button
        size="icon"
        onClick={() => {
          theme === "dark" ? setTheme("light") : setTheme("dark");
        }}
      >
        <SunIcon className="size-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <MoonIcon className="absolute size-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </button>
    </div>
  );
}
