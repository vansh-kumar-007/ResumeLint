import { scoreColor } from "@/lib/score-color";

export function SectionScoreBar({
  label,
  score,
  issues,
}: {
  label: string;
  score: number;
  issues?: string[];
}) {
  return (
    <div className="py-3 border-b border-[var(--color-steel)] last:border-b-0">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm">{label}</span>
        <span className="text-sm font-medium" style={{ color: scoreColor(score) }}>
          {score}
        </span>
      </div>
      <div className="h-1.5 bg-[var(--color-charcoal)] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${score}%`, backgroundColor: scoreColor(score) }}
        />
      </div>
      {issues && issues.length > 0 && (
        <ul className="mt-2 space-y-0.5">
          {issues.map((issue, i) => (
            <li key={i} className="text-xs text-[var(--color-muted)]">
              • {issue}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}