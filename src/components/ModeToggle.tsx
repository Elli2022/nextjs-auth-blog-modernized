import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Button from "@/components/ui/button";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      {theme === "dark" ? <Sun size="1.2rem" /> : <Moon size="1.2rem" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
