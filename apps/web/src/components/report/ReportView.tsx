"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { AnalysisResult } from "@/types/analysis";
import type { SuggestionsResult } from "@/types/suggestions";
import { fetchSuggestions } from "@/lib/api";
import { ScoreOverview } from "./ScoreOverview";
import { ContactCard } from "./ContactCard";
import { SectionScoresPanel } from "./SectionScoresPanel";
import { BulletList } from "./BulletList";
import { DetectedSections } from "./DetectedSections";
import { AISuggestionsPanel } from "./AISuggestionsPanel";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" },
  }),
};

export function ReportView({ result }: { result: AnalysisResult }) {
  const [suggestions, setSuggestions] = useState<SuggestionsResult | null>(null);

  useEffect(() => {
    fetchSuggestions(result.resume_id).then(setSuggestions).catch(() => setSuggestions(null));
  }, [result.resume_id]);

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 space-y-5">
        <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp}>
          <ScoreOverview score={result.overall_score} capReasons={result.cap_reasons} />
        </motion.div>
        <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUp}>
          <ContactCard contact={result.contact_info} />
        </motion.div>
        <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUp}>
          <SectionScoresPanel scores={result.section_scores} />
        </motion.div>
        {result.bullet_analyses.length > 0 && (
          <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp}>
            <BulletList bullets={result.bullet_analyses} />
          </motion.div>
        )}
        <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp}>
          <DetectedSections sections={result.sections} />
        </motion.div>
      </div>

      <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUp}>
        {suggestions ? (
          <AISuggestionsPanel suggestions={suggestions} />
        ) : (
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm p-6 text-sm text-[var(--color-muted)]">
            Loading AI suggestions…
          </div>
        )}
      </motion.div>
    </div>
  );
}