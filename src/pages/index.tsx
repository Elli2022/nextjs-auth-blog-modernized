const Home = () => {
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
          This project includes auth flows, theme toggle, and a basic dashboard
          page structure. It is now updated with a cleaner, portfolio-ready UI.
        </p>
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
