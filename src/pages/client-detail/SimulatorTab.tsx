import { useMemo, useState } from "react";
import { Sparkles, Save, RotateCcw, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ChartCard } from "@/components/shared/ChartCard";
import { ConfidenceMeter } from "@/components/shared/ConfidenceMeter";
import { useToast } from "@/app/providers/ToastProvider";
import { calculateScenario, defaultScenario } from "@/mocks/finance";
import { type Client } from "@/mocks/clients";
import { formatCurrency, formatPercent } from "@/lib/format";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { cn } from "@/lib/utils";

interface Props {
  client: Client;
}

export function SimulatorTab({ client }: Props) {
  const { toast } = useToast();
  const [scenario, setScenario] = useState(defaultScenario());

  const baseExpenses = useMemo(() => Math.round(client.ytdRevenue * (1 - client.netMarginPct / 100)), [client]);
  const outcome = useMemo(() => calculateScenario(client.ytdRevenue, baseExpenses, scenario), [client, baseExpenses, scenario]);

  const data = [
    {
      name: "Federal",
      Baseline: Math.round(outcome.baselineLiability * 0.78),
      Optimized: Math.round(outcome.optimizedLiability * 0.78),
    },
    {
      name: "State",
      Baseline: Math.round(outcome.baselineLiability * 0.22),
      Optimized: Math.round(outcome.optimizedLiability * 0.22),
    },
    {
      name: "Payroll · SS+Med",
      Baseline: Math.round(scenario.s_corp_salary_reduction * 0.153 + 8_400),
      Optimized: 8_400,
    },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
      <div className="space-y-4">
        <Card padded>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-h3 text-ink-900">Scenario inputs</h3>
            <button
              onClick={() => setScenario(defaultScenario())}
              className="inline-flex items-center gap-1 text-[12px] text-ink-500 hover:text-ink-700"
            >
              <RotateCcw className="h-3 w-3" /> Reset
            </button>
          </div>
          <Slider
            label="Revenue change"
            min={-30}
            max={50}
            step={1}
            value={scenario.revenueDelta}
            onChange={(v) => setScenario({ ...scenario, revenueDelta: v })}
            display={`${scenario.revenueDelta >= 0 ? "+" : ""}${scenario.revenueDelta}%`}
          />
          <Slider
            label="Expense change"
            min={-20}
            max={30}
            step={1}
            value={scenario.expenseDelta}
            onChange={(v) => setScenario({ ...scenario, expenseDelta: v })}
            display={`${scenario.expenseDelta >= 0 ? "+" : ""}${scenario.expenseDelta}%`}
          />
          <Slider
            label="Payroll change"
            min={-20}
            max={30}
            step={1}
            value={scenario.payrollDelta}
            onChange={(v) => setScenario({ ...scenario, payrollDelta: v })}
            display={`${scenario.payrollDelta >= 0 ? "+" : ""}${scenario.payrollDelta}%`}
          />
          <Slider
            label="S-Corp salary reduction"
            min={0}
            max={150_000}
            step={5_000}
            value={scenario.s_corp_salary_reduction}
            onChange={(v) => setScenario({ ...scenario, s_corp_salary_reduction: v })}
            display={formatCurrency(scenario.s_corp_salary_reduction, { compact: true })}
          />
          <Slider
            label="Retirement contribution"
            min={0}
            max={69_000}
            step={1_000}
            value={scenario.retirementContribution}
            onChange={(v) => setScenario({ ...scenario, retirementContribution: v })}
            display={formatCurrency(scenario.retirementContribution, { compact: true })}
          />
          <Slider
            label="Cost segregation deduction"
            min={0}
            max={400_000}
            step={5_000}
            value={scenario.cost_seg_deduction}
            onChange={(v) => setScenario({ ...scenario, cost_seg_deduction: v })}
            display={formatCurrency(scenario.cost_seg_deduction, { compact: true })}
          />
          <div className="mt-4">
            <div className="text-[12px] font-medium text-ink-700 mb-1.5">Bonus timing</div>
            <div className="grid grid-cols-2 gap-2">
              {(["current", "next-year"] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => setScenario({ ...scenario, bonusTimingShift: opt })}
                  className={cn(
                    "h-9 rounded-md border text-[12.5px] transition-colors",
                    scenario.bonusTimingShift === opt
                      ? "border-brand-500 bg-brand-100/50 text-brand-700 font-medium"
                      : "border-ink-200 text-ink-700 hover:border-ink-300",
                  )}
                >
                  {opt === "current" ? "Pay this year" : "Defer to next year"}
                </button>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="xl:col-span-2 space-y-5">
        <Card padded>
          <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Badge tone="ai" dot>
                <Sparkles className="h-3 w-3" /> AI-modeled
              </Badge>
              <Badge tone={outcome.riskFlag === "low" ? "success" : outcome.riskFlag === "medium" ? "warn" : "danger"}>
                {outcome.riskFlag === "low" ? "Low risk" : outcome.riskFlag === "medium" ? "Medium risk" : "High risk"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" leftIcon={<Save className="h-3.5 w-3.5" />} onClick={() => toast({ kind: "success", title: "Scenario saved", description: "Saved as 'Year-end optimization v2'" })}>
                Save scenario
              </Button>
              <Button size="sm" leftIcon={<Sparkles className="h-3.5 w-3.5" />} onClick={() => toast({ kind: "ai" as never as "success", title: "Generating client summary", description: "Plain-English explanation prepared in 8s" })}>
                Generate client summary
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <ResultTile
              label="Baseline tax liability"
              value={formatCurrency(outcome.baselineLiability)}
              caption={`${formatPercent(outcome.effectiveRateBaseline)} effective rate`}
              tone="neutral"
            />
            <ResultTile
              label="Optimized liability"
              value={formatCurrency(outcome.optimizedLiability)}
              caption={`${formatPercent(outcome.effectiveRateOptimized)} effective rate`}
              tone="info"
            />
            <ResultTile
              label="Projected savings"
              value={formatCurrency(outcome.savings)}
              caption="vs. no-planning baseline"
              tone="success"
              big
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
            <SmallRow label="Federal savings" value={formatCurrency(outcome.federalSavings)} />
            <SmallRow label="State savings" value={formatCurrency(outcome.stateSavings)} />
            <SmallRow label="SS + Medicare savings" value={formatCurrency(outcome.ssMedicareSavings)} tone="success" />
          </div>
        </Card>

        <ChartCard
          overline="Comparison"
          title="Baseline vs. Optimized · Tax Components"
          subtitle="Side-by-side comparison of federal, state, and payroll-related obligations"
          height={300}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 16, left: 0, right: 16, bottom: 0 }}>
              <CartesianGrid stroke="#F1F5F9" strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
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
              <Bar dataKey="Baseline" fill="#94A3B8" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Optimized" fill="#059669" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card padded>
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-h3 text-ink-900">Client-facing explanation</h3>
              <p className="text-small text-ink-500 mt-0.5">Plain-English summary, ready to drop into a client report.</p>
            </div>
            <ConfidenceMeter value={92} />
          </div>
          <div className="bg-ink-50 border border-ink-150 rounded-md p-4 text-small text-ink-700 leading-relaxed">
            <p>
              By increasing revenue by{" "}
              <span className="font-semibold text-ink-900">{scenario.revenueDelta}%</span>, contributing{" "}
              <span className="font-semibold text-ink-900">{formatCurrency(scenario.retirementContribution, { compact: true })}</span> to a
              solo 401(k), and reducing your S-Corp salary by{" "}
              <span className="font-semibold text-ink-900">{formatCurrency(scenario.s_corp_salary_reduction, { compact: true })}</span>{" "}
              (within reasonable comp guidelines), your projected 2024 tax liability drops from{" "}
              <span className="font-semibold text-ink-900">{formatCurrency(outcome.baselineLiability, { compact: true })}</span> to{" "}
              <span className="font-semibold text-ink-900">{formatCurrency(outcome.optimizedLiability, { compact: true })}</span> — a{" "}
              <span className="text-success-ink font-semibold">{formatCurrency(outcome.savings, { compact: true })}</span> reduction.
              The cost segregation study on the building purchased this year accelerates depreciation, accounting for most of the
              federal savings.
            </p>
          </div>
          {outcome.riskFlag !== "low" && (
            <div className="mt-3 flex items-start gap-2 text-[12.5px] text-warn-ink bg-warn-bg border border-warn/20 rounded-md p-3">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                The S-Corp salary reduction approaches the lower bound of reasonable compensation. Recommend a documented RC
                study before implementing.
              </span>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function Slider({
  label,
  min,
  max,
  step,
  value,
  onChange,
  display,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  display: string;
}) {
  return (
    <div className="mb-4 last:mb-0">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[12.5px] font-medium text-ink-700">{label}</span>
        <span className="text-[12.5px] font-mono tabular text-ink-900">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none bg-ink-150 accent-brand-500 cursor-pointer"
      />
    </div>
  );
}

function ResultTile({
  label,
  value,
  caption,
  tone,
  big,
}: {
  label: string;
  value: string;
  caption: string;
  tone: "neutral" | "info" | "success";
  big?: boolean;
}) {
  const colors = {
    neutral: "text-ink-900 border-ink-150 bg-paper",
    info: "text-info-ink border-info/20 bg-info-bg",
    success: "text-success-ink border-success/20 bg-success-bg",
  };
  return (
    <div className={cn("border rounded-md p-4 relative overflow-hidden", colors[tone])}>
      <div className="text-micro uppercase text-ink-400 mb-1.5">{label}</div>
      <div className={cn("font-mono font-semibold tabular tracking-tight", big ? "text-[28px]" : "text-[22px]")}>{value}</div>
      <div className="text-[11.5px] text-ink-500 mt-1">{caption}</div>
    </div>
  );
}

function SmallRow({ label, value, tone }: { label: string; value: string; tone?: "success" }) {
  return (
    <div className="flex items-center justify-between border border-ink-150 rounded-md px-3 h-10 bg-ink-50">
      <span className="text-[12.5px] text-ink-500">{label}</span>
      <span className={cn("text-[13px] font-mono font-medium tabular", tone === "success" ? "text-success-ink" : "text-ink-900")}>
        {value}
      </span>
    </div>
  );
}
