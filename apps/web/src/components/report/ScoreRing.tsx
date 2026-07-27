import { scoreColor } from "@/lib/score-color";

export function ScoreRing({ score }: { score: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-32 h-32 flex-shrink-0">
      <svg width="128" height="128" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r={radius} fill="none" stroke="#e5e0d0" strokeWidth="10" />
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke={scoreColor(score)}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 64 64)"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
        <circle cx="64" cy="64" r={radius - 16} fill="none" stroke="var(--color-border)" strokeWidth="3" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black font-mono">{score}</span>
        <span className="text-[10px] uppercase tracking-wider text-[var(--color-muted)]">
          ATS Score
        </span>
      </div>
    </div>
  );
}