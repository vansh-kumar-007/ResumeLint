import { AlertTriangle } from "lucide-react";
import { ScoreRing } from "./ScoreRing";

function statusLabel(score: number): { text: string; className: string } {
  if (score >= 80) return { text: "Excellent · Well-optimized", className: "text-[var(--color-success)]" };
  if (score >= 50) return { text: "Needs improvement", className: "text-[var(--color-warning)]" };
  return { text: "Critical issues found", className: "text-[var(--color-danger)]" };
}

export function ScoreOverview({ score, capReasons }: { score: number; capReasons: string[] }) {
  const status = statusLabel(score);
  return (
    <div className="card p-6 flex flex-col items-center text-center gap-3">
      <ScoreRing score={score} />
      <p className={`text-sm font-medium ${status.className}`}>{status.text}</p>
      {capReasons.length > 0 && (
        <div className="w-full space-y-1.5 mt-2 text-left">
          {capReasons.map((reason, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-[var(--color-danger)]">
              <AlertTriangle size={13} className="mt-0.5 flex-shrink-0" />
              <span>{reason}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}