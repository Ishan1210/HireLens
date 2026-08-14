import { useState, useRef } from 'react';
import api from '../api/client';
import ScoreRing from '../components/ScoreRing';
import ResultListCard from '../components/ResultListCard';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // matches the backend's Multer limit

export default function Analyze() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  function validateAndSetFile(selectedFile) {
    setError('');
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf') {
      setError('Only PDF files are supported.');
      return;
    }
    if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
      setError('File is too large. Max size is 5MB.');
      return;
    }
    setFile(selectedFile);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    validateAndSetFile(e.dataTransfer.files?.[0]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!file) {
      setError('Please attach a resume PDF.');
      return;
    }
    if (!jobDescription.trim()) {
      setError('Please paste a job description.');
      return;
    }

    setIsSubmitting(true);
    setResult(null);

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDescription);

    try {
      // This call goes to Gemini on the backend and can take several
      // seconds - the loading state below keeps the user informed rather
      // than leaving the button looking frozen.
      const response = await api.post('/analyses/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleReset() {
    setFile(null);
    setJobDescription('');
    setResult(null);
    setError('');
  }

  // Results view - shown after a successful analysis
  if (result) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <div className="flex flex-col items-center text-center">
          <p className="font-mono text-xs uppercase tracking-wider text-paper-500">{result.resume_filename}</p>
          <div className="mt-6">
            <ScoreRing score={result.match_score} />
          </div>
          <h1 className="mt-6 font-display text-2xl font-semibold text-paper-100">Analysis complete</h1>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <ResultListCard variant="strength" items={result.strengths} />
          <ResultListCard variant="gap" items={result.gaps} />
          <ResultListCard variant="suggestion" items={result.suggestions} />
        </div>

        <div className="mt-10 flex justify-center">
          <button
            onClick={handleReset}
            className="rounded-md border border-ink-600 px-5 py-2.5 text-sm text-paper-300 transition-colors hover:border-scan-400 hover:text-scan-400"
          >
            Run another analysis
          </button>
        </div>
      </main>
    );
  }

  // Upload form view
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-display text-2xl font-semibold text-paper-100">Analyze a resume</h1>
      <p className="mt-2 text-sm text-paper-500">
        Upload a resume and paste the job description you're targeting.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
        <div>
          <label className="text-xs font-mono uppercase tracking-wider text-paper-500">Resume (PDF)</label>
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`mt-1.5 flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed px-6 py-8 text-center transition-colors ${
              isDragging ? 'border-scan-400 bg-scan-500/5' : 'border-ink-600 bg-ink-900'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => validateAndSetFile(e.target.files?.[0])}
            />
            {file ? (
              <p className="font-mono text-sm text-scan-400">{file.name}</p>
            ) : (
              <>
                <p className="text-sm text-paper-300">Drop your resume here, or click to browse</p>
                <p className="mt-1 text-xs text-paper-500">PDF only, up to 5MB</p>
              </>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="jobDescription" className="text-xs font-mono uppercase tracking-wider text-paper-500">
            Job description
          </label>
          <textarea
            id="jobDescription"
            rows={8}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job posting here..."
            className="mt-1.5 w-full resize-none rounded-md border border-ink-600 bg-ink-900 px-3 py-2.5 text-sm text-paper-100 outline-none transition-colors focus:border-scan-400"
          />
        </div>

        {error && (
          <p role="alert" className="rounded-md border border-flag-500/40 bg-flag-500/10 px-3 py-2 text-sm text-flag-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-scan-500 px-4 py-3 text-sm font-medium text-ink-950 transition-colors hover:bg-scan-400 disabled:opacity-50"
        >
          {isSubmitting ? 'Analyzing... this can take a few seconds' : 'Run analysis'}
        </button>
      </form>
    </main>
  );
}
