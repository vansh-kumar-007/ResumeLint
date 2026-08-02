"use client";

import { useEffect, useState } from "react";
import { motion, easeOut } from "framer-motion";
import type { AnalysisResult } from "@/types/analysis";
import type { SuggestionsResult } from "@/types/suggestions";
import { fetchSuggestions } from "@/lib/api";
import { ScoreOverview } from "./ScoreOverview";
import { StatCard } from "./StatCard";
import { ContactCard } from "./ContactCard";
import { BulletList } from "./BulletList";
import { DetectedSections } from "./DetectedSections";
import { AISuggestionsPanel } from "./AISuggestionsPanel";

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.35, ease: easeOut },
  }),
};

export function ReportView({ result }: { result: AnalysisResult }) {
  const [suggestions, setSuggestions] = useState<SuggestionsResult | null>(null);

  useEffect(() => {
    fetchSuggestions(result.resume_id).then(setSuggestions).catch(() => setSuggestions(null));
  }, [result.resume_id]);

  const s = result.section_scores;

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4">
      <div className="lg:col-span-8 space-y-4">
        {/* Top row: score ring + 4 compact stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp} className="sm:col-span-2">
            <ScoreOverview score={result.overall_score} capReasons={result.cap_reasons} />
          </motion.div>
          <div className="sm:col-span-3 grid grid-cols-2 gap-3">
            <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUp}>
              <StatCard label="Contact Info" score={s.contact.score} />
            </motion.div>
            <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUp}>
              <StatCard label="Sections" score={s.sections_present.score} />
            </motion.div>
            <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp}>
              <StatCard label="Bullet Quality" score={s.bullet_quality.score} sublabel={`${s.bullet_quality.bullets_analyzed} bullets`} />
            </motion.div>
            <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp}>
              <StatCard label="Skills" score={s.skills_presence.score} />
            </motion.div>
          </div>
        </div>

        <motion.div custom={5} initial="hidden" animate="visible" variants={fadeUp}>
          <ContactCard contact={result.contact_info} />
        </motion.div>

        {result.bullet_analyses.length > 0 && (
          <motion.div custom={6} initial="hidden" animate="visible" variants={fadeUp}>
            <BulletList bullets={result.bullet_analyses} />
          </motion.div>
        )}

        <motion.div custom={7} initial="hidden" animate="visible" variants={fadeUp}>
          <DetectedSections sections={result.sections} />
        </motion.div>
      </div>

      <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUp} className="lg:col-span-4">
        {suggestions ? (
          <AISuggestionsPanel suggestions={suggestions} />
        ) : (
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-sm p-5 text-sm text-[var(--color-muted)]">
            Loading AI suggestions…
          </div>
        )}
      </motion.div>
    </div>
  );
}