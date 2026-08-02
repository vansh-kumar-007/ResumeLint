import { User, Mail, Phone, Link2, XCircle } from "lucide-react";
import type { ContactInfo } from "@/types/analysis";

export function ContactCard({ contact }: { contact: ContactInfo }) {
  const rows: [React.ElementType, string, string | null][] = [
    [User, "Name", contact.name],
    [Mail, "Email", contact.email],
    [Phone, "Phone", contact.phone],
    [Link2, "LinkedIn", contact.linkedin_url ?? (contact.has_linkedin_mention ? "mentioned, link not detected" : null)],
    [Link2, "GitHub", contact.github_url ?? (contact.has_github_mention ? "mentioned, link not detected" : null)],
  ];
  const allDetected = rows.every(([, , value]) => value !== null);

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold">Detected Contact Info</h2>
        <span
          className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
          style={{
            color: allDetected ? "var(--color-success)" : "var(--color-warning)",
            backgroundColor: allDetected ? "var(--color-success-soft)" : "var(--color-warning-soft)",
          }}
        >
          {allDetected ? "Complete" : "Incomplete"}
        </span>
      </div>
      <div className="space-y-3">
        {rows.map(([Icon, label, value]) => (
          <div key={label} className="flex items-center gap-3 text-sm">
            <Icon size={16} className="text-[var(--color-muted)] flex-shrink-0" />
            <span className="text-[var(--color-muted)] w-16 flex-shrink-0">{label}</span>
            {value ? (
              <span className="truncate">{value}</span>
            ) : (
              <span className="flex items-center gap-1 text-[var(--color-danger)]">
                <XCircle size={13} />
                Not detected
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}