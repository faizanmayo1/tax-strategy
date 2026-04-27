import { TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

interface SavingsBadgeProps {
  amount: number;
  size?: "sm" | "md" | "lg";
  variant?: "soft" | "solid" | "plain";
  prefix?: string;
}

export function SavingsBadge({ amount, size = "sm", variant = "soft", prefix }: SavingsBadgeProps) {
  const sizeClass = {
    sm: "h-[22px] px-2 text-[11.5px] gap-1",
    md: "h-[26px] px-2.5 text-[12.5px] gap-1.5",
    lg: "h-[32px] px-3 text-[14px] gap-1.5",
  }[size];

  const variantClass = {
    soft: "bg-success-bg text-success-ink",
    solid: "bg-success text-white",
    plain: "text-success-ink",
  }[variant];

  return (
    <span className={cn("inline-flex items-center font-mono font-medium rounded-full tabular", sizeClass, variantClass)}>
      <TrendingUp className={cn(size === "lg" ? "h-3.5 w-3.5" : "h-3 w-3")} />
      {prefix && <span className="font-sans">{prefix}</span>}
      {formatCurrency(amount)}
    </span>
  );
}
