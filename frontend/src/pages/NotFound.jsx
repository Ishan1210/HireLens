import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-6 text-center">
      <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden="true">
        <circle cx="36" cy="36" r="30" stroke="var(--color-ink-600)" strokeWidth="1.5" />
        <circle cx="36" cy="36" r="20" stroke="var(--color-flag-400)" strokeWidth="1.5" opacity="0.6" />
        <line x1="26" y1="26" x2="46" y2="46" stroke="var(--color-flag-400)" strokeWidth="2" strokeLinecap="round" />
        <line x1="46" y1="26" x2="26" y2="46" stroke="var(--color-flag-400)" strokeWidth="2" strokeLinecap="round" />
      </svg>

      <h1 className="mt-6 font-display text-2xl font-semibold text-paper-100">Page not found</h1>
      <p className="mt-2 text-sm text-paper-500">
        The page you're looking for doesn't exist or may have moved.
      </p>

      <Link
        to="/"
        className="mt-8 rounded-md bg-scan-500 px-5 py-2.5 text-sm font-medium text-ink-950 transition-colors hover:bg-scan-400"
      >
        Back to home
      </Link>
    </main>
  );
}
