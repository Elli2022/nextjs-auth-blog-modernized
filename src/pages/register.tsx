export default function Register() {
  return (
    <section className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h1 className="text-2xl font-bold tracking-tight">Create account</h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        Register a new account to start creating posts.
      </p>

      <form className="mt-6 space-y-4">
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Username</span>
          <input
            type="text"
            placeholder="elli2022"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-blue-300 transition focus:ring dark:border-slate-700 dark:bg-slate-950"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Email</span>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-blue-300 transition focus:ring dark:border-slate-700 dark:bg-slate-950"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Password</span>
          <input
            type="password"
            placeholder="Choose a secure password"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-blue-300 transition focus:ring dark:border-slate-700 dark:bg-slate-950"
          />
        </label>

        <button
          type="button"
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Register
        </button>
      </form>
    </section>
  );
}
