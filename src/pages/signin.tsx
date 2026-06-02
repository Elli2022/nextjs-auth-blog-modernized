import { FormEvent, useState } from "react";
import { useRouter } from "next/router";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const payload = await response.json();
      if (!response.ok) {
        setStatus("error");
        setMessage(payload.error ?? "Sign in failed");
        return;
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", payload.token);
        localStorage.setItem("auth_user", JSON.stringify(payload.user));
        window.dispatchEvent(new Event("auth-changed"));
      }

      setStatus("success");
      setMessage(payload.message ?? "Sign in successful");
      setTimeout(() => {
        router.push("/dashboard");
      }, 700);
    } catch (error) {
      setStatus("error");
      setMessage("Unexpected error. Please try again.");
    }
  }

  return (
    <section className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h1 className="text-2xl font-bold tracking-tight">Sign in</h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        Access your dashboard and continue writing blog posts.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Email</span>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-blue-300 transition focus:ring dark:border-slate-700 dark:bg-slate-950"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Password</span>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-blue-300 transition focus:ring dark:border-slate-700 dark:bg-slate-950"
          />
        </label>

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          {status === "loading" ? "Signing in..." : "Sign in"}
        </button>
      </form>

      {message ? (
        <p
          className={`mt-4 text-sm ${
            status === "success"
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-rose-600 dark:text-rose-400"
          }`}
        >
          {message}
        </p>
      ) : null}
    </section>
  );
}
