import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';

// Small mono-styled score badge for the list view - lighter weight than the
// full ScoreRing used on the analyze/detail pages, since a dense list of
// rows needs a compact indicator, not a large visual centerpiece.
function ScoreBadge({ score }) {
  const color = score >= 60 ? 'var(--color-scan-400)' : 'var(--color-flag-400)';
  return (
    <span
      className="rounded-full border px-2.5 py-1 font-mono text-xs font-medium"
      style={{ color, borderColor: color }}
    >
      {score}
    </span>
  );
}

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function History() {
  const [analyses, setAnalyses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchHistory() {
      try {
        const response = await api.get('/analyses/history');
        setAnalyses(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Could not load your analysis history.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchHistory();
  }, []);

  if (isLoading) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16 text-center">
        <p className="font-mono text-sm text-paper-500">Loading history...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16 text-center">
        <p className="rounded-md border border-flag-500/40 bg-flag-500/10 px-3 py-2 text-sm text-flag-400">
          {error}
        </p>
      </main>
    );
  }

  if (analyses.length === 0) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16 text-center">
        <p className="font-mono text-xs uppercase tracking-wider text-scan-400">History</p>
        <h1 className="mt-3 font-display text-2xl font-semibold text-paper-100">No analyses yet</h1>
        <p className="mt-3 text-paper-500">Run your first resume analysis to see it show up here.</p>
        <Link
          to="/analyze"
          className="mt-6 inline-block rounded-md bg-scan-500 px-5 py-2.5 text-sm font-medium text-ink-950 transition-colors hover:bg-scan-400"
        >
          Analyze a resume
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-display text-2xl font-semibold text-paper-100">History</h1>
      <p className="mt-2 text-sm text-paper-500">{analyses.length} past {analyses.length === 1 ? 'analysis' : 'analyses'}</p>

      <ul className="mt-8 flex flex-col gap-3">
        {analyses.map((item) => (
          <li key={item.id}>
            <Link
              to={`/history/${item.id}`}
              className="flex items-center justify-between rounded-lg border border-ink-700 bg-ink-900 px-5 py-4 transition-colors hover:border-scan-400"
            >
              <div className="min-w-0">
                <p className="truncate font-mono text-sm text-paper-100">{item.resume_filename}</p>
                <p className="mt-1 text-xs text-paper-500">{formatDate(item.created_at)}</p>
              </div>
              <ScoreBadge score={item.match_score} />
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
