// Exempel för components/Navbar.tsx
//src/components/Navbar.tsx
import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white py-4">
      <div className="container mx-auto flex justify-between items-center">
        <span className="text-2xl font-bold"></span>
        <div className="space-x-4">
          <Link href="/">Home</Link>
          <Link href="/register">Register</Link>
          <Link href="/signin">Sign In</Link>
          <Link href="/dashboard">Dashboard</Link>
        </div>
      </div>
    </nav>
  );
}
