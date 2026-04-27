import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  overline?: string;
  action?: ReactNode;
  children: ReactNode;
  height?: number;
  className?: string;
}

export function ChartCard({ title, subtitle, overline, action, children, height = 280, className }: ChartCardProps) {
  return (
    <div className={cn("bg-paper border border-ink-150 rounded-lg shadow-sm", className)}>
      <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-3">
        <div className="min-w-0">
          {overline && <div className="text-micro uppercase text-ink-400 mb-1">{overline}</div>}
          <h3 className="text-h3 text-ink-900">{title}</h3>
          {subtitle && <p className="text-small text-ink-500 mt-0.5">{subtitle}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div className="px-2 pb-4" style={{ height }}>
        {children}
      </div>
    </div>
  );
}
