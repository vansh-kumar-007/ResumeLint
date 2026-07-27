import { AlertTriangle } from "lucide-react";
import { ScoreRing } from "./ScoreRing";

export function ScoreOverview({
  score,
  capReasons,
}: {
  score: number;
  capReasons: string[];
}) {
  return (
    <div className="bg-[var(--color-graphite)] border border-[var(--color-steel)] rounded-[var(--radius-sharp)] p-6 flex gap-6 items-center">
      <ScoreRing score={score} />
      <div className="flex-1">
        <h2 className="text-xs uppercase tracking-wider text-[var(--color-muted)] mb-2">
          Overall Analysis
        </h2>
        {capReasons.length === 0 ? (
          <p className="text-sm text-[var(--color-muted)]">
            No critical issues detected. See the breakdown below for detailed scoring.
          </p>
        ) : (
          <div className="space-y-1.5">
            {capReasons.map((reason, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-[var(--color-diagnostic-red)]">
                <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
                <span>{reason}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}