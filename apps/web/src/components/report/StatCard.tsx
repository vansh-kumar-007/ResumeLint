"use client";

import { motion } from "framer-motion";
import { scoreColor } from "@/lib/score-color";

export function StatCard({ label, score, sublabel }: { label: string; score: number; sublabel?: string }) {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-sm p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-[var(--color-muted)]">{label}</span>
        <span className="text-sm font-bold" style={{ color: scoreColor(score) }}>{score}%</span>
      </div>
      <div className="h-1.5 bg-[var(--color-bg)] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: scoreColor(score) }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      </div>
      {sublabel && <p className="text-[10px] text-[var(--color-muted)] mt-1.5">{sublabel}</p>}
    </div>
  );
}