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

  return (
    <div className="neu-panel">
      <h2 className="text-xs uppercase tracking-wider font-bold mb-4">Detected Contact Info</h2>
      <div className="space-y-2.5">
        {rows.map(([Icon, label, value]) => (
          <div key={label} className="flex items-center gap-3 text-sm">
            <Icon size={15} className="flex-shrink-0" />
            <span className="text-[var(--color-muted)] w-16 flex-shrink-0">{label}</span>
            {value ? (
              <span className="truncate font-mono">{value}</span>
            ) : (
              <span className="flex items-center gap-1 text-[var(--color-diagnostic-red)] font-bold">
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