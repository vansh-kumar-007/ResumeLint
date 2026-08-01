"use client";

import { useState } from "react";
import { Sparkles, ChevronRight } from "lucide-react";
import type { SuggestionsResult } from "@/types/suggestions";

export function AISuggestionsPanel({ suggestions }: { suggestions: SuggestionsResult }) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!suggestions.ai_available) {
    return (
      <div className="card p-6">
        <h2 className="text-sm font-semibold mb-2 flex items-center gap-2">
          <Sparkles size={15} className="text-[var(--color-indigo)]" />
          AI Suggestions
        </h2>
        <p className="text-xs text-[var(--color-muted)]">{suggestions.message}</p>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
        <Sparkles size={15} className="text-[var(--color-indigo)]" />
        AI Suggestions
      </h2>

      {suggestions.score_explanation && (
        <div className="bg-[var(--color-indigo-soft)] rounded-xl p-4 mb-4">
          <p className="text-xs text-[var(--color-text)] leading-relaxed">
            {suggestions.score_explanation}
          </p>
        </div>
      )}

      <div className="space-y-2">
        {suggestions.bullet_rewrites.map((rewrite, i) => (
          <div key={i} className="border border-[var(--color-border)] rounded-xl overflow-hidden">
            <button
              onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
              className="w-full flex items-center justify-between px-4 py-3 text-left text-sm"
            >
              <span className="truncate pr-2">Bullet rewrite #{i + 1}</span>
              <ChevronRight
                size={14}
                className={`flex-shrink-0 transition-transform ${expandedIndex === i ? "rotate-90" : ""}`}
              />
            </button>
            {expandedIndex === i && (
              <div className="px-4 pb-4 space-y-2">
                <div>
                  <span className="pill pill-danger">Original</span>
                  <p className="text-xs text-[var(--color-muted)] mt-1.5">{rewrite.original}</p>
                </div>
                <div>
                  <span className="pill pill-success">Suggested</span>
                  <p className="text-xs mt-1.5">{rewrite.suggested ?? "Unavailable"}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}