import { Link } from 'react-router-dom';

function ApertureHero() {
  // Larger version of the aperture mark, used as the hero's focal signature.
  // Three concentric rings suggest a lens focusing in on a target - visually
  // ties to the "matchScore" ring that will appear on the results page.
  return (
    <svg width="180" height="180" viewBox="0 0 180 180" fill="none" className="mx-auto" aria-hidden="true">
      <circle cx="90" cy="90" r="78" stroke="var(--color-ink-600)" strokeWidth="1" />
      <circle cx="90" cy="90" r="60" stroke="var(--color-scan-500)" strokeWidth="1.5" opacity="0.5" />
      <circle
        cx="90"
        cy="90"
        r="42"
        stroke="var(--color-scan-400)"
        strokeWidth="2"
        strokeDasharray="264"
        strokeDashoffset="62"
        strokeLinecap="round"
        transform="rotate(-90 90 90)"
      />
      <circle cx="90" cy="90" r="6" fill="var(--color-scan-400)" />
    </svg>
  );
}

export default function Landing() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-24 text-center">
      <ApertureHero />

      <h1 className="mt-10 font-display text-4xl font-semibold tracking-tight text-paper-100 sm:text-5xl">
        See your resume the way an ATS does.
      </h1>

      <p className="mx-auto mt-5 max-w-xl text-lg text-paper-500">
        Upload a resume and a job description. HireLens scores the match,
        flags what's missing, and tells you exactly what to fix — in seconds.
      </p>

      <div className="mt-10 flex items-center justify-center gap-4">
        <Link
          to="/signup"
          className="rounded-md bg-scan-500 px-6 py-3 text-sm font-medium text-ink-950 transition-colors hover:bg-scan-400"
        >
          Get started
        </Link>
        <Link
          to="/login"
          className="rounded-md border border-ink-600 px-6 py-3 text-sm font-medium text-paper-300 transition-colors hover:border-scan-400 hover:text-scan-400"
        >
          Log in
        </Link>
      </div>

      <dl className="mx-auto mt-24 grid max-w-2xl grid-cols-1 gap-8 text-left sm:grid-cols-3">
        <div className="border-t border-ink-700 pt-4">
          <dt className="font-mono text-xs uppercase tracking-wider text-scan-400">Step 1</dt>
          <dd className="mt-2 text-sm text-paper-300">Upload your resume as a PDF.</dd>
        </div>
        <div className="border-t border-ink-700 pt-4">
          <dt className="font-mono text-xs uppercase tracking-wider text-scan-400">Step 2</dt>
          <dd className="mt-2 text-sm text-paper-300">Paste the job description you're targeting.</dd>
        </div>
        <div className="border-t border-ink-700 pt-4">
          <dt className="font-mono text-xs uppercase tracking-wider text-scan-400">Step 3</dt>
          <dd className="mt-2 text-sm text-paper-300">Get a match score, gaps, and fixes — powered by Gemini.</dd>
        </div>
      </dl>
    </main>
  );
}
