import Link from "next/link";
import { useEffect, useState } from "react";

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetch("/api/session")
      .then((res) => res.json())
      .then((data) => setIsLoggedIn(Boolean(data.authenticated)))
      .catch(() => setIsLoggedIn(false));
  }, []);

  return (
    <section className="space-y-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <span className="mb-4 inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
          Next.js fullstack exercise
        </span>
        <h1 className="text-4xl font-bold tracking-tight">
          Modern auth and blog starter
        </h1>
        <p className="mt-4 max-w-2xl text-slate-600 dark:text-slate-300">
          Register, sign in, and manage your own posts from a protected
          dashboard with persistent MongoDB storage.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Go to dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/register"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Create account
              </Link>
              <Link
                href="/signin"
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Sign in
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900/50 dark:bg-emerald-950/30">
        <h2 className="font-semibold text-emerald-900 dark:text-emerald-200">
          Sister project: Node.js microservice
        </h2>
        <p className="mt-2 text-sm text-emerald-800 dark:text-emerald-300">
          This app is the fullstack UI. The companion repo deploys a live Express
          API with Neon Postgres on Render.
        </p>
        <div className="mt-3 flex flex-wrap gap-3 text-sm font-semibold">
          <a
            href="https://nodejs-microservice-exercises.onrender.com/health"
            target="_blank"
            rel="noreferrer"
            className="text-emerald-700 underline underline-offset-2 dark:text-emerald-300"
          >
            Live API
          </a>
          <a
            href="https://github.com/Elli2022/nodejs-microservice-exercises"
            target="_blank"
            rel="noreferrer"
            className="text-emerald-700 underline underline-offset-2 dark:text-emerald-300"
          >
            GitHub
          </a>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          "Theme toggle",
          "Registration flow",
          "Sign-in flow",
          "Dashboard",
          "Route structure",
          "Reusable components",
        ].map((item) => (
          <article
            key={item}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <h2 className="font-semibold">{item}</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Updated for better readability and stronger visual hierarchy.
            </p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Home;
