import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import Button from "@/components/ui/button";
import ModeToggle from "@/components/ModeToggle";

const Home = () => {
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Denna flagga säkerställer att temaväxlingen endast sker på klienten
    setIsMounted(true);
  }, []);

  function handleThemeChange() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  return (
    <div>
      <h1>Welcome to My Next.js Project</h1>
      <Button onClick={handleThemeChange}>
        {isMounted &&
          (theme === "dark" ? <Sun size="1.2rem" /> : <Moon size="1.2rem" />)}
      </Button>
    </div>
  );
};

export default Home;
