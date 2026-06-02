import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const syncAuthState = () => {
      if (typeof window === "undefined") return;
      const token = localStorage.getItem("auth_token");
      setIsLoggedIn(Boolean(token));
    };

    syncAuthState();
    window.addEventListener("storage", syncAuthState);
    window.addEventListener("auth-changed", syncAuthState);
    return () => {
      window.removeEventListener("storage", syncAuthState);
      window.removeEventListener("auth-changed", syncAuthState);
    };
  }, []);

  const links = useMemo(
    () =>
      isLoggedIn
        ? [
            { href: "/", label: "Home" },
            { href: "/dashboard", label: "Dashboard" },
          ]
        : [
            { href: "/", label: "Home" },
            { href: "/register", label: "Register" },
            { href: "/signin", label: "Sign in" },
          ],
    [isLoggedIn]
  );

  function handleLogout() {
    if (typeof window === "undefined") return;
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    window.dispatchEvent(new Event("auth-changed"));
  }

  return (
    <nav className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          My Next.js Project
        </Link>
        <ul className="flex items-center gap-1 sm:gap-2">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                {link.label}
              </Link>
            </li>
          ))}
          {isLoggedIn ? (
            <li>
              <button
                onClick={handleLogout}
                className="rounded-md px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 hover:text-rose-700 dark:text-rose-300 dark:hover:bg-rose-900/20"
              >
                Log out
              </button>
            </li>
          ) : null}
        </ul>
      </div>
    </nav>
  );
}
