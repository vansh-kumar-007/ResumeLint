export default function HomePage() {
  return (
    <main className="min-h-screen p-10 space-y-4">
      <h1 className="text-3xl font-bold">Token check</h1>
      <p className="text-[var(--color-text)]">This is --color-text on --color-bg.</p>
      <p className="text-[var(--color-muted)]">This is --color-muted on --color-bg.</p>
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4">
        <p>This is inside a card (--color-surface, --color-border).</p>
      </div>
      <p className="text-[var(--color-indigo)]">This is --color-indigo text.</p>
      <p className="text-[var(--color-success)]">This is --color-success text.</p>
      <p className="text-[var(--color-danger)]">This is --color-danger text.</p>
    </main>
  );
}