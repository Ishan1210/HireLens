// Renders the match score as a circular "aperture" ring - ties visually to
// the logo mark and landing page hero. The ring fills proportionally to the
// score using stroke-dasharray/dashoffset (a standard SVG technique for
// progress rings - no charting library needed for a single value).
export default function ScoreRing({ score }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const filled = (score / 100) * circumference;

  // Color reflects how strong the match is - cyan for good matches,
  // amber for scores that need real work. Kept to two colors (not a
  // full gradient scale) to stay consistent with the two-accent system.
  const ringColor = score >= 60 ? 'var(--color-scan-400)' : 'var(--color-flag-400)';

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
        <circle cx="70" cy="70" r={radius} stroke="var(--color-ink-700)" strokeWidth="8" fill="none" />
        <circle
          cx="70"
          cy="70"
          r={radius}
          stroke={ringColor}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - filled}
          style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-mono text-3xl font-semibold text-paper-100">{score}</span>
        <span className="font-mono text-xs text-paper-500">/ 100</span>
      </div>
    </div>
  );
}
