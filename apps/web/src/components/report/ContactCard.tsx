import type { ContactInfo } from "@/types/analysis";

export function ContactCard({ contact }: { contact: ContactInfo }) {
  const rows: [string, string | null][] = [
    ["Name", contact.name],
    ["Email", contact.email],
    ["Phone", contact.phone],
    ["LinkedIn", contact.linkedin_url ?? (contact.has_linkedin_mention ? "mentioned, link not detected" : null)],
    ["GitHub", contact.github_url ?? (contact.has_github_mention ? "mentioned, link not detected" : null)],
  ];

  return (
    <div className="bg-[var(--color-graphite)] border border-[var(--color-steel)] rounded-[var(--radius-sharp)] p-6">
      <h2 className="text-sm uppercase tracking-wide text-[var(--color-muted)] mb-3">
        Detected Contact Info
      </h2>
      <dl className="space-y-1.5">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between text-sm">
            <dt className="text-[var(--color-muted)]">{label}</dt>
            <dd className={value ? "" : "text-[var(--color-diagnostic-red)]"}>
              {value ?? "Not detected"}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}