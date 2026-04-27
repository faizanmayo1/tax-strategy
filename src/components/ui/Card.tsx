import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  padded?: boolean;
  interactive?: boolean;
}

export function Card({ children, className, padded = true, interactive = false }: CardProps) {
  return (
    <div
      className={cn(
        "bg-paper border border-ink-150 rounded-lg shadow-sm",
        interactive && "hover:shadow-md hover:border-ink-200 transition-all cursor-pointer",
        padded && "p-5",
        className,
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  overline?: string;
  action?: ReactNode;
  className?: string;
}

export function CardHeader({ title, subtitle, overline, action, className }: CardHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4 mb-4", className)}>
      <div className="min-w-0">
        {overline && (
          <div className="text-micro uppercase text-ink-400 mb-1">{overline}</div>
        )}
        <h3 className="text-h2 text-ink-900 truncate">{title}</h3>
        {subtitle && <p className="text-small text-ink-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
