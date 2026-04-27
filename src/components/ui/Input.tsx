import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: ReactNode;
  rightSlot?: ReactNode;
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { leftIcon, rightSlot, className, invalid, ...rest },
  ref,
) {
  return (
    <div
      className={cn(
        "flex items-center h-9 rounded-md bg-paper border transition-colors",
        invalid ? "border-danger" : "border-ink-200 focus-within:border-brand-500",
        "focus-within:ring-2 focus-within:ring-brand-500/20",
        className,
      )}
    >
      {leftIcon && <span className="pl-3 text-ink-400">{leftIcon}</span>}
      <input
        ref={ref}
        className="flex-1 min-w-0 px-3 bg-transparent text-body text-ink-900 placeholder:text-ink-400 outline-none"
        {...rest}
      />
      {rightSlot && <span className="pr-2">{rightSlot}</span>}
    </div>
  );
});

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { options, className, ...rest },
  ref,
) {
  return (
    <select
      ref={ref}
      className={cn(
        "h-9 px-3 pr-8 rounded-md bg-paper border border-ink-200 text-body text-ink-900",
        "appearance-none bg-no-repeat focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none",
        className,
      )}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M3 5L6 8L9 5' stroke='%2364748B' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
        backgroundPosition: "right 10px center",
      }}
      {...rest}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
});
