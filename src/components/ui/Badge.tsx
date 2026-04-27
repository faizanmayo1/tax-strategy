import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type BadgeTone =
  | "neutral"
  | "success"
  | "warn"
  | "danger"
  | "info"
  | "ai"
  | "brand";

interface BadgeProps {
  tone?: BadgeTone;
  children: ReactNode;
  size?: "sm" | "md";
  dot?: boolean;
  className?: string;
}

const toneClass: Record<BadgeTone, string> = {
  neutral: "bg-ink-100 text-ink-700",
  success: "bg-success-bg text-success-ink",
  warn: "bg-warn-bg text-warn-ink",
  danger: "bg-danger-bg text-danger-ink",
  info: "bg-info-bg text-info-ink",
  ai: "bg-accent-violetBg text-accent-violet",
  brand: "bg-brand-100 text-brand-700",
};

const dotClass: Record<BadgeTone, string> = {
  neutral: "bg-ink-400",
  success: "bg-success",
  warn: "bg-warn",
  danger: "bg-danger",
  info: "bg-info",
  ai: "bg-accent-violet",
  brand: "bg-brand-500",
};

export function Badge({ tone = "neutral", size = "sm", dot, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        size === "sm" ? "h-[20px] px-2 text-[11px] gap-1.5" : "h-[24px] px-2.5 text-[12px] gap-1.5",
        toneClass[tone],
        className,
      )}
    >
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", dotClass[tone])} />}
      {children}
    </span>
  );
}
