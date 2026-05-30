import React from "react";
import { useRouter } from "next/router";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/signin"); // Eller vilken sida du nu vill omdirigera till
  };

  return <button onClick={handleLogout}>Logga ut</button>;
};

export default LogoutButton;
