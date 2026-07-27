import type { BulletAnalysis } from "@/types/analysis";
import { scoreColor } from "@/lib/score-color";
import { CheckCircle2, XCircle } from "lucide-react";

export function BulletList({ bullets }: { bullets: BulletAnalysis[] }) {
  return (
    <div className="bg-[var(--color-graphite)] border border-[var(--color-steel)] rounded-[var(--radius-sharp)] p-6">
      <h2 className="text-sm uppercase tracking-wide text-[var(--color-muted)] mb-4">
        Bullet-by-Bullet Analysis
      </h2>
      <div className="space-y-4">
        {bullets.map((bullet, i) => (
          <div key={i} className="border-l-2 pl-4" style={{ borderColor: scoreColor(bullet.score) }}>
            <p className="text-sm">{bullet.text}</p>
            <div className="flex gap-3 mt-1.5 text-xs text-[var(--color-muted)]">
              <span style={{ color: scoreColor(bullet.score) }} className="font-[var(--font-mono)]">
                {bullet.score}/100
              </span>
              <span className="flex items-center gap-1">
                {bullet.has_action_verb ? (
                  <CheckCircle2 size={13} className="text-[var(--color-diagnostic-green)]" />
                ) : (
                  <XCircle size={13} className="text-[var(--color-diagnostic-red)]" />
                )}
                action verb
              </span>
              <span className="flex items-center gap-1">
                {bullet.has_metric ? (
                  <CheckCircle2 size={13} className="text-[var(--color-diagnostic-green)]" />
                ) : (
                  <XCircle size={13} className="text-[var(--color-diagnostic-red)]" />
                )}
                metric
              </span>
            </div>
            {bullet.issues.length > 0 && (
              <ul className="mt-1">
                {bullet.issues.map((issue, j) => (
                  <li key={j} className="text-xs text-[var(--color-muted)]">
                    • {issue}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}