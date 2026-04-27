import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";

interface AvatarProps {
  name: string;
  color?: [string, string]; // gradient stops
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

const sizeClass = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-[11px]",
  md: "h-10 w-10 text-[13px]",
  lg: "h-12 w-12 text-[15px]",
};

const palette: Array<[string, string]> = [
  ["#3B5BFE", "#7C3AED"],
  ["#0B2540", "#1E3A8A"],
  ["#0EA5E9", "#0369A1"],
  ["#059669", "#047857"],
  ["#D97706", "#B45309"],
  ["#DC2626", "#7F1D1D"],
  ["#7C3AED", "#5B21B6"],
  ["#0891B2", "#155E75"],
];

function colorFor(name: string): [string, string] {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) % 1024;
  return palette[hash % palette.length];
}

export function Avatar({ name, color, size = "sm", className }: AvatarProps) {
  const [from, to] = color ?? colorFor(name);
  return (
    <div
      className={cn(
        "shrink-0 inline-flex items-center justify-center rounded-full text-white font-semibold",
        sizeClass[size],
        className,
      )}
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      aria-hidden
    >
      {initials(name)}
    </div>
  );
}
