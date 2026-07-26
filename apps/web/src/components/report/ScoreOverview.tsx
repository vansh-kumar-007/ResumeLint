import { scoreColor } from "@/lib/score-color";

export function ScoreOverview({
  score,
  capReasons,
}: {
  score: number;
  capReasons: string[];
}) {
  return (
    <div className="bg-[var(--color-graphite)] border border-[var(--color-steel)] rounded-[var(--radius-sharp)] p-6">
      <div className="flex items-baseline gap-3">
        <span
          className="text-5xl font-semibold"
          style={{ color: scoreColor(score) }}
        >
          {score}
        </span>
        <span className="text-[var(--color-muted)] text-lg">/ 100</span>
      </div>
      {capReasons.length > 0 && (
        <div className="mt-4 space-y-1">
          {capReasons.map((reason, i) => (
            <p key={i} className="text-sm text-[var(--color-diagnostic-red)]">
              ⚠ {reason}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}