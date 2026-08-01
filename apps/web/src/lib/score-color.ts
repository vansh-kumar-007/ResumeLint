export function scoreColor(score: number): string {
  if (score >= 80) return "var(--color-success)";
  if (score >= 50) return "var(--color-warning)";
  return "var(--color-danger)";
}

export function scoreSoftBg(score: number): string {
  if (score >= 80) return "var(--color-success-soft)";
  if (score >= 50) return "var(--color-warning-soft)";
  return "var(--color-danger-soft)";
}