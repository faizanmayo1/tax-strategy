import { cn } from "@/lib/utils";

interface ConfidenceMeterProps {
  value: number; // 0-100
  className?: string;
  showValue?: boolean;
}

export function ConfidenceMeter({ value, className, showValue = true }: ConfidenceMeterProps) {
  const segments = 5;
  const filled = Math.round((value / 100) * segments);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: segments }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-3 w-1.5 rounded-sm",
              i < filled
                ? value >= 80
                  ? "bg-success"
                  : value >= 60
                    ? "bg-brand-500"
                    : "bg-warn"
                : "bg-ink-150",
            )}
          />
        ))}
      </div>
      {showValue && <span className="text-[11px] font-medium text-ink-500 tabular">{value}%</span>}
    </div>
  );
}
