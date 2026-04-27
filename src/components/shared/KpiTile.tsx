import { type ReactNode } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiTileProps {
  label: string;
  value: string;
  delta?: { value: number; suffix?: string; positiveIsGood?: boolean };
  hint?: string;
  icon?: ReactNode;
  tone?: "default" | "success" | "warn" | "danger";
  mono?: boolean;
}

export function KpiTile({
  label,
  value,
  delta,
  hint,
  icon,
  tone = "default",
  mono = false,
}: KpiTileProps) {
  const positive = delta && delta.value > 0;
  const isGood = delta && (delta.positiveIsGood ?? true) ? positive : !positive;

  const valueClass: Record<string, string> = {
    default: "text-ink-900",
    success: "text-success-ink",
    warn: "text-warn-ink",
    danger: "text-danger-ink",
  };

  return (
    <div className="bg-paper border border-ink-150 rounded-lg p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="text-micro uppercase text-ink-400">{label}</div>
        {icon && <div className="text-ink-300">{icon}</div>}
      </div>
      <div
        className={cn(
          "text-[28px] font-semibold leading-tight tabular tracking-tight",
          valueClass[tone],
          mono && "font-mono",
        )}
      >
        {value}
      </div>
      <div className="flex items-center gap-2 mt-2 min-h-[20px]">
        {delta && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-[12px] font-medium tabular",
              isGood ? "text-success-ink" : "text-danger-ink",
            )}
          >
            {positive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
            {Math.abs(delta.value).toFixed(1)}
            {delta.suffix ?? "%"}
          </span>
        )}
        {hint && <span className="text-[12px] text-ink-400">{hint}</span>}
      </div>
    </div>
  );
}
