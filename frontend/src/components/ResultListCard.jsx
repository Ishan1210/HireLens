// Small reusable block for the three result categories. Accent color and
// icon glyph differ per category so the three lists are visually distinct
// at a glance even before reading the label.
const VARIANTS = {
  strength: { label: 'Strengths', color: 'var(--color-scan-400)', glyph: '+' },
  gap: { label: 'Gaps', color: 'var(--color-flag-400)', glyph: '−' },
  suggestion: { label: 'Suggestions', color: 'var(--color-paper-300)', glyph: '→' },
};

export default function ResultListCard({ variant, items }) {
  const { label, color, glyph } = VARIANTS[variant];

  return (
    <div className="rounded-lg border border-ink-700 bg-ink-900 p-5">
      <h3 className="font-mono text-xs uppercase tracking-wider" style={{ color }}>
        {label}
      </h3>
      <ul className="mt-3 flex flex-col gap-2.5">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2.5 text-sm text-paper-300">
            <span className="mt-0.5 font-mono shrink-0" style={{ color }} aria-hidden="true">
              {glyph}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
