import type { BulletAnalysis } from "@/types/analysis";
import { scoreColor } from "@/lib/score-color";
import { CheckCircle2, XCircle } from "lucide-react";

export function BulletList({ bullets }: { bullets: BulletAnalysis[] }) {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm p-6">
      <h2 className="text-sm font-semibold mb-4">Bullet-by-Bullet Analysis</h2>
      <div className="space-y-3">
        {bullets.map((bullet, i) => (
          <div
            key={i}
            className="rounded-xl border border-[var(--color-border)] p-4"
            style={{ borderLeftColor: scoreColor(bullet.score), borderLeftWidth: 3 }}
          >
            <p className="text-sm">{bullet.text}</p>
            <div className="flex gap-3 mt-2 text-xs text-[var(--color-muted)]">
              <span className="font-semibold" style={{ color: scoreColor(bullet.score) }}>{bullet.score}/100</span>
              <span className="flex items-center gap-1">
                {bullet.has_action_verb ? <CheckCircle2 size={13} className="text-[var(--color-success)]" /> : <XCircle size={13} className="text-[var(--color-danger)]" />}
                action verb
              </span>
              <span className="flex items-center gap-1">
                {bullet.has_metric ? <CheckCircle2 size={13} className="text-[var(--color-success)]" /> : <XCircle size={13} className="text-[var(--color-danger)]" />}
                metric
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}