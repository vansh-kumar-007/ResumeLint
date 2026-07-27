export function scoreColor(score: number): string {
  if (score >= 80) return "var(--color-diagnostic-green)";
  if (score >= 50) return "var(--color-yellow)";
  return "var(--color-diagnostic-red)";
}