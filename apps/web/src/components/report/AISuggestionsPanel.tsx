"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, ChevronDown } from "lucide-react";
import type { SuggestionsResult } from "@/types/suggestions";

export function AISuggestionsPanel({ suggestions }: { suggestions: SuggestionsResult }) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  if (!suggestions.ai_available) {
    return (
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-sm p-5">
        <h2 className="text-sm font-semibold mb-2 flex items-center gap-2">
          <Sparkles size={15} className="text-[var(--color-indigo)]" />
          AI Suggestions
        </h2>
        <p className="text-xs text-[var(--color-muted)]">{suggestions.message}</p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-sm p-5 sticky top-6">
      <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
        <Sparkles size={15} className="text-[var(--color-indigo)]" />
        AI Suggestions
      </h2>

      {suggestions.score_explanation && (
        <div className="bg-[var(--color-indigo-soft)] rounded-lg p-3 mb-3">
          <p className="text-xs leading-relaxed">{suggestions.score_explanation}</p>
        </div>
      )}

      <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
        {suggestions.bullet_rewrites.map((rewrite, i) => {
          const isOpen = expandedIndex === i;
          return (
            <div key={i} className="border border-[var(--color-border)] rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedIndex(isOpen ? null : i)}
                className="w-full flex items-center justify-between px-3 py-2.5 text-left text-xs font-medium hover:bg-[var(--color-bg)] transition-colors"
              >
                <span className="truncate pr-2">Rewrite #{i + 1}</span>
                <ChevronDown
                  size={13}
                  className={`flex-shrink-0 transition-transform text-[var(--color-muted)] ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 pb-3 space-y-2">
                      <div>
                        <span
                          className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full text-[var(--color-danger)]"
                          style={{ backgroundColor: "var(--color-danger-soft)" }}
                        >
                          Original
                        </span>
                        <p className="text-xs text-[var(--color-muted)] mt-1 leading-snug">{rewrite.original}</p>
                      </div>
                      <div>
                        <span
                          className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full text-[var(--color-success)]"
                          style={{ backgroundColor: "var(--color-success-soft)" }}
                        >
                          Suggested
                        </span>
                        <p className="text-xs mt-1 leading-snug">{rewrite.suggested ?? "Unavailable"}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}