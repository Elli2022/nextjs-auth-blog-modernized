// src/pages/index.tsx
import React from "react";
import { useTheme } from "next-themes";
import Button from "@/components/ui/button";

const Home = () => {
  const { theme, setTheme } = useTheme();

  function handleThemeChange() {
    // This will toggle the theme between 'light' and 'dark'.
    setTheme(theme === "dark" ? "light" : "dark");
  }

  return (
    <div>
      <h1>Welcome to My Next.js Project</h1>
      <Button label="Toggle Theme" onClick={handleThemeChange} />
    </div>
  );
};

export default Home;
