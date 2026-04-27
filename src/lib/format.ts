export function formatCurrency(value: number, opts: { compact?: boolean; signed?: boolean } = {}) {
  const { compact = false, signed = false } = opts;
  const abs = Math.abs(value);
  let formatted: string;
  if (compact) {
    if (abs >= 1_000_000_000) formatted = `$${(value / 1_000_000_000).toFixed(2)}B`;
    else if (abs >= 1_000_000) formatted = `$${(value / 1_000_000).toFixed(2)}M`;
    else if (abs >= 1_000) formatted = `$${(value / 1_000).toFixed(1)}K`;
    else formatted = `$${value.toFixed(0)}`;
  } else {
    formatted = `$${Math.round(value).toLocaleString("en-US")}`;
  }
  if (signed && value > 0 && !formatted.startsWith("+")) return `+${formatted}`;
  return formatted;
}

export function formatPercent(value: number, opts: { signed?: boolean; decimals?: number } = {}) {
  const { signed = false, decimals = 1 } = opts;
  const formatted = `${value.toFixed(decimals)}%`;
  if (signed && value > 0) return `+${formatted}`;
  return formatted;
}

export function formatNumber(value: number, opts: { decimals?: number; compact?: boolean } = {}) {
  const { decimals = 0, compact = false } = opts;
  if (compact) {
    const abs = Math.abs(value);
    if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (abs >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function formatDate(date: Date | string, opts: { format?: "short" | "long" | "month" | "rel" } = {}) {
  const d = typeof date === "string" ? new Date(date) : date;
  const { format = "short" } = opts;
  if (format === "long") {
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  }
  if (format === "month") {
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short" });
  }
  if (format === "rel") {
    const diffMs = d.getTime() - Date.now();
    const days = Math.round(diffMs / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    if (days === -1) return "Yesterday";
    if (days > 0 && days < 14) return `in ${days} days`;
    if (days < 0 && days > -14) return `${-days} days ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function initials(name: string) {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
