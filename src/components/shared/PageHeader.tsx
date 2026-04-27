import { type ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Crumb {
  label: string;
  onClick?: () => void;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Crumb[];
  actions?: ReactNode;
  meta?: ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, breadcrumbs, actions, meta, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-3 mb-6", className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="flex items-center gap-1 text-small text-ink-400">
          {breadcrumbs.map((c, i) => (
            <div key={i} className="flex items-center gap-1">
              {c.onClick ? (
                <button
                  onClick={c.onClick}
                  className="hover:text-ink-700 transition-colors"
                >
                  {c.label}
                </button>
              ) : (
                <span className={i === breadcrumbs.length - 1 ? "text-ink-700 font-medium" : ""}>{c.label}</span>
              )}
              {i < breadcrumbs.length - 1 && <ChevronRight className="h-3.5 w-3.5 text-ink-300" />}
            </div>
          ))}
        </div>
      )}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <h1 className="text-display text-ink-900 font-display">{title}</h1>
          {subtitle && <p className="text-body text-ink-500 mt-1.5 max-w-2xl">{subtitle}</p>}
          {meta && <div className="mt-2">{meta}</div>}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
