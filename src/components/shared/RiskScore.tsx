import { cn } from "@/lib/utils";

interface RiskScoreProps {
  score: number; // 0-10
  size?: "sm" | "md";
  showLabel?: boolean;
}

function tone(score: number): { color: string; bg: string; label: string } {
  if (score >= 7) return { color: "text-danger-ink", bg: "bg-danger-bg", label: "High" };
  if (score >= 4) return { color: "text-warn-ink", bg: "bg-warn-bg", label: "Watch" };
  return { color: "text-success-ink", bg: "bg-success-bg", label: "Healthy" };
}

export function RiskScore({ score, size = "sm", showLabel = false }: RiskScoreProps) {
  const t = tone(score);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium tabular",
        size === "sm" ? "h-[20px] px-2 text-[11px]" : "h-[24px] px-2.5 text-[12px]",
        t.bg,
        t.color,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", t.color.replace("text-", "bg-").replace("-ink", ""))} />
      {score.toFixed(1)}
      {showLabel && <span className="opacity-70">· {t.label}</span>}
    </span>
  );
}

interface RiskBarProps {
  score: number; // 0-10
  className?: string;
}

export function RiskBar({ score, className }: RiskBarProps) {
  const t = tone(score);
  const pct = (score / 10) * 100;
  const fillColor = score >= 7 ? "bg-danger" : score >= 4 ? "bg-warn" : "bg-success";
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex-1 h-1.5 bg-ink-100 rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full transition-all", fillColor)} style={{ width: `${pct}%` }} />
      </div>
      <span className={cn("text-[11px] font-medium tabular", t.color)}>{score.toFixed(1)}</span>
    </div>
  );
}
