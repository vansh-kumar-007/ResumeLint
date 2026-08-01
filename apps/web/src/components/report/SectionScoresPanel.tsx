import type { SectionScores } from "@/types/analysis";
import { SectionScoreBar } from "./SectionScoreBar";

export function SectionScoresPanel({ scores }: { scores: SectionScores }) {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm p-6">
      <h2 className="text-sm font-semibold mb-2">Section Breakdown</h2>
      <SectionScoreBar label="Contact Info" score={scores.contact.score} issues={scores.contact.issues} />
      <SectionScoreBar label="Required Sections" score={scores.sections_present.score} issues={scores.sections_present.issues} />
      <SectionScoreBar label="Resume Length" score={scores.length.score} issues={scores.length.issues} />
      <SectionScoreBar label={`Bullet Quality (${scores.bullet_quality.bullets_analyzed} bullets)`} score={scores.bullet_quality.score} />
      <SectionScoreBar label="Skills Section" score={scores.skills_presence.score} />
    </div>
  );
}