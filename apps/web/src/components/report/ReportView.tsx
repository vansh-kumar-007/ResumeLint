import type { AnalysisResult } from "@/types/analysis";
import { ScoreOverview } from "./ScoreOverview";
import { SectionScoresPanel } from "./SectionScoresPanel";
import { BulletList } from "./BulletList";
import { ContactCard } from "./ContactCard";
import { DetectedSections } from "./DetectedSections";

export function ReportView({ result }: { result: AnalysisResult }) {
  return (
    <div className="w-full max-w-3xl space-y-4">
      <ScoreOverview score={result.overall_score} capReasons={result.cap_reasons} />
      <ContactCard contact={result.contact_info} />
      <SectionScoresPanel scores={result.section_scores} />
      {result.bullet_analyses.length > 0 && <BulletList bullets={result.bullet_analyses} />}
      <DetectedSections sections={result.sections} />
    </div>
  );
}