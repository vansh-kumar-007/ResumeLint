import { scoreColor } from "@/lib/score-color";

export function SectionScoreBar({ label, score, issues }: { label: string; score: number; issues?: string[] }) {
  return (
    <div className="py-3 border-b-2 border-[var(--color-border)] last:border-b-0">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-bold">{label}</span>
        <span className="text-sm font-black font-mono">{score}</span>
      </div>
      <div className="h-2.5 bg-[var(--color-cream)] border-2 border-[var(--color-border)] rounded-full overflow-hidden">
        <div className="h-full" style={{ width: `${score}%`, backgroundColor: scoreColor(score) }} />
      </div>
      {issues && issues.length > 0 && (
        <ul className="mt-2 space-y-0.5">
          {issues.map((issue, i) => (
            <li key={i} className="text-xs text-[var(--color-muted)]">• {issue}</li>
          ))}
        </ul>
      )}
    </div>
  );
}