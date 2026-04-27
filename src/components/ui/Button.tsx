import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "ai" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variantClass: Record<Variant, string> = {
  primary:
    "bg-brand-900 text-white hover:bg-brand-800 active:bg-brand-700 disabled:bg-ink-200 disabled:text-ink-400",
  secondary:
    "bg-ink-100 text-ink-900 hover:bg-ink-150 border border-ink-150",
  ghost: "bg-transparent text-ink-700 hover:bg-ink-100",
  outline: "bg-paper text-ink-700 border border-ink-200 hover:bg-ink-50 hover:border-ink-300",
  ai: "bg-ai-gradient text-white shadow-sm hover:opacity-95",
  danger: "bg-danger text-white hover:bg-danger-ink",
};

const sizeClass: Record<Size, string> = {
  sm: "h-8 px-3 text-[12.5px] gap-1.5 rounded-md",
  md: "h-9 px-3.5 text-[13.5px] gap-2 rounded-md",
  lg: "h-10 px-4 text-[14px] gap-2 rounded-md",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", leftIcon, rightIcon, className, children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center font-medium transition-all whitespace-nowrap select-none disabled:cursor-not-allowed",
        variantClass[variant],
        sizeClass[size],
        className,
      )}
      {...rest}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  );
});
