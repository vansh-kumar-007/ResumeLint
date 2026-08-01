"use client";

import { motion } from "framer-motion";
import { scoreColor } from "@/lib/score-color";

export function SectionScoreBar({ label, score, issues }: { label: string; score: number; issues?: string[] }) {
  return (
    <div className="py-3 border-b border-[var(--color-border)] last:border-b-0">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm">{label}</span>
        <span className="text-sm font-semibold" style={{ color: scoreColor(score) }}>{score}%</span>
      </div>
      <div className="h-2 bg-[var(--color-bg)] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: scoreColor(score) }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      {issues && issues.length > 0 && (
        <ul className="mt-2 space-y-0.5">
          {issues.map((issue, i) => (
            <li key={i} className="text-xs text-[var(--color-muted)]">· {issue}</li>
          ))}
        </ul>
      )}
    </div>
  );
}