import { useMemo, useState } from "react";
import { AlertTriangle, Receipt, Copy, UserMinus, TrendingUp, Banknote, FileX, Check, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/app/providers/ToastProvider";
import { generateAnomalies, type AnomalyTxn } from "@/mocks/finance";
import { type Client } from "@/mocks/clients";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

interface Props {
  client: Client;
}

const flagMeta: Record<AnomalyTxn["flag"], { label: string; icon: any; tone: "warn" | "danger" | "info" }> = {
  duplicate: { label: "Duplicate", icon: Copy, tone: "warn" },
  miscategorized: { label: "Miscategorized", icon: AlertTriangle, tone: "warn" },
  "missing-receipt": { label: "Missing receipt", icon: Receipt, tone: "info" },
  "owner-draw": { label: "Owner draw", icon: UserMinus, tone: "danger" },
  variance: { label: "Variance > 2σ", icon: TrendingUp, tone: "warn" },
  personal: { label: "Personal expense", icon: FileX, tone: "danger" },
};

export function BookkeepingTab({ client }: Props) {
  const { toast } = useToast();
  const [filter, setFilter] = useState<"all" | AnomalyTxn["flag"]>("all");
  const all = useMemo(() => generateAnomalies(client.id, 18), [client.id]);
  const list = filter === "all" ? all : all.filter((a) => a.flag === filter);

  const counts: Record<AnomalyTxn["flag"], number> = {
    duplicate: 0,
    miscategorized: 0,
    "missing-receipt": 0,
    "owner-draw": 0,
    variance: 0,
    personal: 0,
  };
  all.forEach((a) => counts[a.flag]++);

  const totalImpact = all.reduce((s, a) => s + a.amount, 0);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
      <div className="space-y-4">
        <Card padded>
          <h3 className="text-h3 text-ink-900 mb-3">Close-readiness score</h3>
          <div className="flex items-center justify-center mb-4">
            <ReadinessRing pct={client.bookkeepingScore * 10} />
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <ReadinessStat label="Anomalies" value={String(all.length)} tone="warn" />
            <ReadinessStat label="Total impact" value={formatCurrency(totalImpact, { compact: true })} tone="info" />
            <ReadinessStat label="Reconciled" value={`${client.bookkeepingScore.toFixed(1)}/10`} tone="success" />
          </div>
        </Card>

        <Card padded>
          <h3 className="text-h3 text-ink-900 mb-3">Anomaly breakdown</h3>
          <div className="space-y-2">
            <BreakdownRow icon={Copy} label="Duplicates" count={counts.duplicate} tone="warn" onClick={() => setFilter("duplicate")} />
            <BreakdownRow icon={AlertTriangle} label="Miscategorized" count={counts.miscategorized} tone="warn" onClick={() => setFilter("miscategorized")} />
            <BreakdownRow icon={Receipt} label="Missing receipts" count={counts["missing-receipt"]} tone="info" onClick={() => setFilter("missing-receipt")} />
            <BreakdownRow icon={UserMinus} label="Owner draws (untracked)" count={counts["owner-draw"]} tone="danger" onClick={() => setFilter("owner-draw")} />
            <BreakdownRow icon={TrendingUp} label="Variance > 2σ" count={counts.variance} tone="warn" onClick={() => setFilter("variance")} />
            <BreakdownRow icon={FileX} label="Likely personal" count={counts.personal} tone="danger" onClick={() => setFilter("personal")} />
          </div>
          <Button size="sm" variant="ghost" className="w-full mt-3" onClick={() => setFilter("all")}>
            Show all anomalies
          </Button>
        </Card>

        <Card padded className="bg-ai-gradient text-white border-0">
          <div className="flex items-start gap-2 mb-2">
            <Banknote className="h-4 w-4 mt-0.5" />
            <h3 className="text-h3 text-white">AI cleanup suggestion</h3>
          </div>
          <p className="text-small text-white/85 leading-relaxed">
            Based on the patterns found, the system can auto-fix <span className="font-semibold">9 of {all.length}</span>{" "}
            anomalies (duplicates and personal expenses) and queue the rest for advisor review. Estimated cleanup time:{" "}
            <span className="font-semibold">14 minutes</span>.
          </p>
          <Button
            variant="secondary"
            size="sm"
            className="mt-4 bg-white text-accent-violet hover:bg-white/95"
            onClick={() => toast({ kind: "ai" as never as "success", title: "AI cleanup queued", description: "9 fixes applied · 9 sent to advisor review" })}
          >
            Run auto-cleanup
          </Button>
        </Card>
      </div>

      <Card padded={false} className="xl:col-span-2 overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-5 pt-5 pb-3">
          <div>
            <div className="text-micro uppercase text-ink-400 mb-1">Last scan · 6 minutes ago</div>
            <h3 className="text-h3 text-ink-900">Flagged transactions</h3>
            <p className="text-small text-ink-500 mt-0.5">Review and apply fixes; advisor signs off before close.</p>
          </div>
          <Badge tone="warn" dot>
            {list.length} flagged
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[13px] min-w-[820px]">
            <thead>
              <tr className="text-[11px] font-semibold uppercase tracking-wider text-ink-400 border-y border-ink-100 bg-ink-50">
                <th className="text-left font-semibold px-5 py-2.5">Date</th>
                <th className="text-left font-semibold py-2.5">Vendor</th>
                <th className="text-right font-semibold py-2.5">Amount</th>
                <th className="text-left font-semibold py-2.5 px-3">Category</th>
                <th className="text-left font-semibold py-2.5">Issue</th>
                <th className="text-left font-semibold py-2.5">AI fix</th>
                <th className="pr-5 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {list.map((a) => {
                const meta = flagMeta[a.flag];
                const Icon = meta.icon;
                return (
                  <tr key={a.id} className="border-b border-ink-100 last:border-0 hover:bg-ink-50 transition-colors">
                    <td className="px-5 py-3 text-ink-700 font-mono tabular text-[12.5px]">{a.date}</td>
                    <td className="py-3 text-ink-900 font-medium">{a.vendor}</td>
                    <td className="py-3 text-right font-mono tabular text-ink-900">${a.amount.toFixed(2)}</td>
                    <td className="py-3 px-3 text-ink-500 text-[12.5px]">{a.category}</td>
                    <td className="py-3">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 h-6 px-2 rounded-full text-[11.5px] font-medium",
                        meta.tone === "warn" && "bg-warn-bg text-warn-ink",
                        meta.tone === "danger" && "bg-danger-bg text-danger-ink",
                        meta.tone === "info" && "bg-info-bg text-info-ink",
                      )}>
                        <Icon className="h-3 w-3" />
                        {meta.label}
                      </span>
                    </td>
                    <td className="py-3 text-[12px] text-ink-700 max-w-[320px] truncate" title={a.suggestedFix}>
                      {a.suggestedFix}
                    </td>
                    <td className="pr-5 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => toast({ kind: "success", title: "Fix applied", description: `${a.vendor} · ${meta.label} resolved` })}
                          className="h-7 w-7 inline-flex items-center justify-center rounded-md text-success-ink hover:bg-success-bg transition-colors"
                          title="Apply"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => toast({ kind: "info", title: "Dismissed", description: "Marked as not an issue" })}
                          className="h-7 w-7 inline-flex items-center justify-center rounded-md text-ink-400 hover:bg-ink-100 transition-colors"
                          title="Dismiss"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function BreakdownRow({
  icon: Icon,
  label,
  count,
  tone,
  onClick,
}: {
  icon: any;
  label: string;
  count: number;
  tone: "warn" | "danger" | "info" | "success";
  onClick: () => void;
}) {
  const tones = {
    warn: "text-warn-ink bg-warn-bg",
    danger: "text-danger-ink bg-danger-bg",
    info: "text-info-ink bg-info-bg",
    success: "text-success-ink bg-success-bg",
  };
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between w-full p-2 rounded-md hover:bg-ink-50 transition-colors group"
    >
      <div className="flex items-center gap-2.5">
        <div className={cn("h-7 w-7 rounded flex items-center justify-center", tones[tone])}>
          <Icon className="h-3.5 w-3.5" />
        </div>
        <span className="text-[12.5px] text-ink-700 group-hover:text-ink-900">{label}</span>
      </div>
      <span className="text-[12.5px] font-mono tabular text-ink-900 font-semibold">{count}</span>
    </button>
  );
}

function ReadinessRing({ pct }: { pct: number }) {
  const r = 56;
  const c = 2 * Math.PI * r;
  const stroke = c - (pct / 100) * c;
  const color = pct >= 80 ? "#059669" : pct >= 50 ? "#D97706" : "#DC2626";

  return (
    <div className="relative h-[136px] w-[136px]">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#F1F5F9" strokeWidth="10" />
        <circle
          cx="70"
          cy="70"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={stroke}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-display font-display font-semibold text-ink-900 tabular">{Math.round(pct)}<span className="text-h2 text-ink-400">%</span></span>
        <span className="text-[11px] uppercase tracking-wider text-ink-400">Close readiness</span>
      </div>
    </div>
  );
}

function ReadinessStat({ label, value, tone }: { label: string; value: string; tone: "warn" | "info" | "success" }) {
  const colors = {
    warn: "text-warn-ink bg-warn-bg",
    info: "text-info-ink bg-info-bg",
    success: "text-success-ink bg-success-bg",
  };
  return (
    <div className={cn("rounded-md py-2 px-2", colors[tone])}>
      <div className="text-[10.5px] uppercase tracking-wider opacity-80">{label}</div>
      <div className="text-[14px] font-semibold tabular">{value}</div>
    </div>
  );
}
