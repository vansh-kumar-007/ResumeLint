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
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-sm p-5 h-full flex flex-col items-center justify-center text-center gap-2">
      <ScoreRing score={score} />
      <p className={`text-xs font-medium ${status.className}`}>{status.text}</p>
      {capReasons.length > 0 && (
        <div className="w-full space-y-1 mt-1 text-left">
          {capReasons.map((reason, i) => (
            <div key={i} className="flex items-start gap-1.5 text-[10px] text-[var(--color-danger)]">
              <AlertTriangle size={11} className="mt-0.5 flex-shrink-0" />
              <span>{reason}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}