import { useState } from "react";
import {
  Sparkles,
  FileText,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  ShieldAlert,
  BadgeAlert,
  CalendarClock,
  Users as UsersIcon,
  FlaskConical,
  Zap,
} from "lucide-react";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Line,
  LineChart,
} from "recharts";
import { PageHeader } from "@/components/shared/PageHeader";
import { KpiTile } from "@/components/shared/KpiTile";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ChartCard } from "@/components/shared/ChartCard";
import { RiskScore } from "@/components/shared/RiskScore";
import { Avatar } from "@/components/shared/Avatar";
import { Dialog } from "@/components/ui/Dialog";
import { useNavigation } from "@/app/navigation";
import { useToast } from "@/app/providers/ToastProvider";
import { clients, clientsCount } from "@/mocks/clients";
import { strategyTotals } from "@/mocks/strategies";
import { alerts } from "@/mocks/alerts";
import { portfolioTaxExposure, cashFlowDistribution } from "@/mocks/finance";
import { deadlines } from "@/mocks/compliance";
import { formatCurrency, formatNumber, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export function DashboardPage() {
  const { openClient, setPage } = useNavigation();
  const { toast } = useToast();
  const [scanOpen, setScanOpen] = useState(false);

  const highPriority = clients
    .filter((c) => c.taxRiskScore >= 6.5 || c.cashFlowScore <= 5 || c.flags.includes("anomaly"))
    .sort((a, b) => b.taxRiskScore - a.taxRiskScore)
    .slice(0, 8);

  const totalIdentified = clients.reduce((sum, c) => sum + c.identifiedSavings, 0);
  const avgRisk = clients.reduce((sum, c) => sum + c.taxRiskScore, 0) / clients.length;
  const next7Days = deadlines.filter((d) => {
    const days = (new Date(d.dueDate).getTime() - Date.now()) / 86_400_000;
    return days >= 0 && days <= 7;
  }).length;
  const openTasks = strategyTotals.identified + strategyTotals.pending;

  return (
    <div className="px-8 py-7 max-w-[1480px] mx-auto">
      <PageHeader
        title="Firm Overview"
        subtitle="AI-triaged view of your full client book — Aragon Advisors · 2024 tax year"
        meta={
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge tone="ai" dot>
              <Sparkles className="h-3 w-3 mr-1" /> Last AI scan · 6 minutes ago
            </Badge>
            <Badge tone="success" dot>
              All integrations connected
            </Badge>
            <Badge tone="neutral">YTD · 2024</Badge>
          </div>
        }
        actions={
          <>
            <Button variant="outline" size="md" leftIcon={<FileText className="h-4 w-4" />} onClick={() => setPage("reports")}>
              Generate Partner Brief
            </Button>
            <Button variant="ai" size="md" leftIcon={<Sparkles className="h-4 w-4" />} onClick={() => setScanOpen(true)}>
              Run Portfolio Scan
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        <KpiTile
          label="Active Clients"
          value={formatNumber(clientsCount)}
          delta={{ value: 4.2 }}
          hint="vs last quarter"
          icon={<UsersIcon className="h-4 w-4" />}
        />
        <KpiTile
          label="Savings Identified · YTD"
          value={formatCurrency(totalIdentified, { compact: true })}
          delta={{ value: 18.6 }}
          hint="across 312 strategies"
          mono
          tone="success"
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <KpiTile
          label="Avg Tax Risk"
          value={`${avgRisk.toFixed(1)} / 10`}
          delta={{ value: -0.8, positiveIsGood: false }}
          hint="lower is better"
          tone="warn"
          icon={<ShieldAlert className="h-4 w-4" />}
        />
        <KpiTile
          label="Open Advisory Tasks"
          value={formatNumber(openTasks)}
          delta={{ value: 12.3 }}
          hint="awaiting partner review"
          icon={<BadgeAlert className="h-4 w-4" />}
        />
        <KpiTile
          label="Deadlines · 7 days"
          value={formatNumber(next7Days)}
          hint="across the book"
          tone="danger"
          icon={<CalendarClock className="h-4 w-4" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        <Card padded={false} className="lg:col-span-2 overflow-hidden">
          <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-3">
            <div>
              <div className="text-micro uppercase text-ink-400 mb-1">Top priority</div>
              <h3 className="text-h3 text-ink-900">High-Priority Clients</h3>
              <p className="text-small text-ink-500 mt-0.5">
                Risk-ranked by tax exposure, cash flow, and AI-flagged anomalies
              </p>
            </div>
            <Button size="sm" variant="ghost" rightIcon={<ChevronRight className="h-3.5 w-3.5" />} onClick={() => setPage("clients")}>
              View all 150
            </Button>
          </div>
          <table className="w-full text-[13.5px]">
            <thead>
              <tr className="text-[11px] font-semibold uppercase tracking-wider text-ink-400 border-y border-ink-100 bg-ink-50">
                <th className="text-left font-semibold px-5 py-2.5">Client</th>
                <th className="text-left font-semibold py-2.5">Risk</th>
                <th className="text-right font-semibold py-2.5">Tax Exposure</th>
                <th className="text-right font-semibold py-2.5">Identified Savings</th>
                <th className="text-left font-semibold py-2.5 px-2">Flags</th>
                <th className="text-right font-semibold pr-5 py-2.5">Last Touch</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {highPriority.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => openClient(c.id, "tax-strategies")}
                  className="border-b border-ink-100 last:border-0 hover:bg-ink-50 transition-colors cursor-pointer group"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={c.name} size="sm" />
                      <div className="min-w-0">
                        <div className="font-medium text-ink-900 truncate">{c.name}</div>
                        <div className="text-[11.5px] text-ink-400 truncate">
                          {c.entity} · {c.industry}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <RiskScore score={c.taxRiskScore} />
                  </td>
                  <td className="py-3 text-right font-mono tabular text-ink-900">
                    {formatCurrency(c.estimatedTaxLiability, { compact: true })}
                  </td>
                  <td className="py-3 text-right">
                    {c.identifiedSavings > 0 ? (
                      <span className="font-mono tabular text-success-ink font-medium">
                        +{formatCurrency(c.identifiedSavings, { compact: true })}
                      </span>
                    ) : (
                      <span className="text-ink-300">—</span>
                    )}
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-1 flex-wrap">
                      {c.flags.includes("anomaly") && <Badge tone="warn">Anomaly</Badge>}
                      {c.flags.includes("audit") && <Badge tone="danger">Audit</Badge>}
                      {c.flags.includes("nexus") && <Badge tone="info">Nexus</Badge>}
                      {c.flags.includes("missing-docs") && <Badge tone="neutral">Docs</Badge>}
                      {c.flags.includes("deadline") && <Badge tone="warn">Deadline</Badge>}
                      {c.flags.length === 0 && <span className="text-ink-300 text-[11.5px]">—</span>}
                    </div>
                  </td>
                  <td className="py-3 text-right pr-5 text-ink-500 text-[12px]">{formatDate(c.lastTouch, { format: "rel" })}</td>
                  <td className="pr-5 py-3 w-6 text-ink-300 group-hover:text-ink-700 transition-colors">
                    <ChevronRight className="h-4 w-4" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card padded>
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="text-micro uppercase text-ink-400 mb-1">Strategy Pipeline</div>
              <h3 className="text-h3 text-ink-900">YTD Funnel</h3>
            </div>
            <Badge tone="ai" dot>
              <Sparkles className="h-3 w-3" /> AI · 312
            </Badge>
          </div>
          <FunnelStage label="Identified" count={strategyTotals.identified} amount={1_840_000} pct={100} tone="ai" />
          <FunnelStage label="Pending Approval" count={strategyTotals.pending} amount={1_240_000} pct={68} tone="brand" />
          <FunnelStage label="Approved" count={strategyTotals.approved} amount={920_000} pct={50} tone="info" />
          <FunnelStage label="Delivered" count={strategyTotals.delivered} amount={640_000} pct={35} tone="warn" />
          <FunnelStage label="Realized · saved" count={strategyTotals.realized} amount={strategyTotals.totalRealizedSavings} pct={22} tone="success" />
          <Button
            size="sm"
            variant="ghost"
            className="w-full mt-3"
            rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
            onClick={() => {
              setPage("clients");
              toast({ kind: "info", title: "All strategies", description: "312 strategies across 96 clients" });
            }}
          >
            Review pipeline
          </Button>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        <ChartCard
          className="lg:col-span-2"
          overline="Portfolio · YoY"
          title="Tax Exposure Trend"
          subtitle="Revenue ($M) and total liability ($M) across the firm's book"
          height={300}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={portfolioTaxExposure} margin={{ top: 12, left: 0, right: 16, bottom: 4 }}>
              <CartesianGrid stroke="#F1F5F9" strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis yAxisId="left" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis yAxisId="right" orientation="right" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTooltip suffix="M" />} />
              <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#3B5BFE" strokeWidth={2.4} dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="liability" stroke="#7C3AED" strokeWidth={2.4} strokeDasharray="5 4" dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 px-5 -mt-2">
            <LegendDot color="#3B5BFE" label="Revenue" />
            <LegendDot color="#7C3AED" label="Liability" dashed />
          </div>
        </ChartCard>

        <ChartCard
          overline="Distribution"
          title="Cash Flow Health"
          subtitle="Clients bucketed by cash flow score"
          height={300}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cashFlowDistribution} margin={{ top: 12, left: 0, right: 16, bottom: 4 }}>
              <CartesianGrid stroke="#F1F5F9" strokeDasharray="3 3" />
              <XAxis dataKey="bucket" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} interval={0} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="#3B5BFE" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <ComplianceHeatmap />

        <Card>
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-micro uppercase text-ink-400 mb-1">Live · Last 24h</div>
              <h3 className="text-h3 text-ink-900">Alerts Feed</h3>
            </div>
            <Badge tone="danger" dot>
              {alerts.filter((a) => !a.read).length} unread
            </Badge>
          </div>
          <ul className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1 -mr-1">
            {alerts.map((a) => (
              <li
                key={a.id}
                className={cn(
                  "border border-ink-150 rounded-md p-3 hover:bg-ink-50 transition-colors cursor-pointer",
                  !a.read && "bg-brand-100/30 border-brand-100",
                )}
              >
                <div className="flex items-start gap-2.5">
                  <AlertIcon kind={a.kind} severity={a.severity} />
                  <div className="min-w-0 flex-1">
                    <div className="text-[12.5px] font-semibold text-ink-900 leading-snug">{a.title}</div>
                    <div className="text-[11.5px] text-ink-500 mt-0.5 leading-snug">{a.description}</div>
                    <div className="text-[10.5px] text-ink-400 mt-1.5">{formatDate(a.occurredAt, { format: "rel" })}</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Dialog
        open={scanOpen}
        onOpenChange={setScanOpen}
        title="Run portfolio scan"
        description="AI will re-analyze every client's bookkeeping, tax filings, entity, and cash flow"
        footer={
          <>
            <Button variant="ghost" onClick={() => setScanOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="ai"
              leftIcon={<Sparkles className="h-4 w-4" />}
              onClick={() => {
                setScanOpen(false);
                toast({
                  kind: "ai" as never as "success",
                  title: "Scan started",
                  description: "150 clients · ETA 6 minutes — you'll be notified when complete",
                });
              }}
            >
              Start scan
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <ScanStat icon={<UsersIcon className="h-4 w-4 text-brand-700" />} label="Clients" value="150" />
            <ScanStat icon={<FlaskConical className="h-4 w-4 text-accent-violet" />} label="Strategies in library" value="42" />
            <ScanStat icon={<Zap className="h-4 w-4 text-warn-ink" />} label="Avg runtime" value="~6 min" />
            <ScanStat icon={<TrendingUp className="h-4 w-4 text-success-ink" />} label="Last identified" value="$268K" />
          </div>
          <div className="bg-ink-50 border border-ink-150 rounded-md p-4 text-small text-ink-700 space-y-1">
            <div className="font-medium text-ink-900 mb-1">Scan will analyze:</div>
            <ul className="space-y-1 list-disc list-inside text-ink-500">
              <li>Bookkeeping for anomalies, miscategorizations, owner draws</li>
              <li>Tax filings vs. entity structure and reasonable comp</li>
              <li>Multi-state nexus exposure based on revenue + payroll location</li>
              <li>Cash flow runway and working capital risk</li>
              <li>Match findings against 42 firm-approved strategies</li>
            </ul>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

function FunnelStage({
  label,
  count,
  amount,
  pct,
  tone,
}: {
  label: string;
  count: number;
  amount: number;
  pct: number;
  tone: "ai" | "brand" | "info" | "warn" | "success";
}) {
  const colors: Record<string, string> = {
    ai: "bg-accent-violet",
    brand: "bg-brand-500",
    info: "bg-info",
    warn: "bg-warn",
    success: "bg-success",
  };
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[12.5px] text-ink-700 font-medium">{label}</span>
        <div className="flex items-center gap-2 text-[12px]">
          <span className="text-ink-400 tabular">{count}</span>
          <span className="font-mono text-success-ink tabular">{formatCurrency(amount, { compact: true })}</span>
        </div>
      </div>
      <div className="h-1.5 bg-ink-100 rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full transition-all", colors[tone])} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function LegendDot({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) {
  return (
    <div className="flex items-center gap-1.5 text-[11.5px] text-ink-500">
      {dashed ? (
        <span className="block w-3 h-[2px]" style={{ background: `repeating-linear-gradient(to right, ${color} 0 4px, transparent 4px 7px)` }} />
      ) : (
        <span className="block h-2 w-2 rounded-full" style={{ background: color }} />
      )}
      {label}
    </div>
  );
}

function ChartTooltip({ active, payload, label, suffix }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-paper border border-ink-150 rounded-md shadow-md p-2.5 min-w-[140px]">
      <div className="text-[11px] uppercase tracking-wider text-ink-400 mb-1">{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center justify-between gap-3 text-[12px]">
          <span className="flex items-center gap-1.5 text-ink-700">
            <span className="block h-2 w-2 rounded-full" style={{ background: p.color }} />
            {p.name}
          </span>
          <span className="font-mono tabular text-ink-900">
            {typeof p.value === "number" ? formatNumber(p.value, { decimals: p.value % 1 ? 1 : 0 }) : p.value}
            {suffix ?? ""}
          </span>
        </div>
      ))}
    </div>
  );
}

function ComplianceHeatmap() {
  // 13 weeks × 7 days = 91 cells, color = deadline density
  const cells = Array.from({ length: 91 }, (_, i) => {
    const seed = (i * 13) % 11;
    const intensity = seed > 6 ? "high" : seed > 3 ? "med" : seed > 1 ? "low" : "none";
    return intensity;
  });
  const colorMap: Record<string, string> = {
    none: "bg-ink-100",
    low: "bg-brand-100",
    med: "bg-brand-300/60",
    high: "bg-accent-violet/80",
  };

  return (
    <Card padded className="lg:col-span-2">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-micro uppercase text-ink-400 mb-1">Next 90 days</div>
          <h3 className="text-h3 text-ink-900">Compliance Heatmap</h3>
          <p className="text-small text-ink-500 mt-0.5">
            Density of estimated tax payments, filings, and advisory meetings
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10.5px] text-ink-500">
          Less
          {(["none", "low", "med", "high"] as const).map((k) => (
            <span key={k} className={cn("h-3 w-3 rounded-sm", colorMap[k])} />
          ))}
          More
        </div>
      </div>
      <div className="grid grid-cols-[auto_1fr] gap-3">
        <div className="flex flex-col justify-between text-[10px] text-ink-400 py-1">
          <span>Mon</span>
          <span>Wed</span>
          <span>Fri</span>
          <span>Sun</span>
        </div>
        <div className="grid grid-flow-col grid-rows-7 gap-1">
          {cells.map((c, i) => (
            <span
              key={i}
              className={cn("h-3.5 w-3.5 rounded-sm", colorMap[c])}
              title={c === "none" ? "No deadlines" : `${c.toUpperCase()} deadline density`}
            />
          ))}
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-ink-100 grid grid-cols-3 gap-3">
        <HeatStat label="Next 7 days" value="12" tone="danger" />
        <HeatStat label="Next 30 days" value="48" tone="warn" />
        <HeatStat label="Next 90 days" value="142" tone="info" />
      </div>
    </Card>
  );
}

function HeatStat({ label, value, tone }: { label: string; value: string; tone: "danger" | "warn" | "info" }) {
  const colors = {
    danger: "text-danger-ink bg-danger-bg",
    warn: "text-warn-ink bg-warn-bg",
    info: "text-info-ink bg-info-bg",
  };
  return (
    <div className="flex items-center gap-3">
      <div className={cn("h-9 w-9 rounded-md flex items-center justify-center font-mono font-semibold text-[14px] tabular", colors[tone])}>
        {value}
      </div>
      <div>
        <div className="text-[12.5px] font-medium text-ink-900">{label}</div>
        <div className="text-[11px] text-ink-400">deadlines · firm-wide</div>
      </div>
    </div>
  );
}

function AlertIcon({ kind, severity }: { kind: string; severity: string }) {
  const map: Record<string, { icon: any; bg: string; color: string }> = {
    anomaly: { icon: AlertTriangle, bg: "bg-warn-bg", color: "text-warn-ink" },
    nexus: { icon: ShieldAlert, bg: "bg-danger-bg", color: "text-danger-ink" },
    deadline: { icon: CalendarClock, bg: "bg-warn-bg", color: "text-warn-ink" },
    "missing-doc": { icon: FileText, bg: "bg-info-bg", color: "text-info-ink" },
    strategy: { icon: Sparkles, bg: "bg-accent-violetBg", color: "text-accent-violet" },
    audit: { icon: ShieldAlert, bg: "bg-danger-bg", color: "text-danger-ink" },
  };
  const v = map[kind] ?? map.deadline;
  const Icon = v.icon;
  void severity;
  return (
    <div className={cn("h-7 w-7 shrink-0 rounded flex items-center justify-center", v.bg)}>
      <Icon className={cn("h-3.5 w-3.5", v.color)} />
    </div>
  );
}

function ScanStat({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="border border-ink-150 rounded-md p-3 bg-paper flex items-center gap-3">
      <div className="h-8 w-8 rounded bg-ink-50 flex items-center justify-center">{icon}</div>
      <div>
        <div className="text-[11px] uppercase tracking-wider text-ink-400">{label}</div>
        <div className="text-[15px] font-semibold text-ink-900 tabular">{value}</div>
      </div>
    </div>
  );
}

