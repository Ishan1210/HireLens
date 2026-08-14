import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client';
import ScoreRing from '../components/ScoreRing';
import ResultListCard from '../components/ResultListCard';

export default function AnalysisDetail() {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchAnalysis() {
      setIsLoading(true);
      setError('');
      try {
        const response = await api.get(`/analyses/${id}`);
        setAnalysis(response.data);
      } catch (err) {
        // A 404 here means either the id doesn't exist, or it belongs to
        // another user - the backend deliberately returns the same message
        // for both cases (see IDOR protection in getAnalysisById).
        setError(err.response?.data?.error || 'Could not load this analysis.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchAnalysis();
  }, [id]);

  if (isLoading) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16 text-center">
        <p className="font-mono text-sm text-paper-500">Loading analysis...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16 text-center">
        <p className="rounded-md border border-flag-500/40 bg-flag-500/10 px-3 py-2 text-sm text-flag-400 inline-block">
          {error}
        </p>
        <div className="mt-6">
          <Link to="/history" className="text-sm text-scan-400 hover:underline">
            ← Back to history
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link to="/history" className="text-sm text-paper-500 transition-colors hover:text-scan-400">
        ← Back to history
      </Link>

      <div className="mt-6 flex flex-col items-center text-center">
        <p className="font-mono text-xs uppercase tracking-wider text-paper-500">{analysis.resume_filename}</p>
        <div className="mt-6">
          <ScoreRing score={analysis.match_score} />
        </div>
        <p className="mt-4 text-xs text-paper-500">
          Analyzed on {new Date(analysis.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <ResultListCard variant="strength" items={analysis.strengths} />
        <ResultListCard variant="gap" items={analysis.gaps} />
        <ResultListCard variant="suggestion" items={analysis.suggestions} />
      </div>

      <div className="mt-8 rounded-lg border border-ink-700 bg-ink-900 p-5">
        <h3 className="font-mono text-xs uppercase tracking-wider text-paper-500">Job description</h3>
        <p className="mt-3 whitespace-pre-wrap text-sm text-paper-300">{analysis.job_description}</p>
      </div>
    </main>
  );
}
