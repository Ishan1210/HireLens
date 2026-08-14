// A pulsing placeholder block used while real content is loading. Using a
// shared component (rather than one-off divs per page) keeps the pulse
// timing and color consistent everywhere it appears. Border radius is left
// entirely to the caller's className - hardcoding a default here caused a
// real bug where "rounded-full" callers still rendered as squares, since
// Tailwind's generated stylesheet order (not JSX order) decides which
// same-specificity utility class wins.
export default function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-ink-700 ${className}`} />;
}
