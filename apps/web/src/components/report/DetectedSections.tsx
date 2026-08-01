"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const LABELS: Record<string, string> = {
  header: "Header",
  education: "Education",
  experience: "Experience",
  projects: "Projects",
  skills: "Skills",
  certifications: "Certifications",
  achievements: "Achievements",
  positions_of_responsibility: "Positions of Responsibility",
};

export function DetectedSections({ sections }: { sections: Record<string, string> }) {
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm p-6">
      <h2 className="text-sm font-semibold mb-3">Detected Sections ({Object.keys(sections).length})</h2>
      <div className="space-y-1">
        {Object.entries(sections).map(([key, content]) => (
          <div key={key} className="border-b border-[var(--color-border)] last:border-b-0">
            <button
              onClick={() => setOpenKey(openKey === key ? null : key)}
              className="w-full text-left py-2.5 text-sm flex justify-between items-center"
            >
              <span>{LABELS[key] ?? key}</span>
              <ChevronDown size={15} className={`text-[var(--color-muted)] transition-transform ${openKey === key ? "rotate-180" : ""}`} />
            </button>
            {openKey === key && (
              <pre className="text-xs text-[var(--color-muted)] whitespace-pre-wrap pb-3">{content}</pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}