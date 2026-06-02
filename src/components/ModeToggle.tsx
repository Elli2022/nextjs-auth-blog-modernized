import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import React, { useState, useEffect } from "react";
import Button from "@/components/ui/button";

export default function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <Button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg transition hover:opacity-90 dark:bg-slate-100 dark:text-slate-900"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? <Sun size="1.2rem" /> : <Moon size="1.2rem" />}
      </Button>
    </div>
  );
}
