import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-10 px-6 border border-dashed border-ink-200 rounded-lg bg-ink-50",
        className,
      )}
    >
      {icon && <div className="text-ink-300 mb-3">{icon}</div>}
      <div className="text-h3 text-ink-700">{title}</div>
      {description && <div className="text-small text-ink-500 mt-1 max-w-sm">{description}</div>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
