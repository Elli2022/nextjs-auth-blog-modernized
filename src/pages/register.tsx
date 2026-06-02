import { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import type { GetServerSideProps } from "next";
import FormAlert from "@/components/FormAlert";
import { guestRedirectIfSession } from "@/lib/session";

export default function Register() {
  const router = useRouter();
  const [username, setUsername] = useState("");
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
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const payload = await response.json();

      if (!response.ok) {
        setStatus("error");
        setMessage(payload.error ?? "Registration failed");
        return;
      }

      setStatus("success");
      setMessage("Account created — redirecting to sign in...");
      setUsername("");
      setEmail("");
      setPassword("");
      setTimeout(() => router.push("/signin"), 900);
    } catch {
      setStatus("error");
      setMessage("Unexpected error. Please try again.");
    }
  }

  return (
    <section className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h1 className="text-2xl font-bold tracking-tight">Create account</h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        Register a new account to start creating posts.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Username</span>
          <input
            type="text"
            placeholder="elli2022"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-blue-300 transition focus:ring dark:border-slate-700 dark:bg-slate-950"
            required
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Email</span>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-blue-300 transition focus:ring dark:border-slate-700 dark:bg-slate-950"
            required
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Password</span>
          <input
            type="password"
            placeholder="Choose a secure password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-blue-300 transition focus:ring dark:border-slate-700 dark:bg-slate-950"
            required
          />
        </label>

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {status === "loading" ? "Registering..." : "Register"}
        </button>
      </form>

      {message ? (
        <FormAlert
          message={message}
          variant={status === "success" ? "success" : "error"}
        />
      ) : null}
    </section>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const redirect = guestRedirectIfSession(req);
  if (redirect) return redirect;
  return { props: {} };
};
