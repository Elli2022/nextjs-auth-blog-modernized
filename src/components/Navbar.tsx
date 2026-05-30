// Exempel för components/Navbar.tsx
import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/register">Register</Link>
      <Link href="/signin">Sign In</Link>
      <Link href="/dashboard">Dashboard</Link>
    </nav>
  );
}
