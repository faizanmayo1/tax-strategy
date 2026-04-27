import { useMemo } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Legend } from "recharts";
import { TrendingDown, AlertTriangle, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ChartCard } from "@/components/shared/ChartCard";
import { generateCashFlow, generateBudgetVsActual } from "@/mocks/finance";
import { type Client } from "@/mocks/clients";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

interface Props {
  client: Client;
}

export function CFOTab({ client }: Props) {
  const cashflow = useMemo(() => generateCashFlow(client.id, client.ytdRevenue / 12), [client]);
  const bva = useMemo(() => generateBudgetVsActual(client.id, client.ytdRevenue / 12), [client]);

  const last9 = cashflow.slice(0, 9);
  const lastNet = last9[last9.length - 1].net;
  const minNet = Math.min(...cashflow.slice(8).map((p) => p.net));
  const trough = cashflow.find((p) => p.net === minNet);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <KpiBlock label="Operating cash" value={formatCurrency(lastNet * 3, { compact: true })} sub="3-mo runway" tone="info" />
        <KpiBlock
          label="MoM net change"
          value={`${lastNet > 0 ? "+" : ""}${formatCurrency(lastNet, { compact: true })}`}
          sub="latest month"
          tone={lastNet > 0 ? "success" : "danger"}
        />
        <KpiBlock label="Working capital" value={formatCurrency(client.ytdRevenue * 0.18, { compact: true })} sub="A/R + Inventory − A/P" />
        <KpiBlock label="Days cash on hand" value="42" sub="watch zone · target 60+" tone="warn" />
      </div>

      <ChartCard
        overline="Forecast · 12 mo"
        title="Cash Flow Forecast"
        subtitle="Net cash flow with confidence band on next-quarter projection"
        height={320}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={cashflow} margin={{ top: 16, left: 0, right: 16, bottom: 0 }}>
            <defs>
              <linearGradient id="netFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B5BFE" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#3B5BFE" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="confFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#F1F5F9" strokeDasharray="3 3" />
            <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="bg-paper border border-ink-150 rounded-md shadow-md p-2.5 min-w-[160px]">
                    <div className="text-[11px] uppercase tracking-wider text-ink-400 mb-1">{label}</div>
                    {payload.map((p: any, i: number) => (
                      <div key={i} className="flex items-center justify-between gap-3 text-[12px]">
                        <span className="flex items-center gap-1.5 text-ink-700">
                          <span className="block h-2 w-2 rounded-full" style={{ background: p.color }} />
                          {p.name}
                        </span>
                        <span className="font-mono tabular text-ink-900">{formatCurrency(p.value, { compact: true })}</span>
                      </div>
                    ))}
                  </div>
                );
              }}
            />
            <Area type="monotone" dataKey="confHi" stroke="none" fill="url(#confFill)" />
            <Area type="monotone" dataKey="confLo" stroke="none" fill="#fff" />
            <Area type="monotone" dataKey="net" stroke="#3B5BFE" strokeWidth={2.4} fill="url(#netFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <ChartCard className="lg:col-span-2" overline="YTD" title="Budget vs. Actual" subtitle="Monthly variance — target vs. realized" height={300}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bva} margin={{ top: 16, left: 0, right: 16, bottom: 0 }}>
              <CartesianGrid stroke="#F1F5F9" strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
              <Tooltip
                cursor={{ fill: "#F8FAFC" }}
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="bg-paper border border-ink-150 rounded-md shadow-md p-2.5 min-w-[160px]">
                      <div className="text-[11px] uppercase tracking-wider text-ink-400 mb-1">{label}</div>
                      {payload.map((p: any, i: number) => (
                        <div key={i} className="flex items-center justify-between gap-3 text-[12px]">
                          <span className="flex items-center gap-1.5 text-ink-700">
                            <span className="block h-2 w-2 rounded-full" style={{ background: p.color }} />
                            {p.name}
                          </span>
                          <span className="font-mono tabular text-ink-900">{formatCurrency(p.value, { compact: true })}</span>
                        </div>
                      ))}
                    </div>
                  );
                }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="budget" name="Budget" fill="#CBD5E1" radius={[6, 6, 0, 0]} />
              <Bar dataKey="actual" name="Actual" fill="#3B5BFE" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card padded>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-7 w-7 rounded bg-warn-bg flex items-center justify-center">
              <TrendingDown className="h-3.5 w-3.5 text-warn-ink" />
            </div>
            <h3 className="text-h3 text-ink-900">CFO recommendations</h3>
          </div>

          {trough && (
            <div className="rounded-md bg-warn-bg border border-warn/20 p-3 mb-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-warn-ink shrink-0 mt-0.5" />
                <div>
                  <div className="text-[12.5px] font-semibold text-warn-ink">Cash flow tightens in {trough.month}</div>
                  <div className="text-[11.5px] text-ink-600 mt-0.5">
                    Net flow projected at {formatCurrency(trough.net, { compact: true })}. Confidence band is wide — recommend
                    expense timing review.
                  </div>
                </div>
              </div>
            </div>
          )}

          <ul className="space-y-2.5">
            {[
              { title: "Defer $42K of capital purchases to Q1", impact: "+18 days runway" },
              { title: "Negotiate net-45 with top 3 suppliers", impact: "+9 days runway" },
              { title: "Owner distribution timing shift", impact: "Smooths Q4 cash" },
              { title: "Open SBA line of credit ($250K)", impact: "Backstop, unused" },
            ].map((r, i) => (
              <li key={i} className="border border-ink-150 rounded-md p-3 hover:bg-ink-50 transition-colors cursor-pointer">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-[12.5px] font-medium text-ink-900">{r.title}</div>
                  <ArrowRight className="h-3.5 w-3.5 text-ink-400 shrink-0 mt-0.5" />
                </div>
                <div className="text-[11px] text-success-ink font-medium mt-1">{r.impact}</div>
              </li>
            ))}
          </ul>
          <Button size="sm" variant="outline" className="w-full mt-3">
            Generate CFO Brief
          </Button>
        </Card>
      </div>
    </div>
  );
}

function KpiBlock({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub: string;
  tone?: "info" | "warn" | "success" | "danger";
}) {
  const colors: Record<string, string> = {
    success: "text-success-ink",
    info: "text-info-ink",
    warn: "text-warn-ink",
    danger: "text-danger-ink",
  };
  return (
    <Card padded>
      <div className="text-micro uppercase text-ink-400 mb-1">{label}</div>
      <div className={cn("text-display font-display font-semibold tabular", tone && colors[tone])}>{value}</div>
      <div className="text-[11.5px] text-ink-500 mt-1">{sub}</div>
    </Card>
  );
}
