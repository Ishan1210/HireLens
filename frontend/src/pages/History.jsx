export default function History() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16 text-center">
      <p className="font-mono text-xs uppercase tracking-wider text-scan-400">History</p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-paper-100">
        Past analyses coming next
      </h1>
      <p className="mt-3 text-paper-500">
        This page will list your past resume analyses, pulled from
        <code className="mx-1 rounded bg-ink-800 px-1.5 py-0.5 font-mono text-sm">GET /api/analyses/history</code>.
      </p>
    </main>
  );
}
