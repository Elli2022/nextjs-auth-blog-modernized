export default function dashboard() {
  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Overview for your latest posts, account activity and quick actions.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Posts", value: "12" },
          { title: "Drafts", value: "3" },
          { title: "Views", value: "1.4k" },
          { title: "Comments", value: "48" },
        ].map((card) => (
          <article
            key={card.title}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {card.title}
            </p>
            <p className="mt-2 text-2xl font-semibold">{card.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
