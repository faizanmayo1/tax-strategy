import { useMemo, useState } from "react";
import { Sparkles, Check, X, Eye, Filter, ArrowRight, Lock, AlertTriangle, FileText } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ConfidenceMeter } from "@/components/shared/ConfidenceMeter";
import { SavingsBadge } from "@/components/shared/SavingsBadge";
import { Dialog } from "@/components/ui/Dialog";
import { useToast } from "@/app/providers/ToastProvider";
import { strategiesForClient, type Strategy, type StrategyStatus } from "@/mocks/strategies";
import { type Client } from "@/mocks/clients";
import { formatCurrency, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

interface Props {
  client: Client;
}

const STATUS_TONE: Record<StrategyStatus, "ai" | "brand" | "info" | "warn" | "success"> = {
  identified: "ai",
  "pending-approval": "brand",
  approved: "info",
  delivered: "warn",
  realized: "success",
};

const STATUS_LABEL: Record<StrategyStatus, string> = {
  identified: "Identified",
  "pending-approval": "Pending approval",
  approved: "Approved",
  delivered: "Delivered to client",
  realized: "Realized · saved",
};

export function StrategiesTab({ client }: Props) {
  const { toast } = useToast();
  const all = useMemo(() => strategiesForClient(client.id), [client.id]);
  const [filter, setFilter] = useState<"all" | StrategyStatus>("all");
  const [open, setOpen] = useState<Strategy | null>(null);

  const list = filter === "all" ? all : all.filter((s) => s.status === filter);
  const total = all.reduce((sum, s) => sum + s.estimatedSavings, 0);
  const realized = all.filter((s) => s.status === "realized").reduce((sum, s) => sum + s.estimatedSavings, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <FilterChip label={`All (${all.length})`} active={filter === "all"} onClick={() => setFilter("all")} />
            <FilterChip
              label={`Identified (${all.filter((s) => s.status === "identified").length})`}
              tone="ai"
              active={filter === "identified"}
              onClick={() => setFilter("identified")}
            />
            <FilterChip
              label={`Pending (${all.filter((s) => s.status === "pending-approval").length})`}
              tone="brand"
              active={filter === "pending-approval"}
              onClick={() => setFilter("pending-approval")}
            />
            <FilterChip
              label={`Approved (${all.filter((s) => s.status === "approved").length})`}
              tone="info"
              active={filter === "approved"}
              onClick={() => setFilter("approved")}
            />
            <FilterChip
              label={`Delivered (${all.filter((s) => s.status === "delivered").length})`}
              tone="warn"
              active={filter === "delivered"}
              onClick={() => setFilter("delivered")}
            />
            <FilterChip
              label={`Realized (${all.filter((s) => s.status === "realized").length})`}
              tone="success"
              active={filter === "realized"}
              onClick={() => setFilter("realized")}
            />
          </div>
          <Button size="sm" variant="ghost" leftIcon={<Filter className="h-3.5 w-3.5" />}>
            More filters
          </Button>
        </div>

        {list.map((s) => (
          <Card key={s.id} padded>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <Badge tone={STATUS_TONE[s.status]} dot>
                    {STATUS_LABEL[s.status]}
                  </Badge>
                  <Badge tone="neutral">{s.category}</Badge>
                  <Badge tone={s.riskLevel === "Low" ? "success" : s.riskLevel === "Medium" ? "warn" : "danger"}>
                    {s.riskLevel} risk
                  </Badge>
                </div>
                <h3 className="text-h3 text-ink-900">{s.title}</h3>
                <p className="text-small text-ink-500 mt-1.5 leading-relaxed">{s.rationale}</p>

                <div className="flex items-center gap-5 mt-4 flex-wrap">
                  <div>
                    <div className="text-micro uppercase text-ink-400 mb-1">Estimated savings</div>
                    <SavingsBadge amount={s.estimatedSavings} size="md" />
                  </div>
                  <div>
                    <div className="text-micro uppercase text-ink-400 mb-1">AI confidence</div>
                    <ConfidenceMeter value={s.confidence} />
                  </div>
                  <div>
                    <div className="text-micro uppercase text-ink-400 mb-1">Identified</div>
                    <div className="text-[12.5px] text-ink-700 tabular">{formatDate(s.identifiedAt, { format: "rel" })}</div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <Button size="sm" variant="outline" leftIcon={<Eye className="h-3.5 w-3.5" />} onClick={() => setOpen(s)}>
                  Review
                </Button>
                {s.status === "identified" && (
                  <Button
                    size="sm"
                    leftIcon={<Check className="h-3.5 w-3.5" />}
                    onClick={() =>
                      toast({ kind: "success", title: "Approved for delivery", description: `${s.title} sent to advisor queue` })
                    }
                  >
                    Approve
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <Card padded>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-7 w-7 rounded-md bg-ai-gradient flex items-center justify-center">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>
            <h3 className="text-h3 text-ink-900">AI Insight Summary</h3>
          </div>
          <p className="text-small text-ink-500 leading-relaxed">
            Aragon analyzed <span className="font-semibold text-ink-900">3 years of financials</span>, prior tax returns,
            payroll, and bookkeeping for {client.name}. Top opportunity:{" "}
            <span className="font-semibold text-ink-900">S-Corp salary review + accountable plan</span> stacking. Combined
            projected savings exceed <span className="font-semibold text-success-ink">{formatCurrency(total, { compact: true })}</span>{" "}
            this fiscal year.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <MiniStat label="Strategies" value={String(all.length)} />
            <MiniStat label="Total savings" value={formatCurrency(total, { compact: true })} tone="success" />
            <MiniStat label="Realized" value={formatCurrency(realized, { compact: true })} tone="info" />
            <MiniStat label="Confidence avg" value={`${Math.round(all.reduce((s, x) => s + x.confidence, 0) / all.length)}%`} />
          </div>
        </Card>

        <Card padded>
          <h3 className="text-h3 text-ink-900 mb-3">Approval workflow</h3>
          <ol className="space-y-2.5 text-[12.5px]">
            {[
              { step: "1", label: "AI identifies strategy", done: true },
              { step: "2", label: "Senior advisor review", done: true },
              { step: "3", label: "Partner approval", done: false, current: true },
              { step: "4", label: "Client delivery", done: false },
              { step: "5", label: "Implementation tracked", done: false },
            ].map((s, i) => (
              <li key={i} className="flex items-center gap-2.5">
                <div
                  className={cn(
                    "h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0",
                    s.done && "bg-success text-white",
                    s.current && !s.done && "bg-brand-100 text-brand-700 ring-2 ring-brand-300/40",
                    !s.done && !s.current && "bg-ink-100 text-ink-400",
                  )}
                >
                  {s.done ? <Check className="h-3 w-3" /> : s.step}
                </div>
                <span className={cn(s.current ? "text-ink-900 font-medium" : "text-ink-700")}>{s.label}</span>
              </li>
            ))}
          </ol>
        </Card>

        <Card padded>
          <h3 className="text-h3 text-ink-900 mb-2">Compliance guardrails</h3>
          <ul className="text-small text-ink-500 space-y-1.5">
            <li className="flex items-center gap-2">
              <Lock className="h-3.5 w-3.5 text-success-ink" /> Source-linked to firm-approved playbooks
            </li>
            <li className="flex items-center gap-2">
              <AlertTriangle className="h-3.5 w-3.5 text-warn-ink" /> All medium/high risk require partner sign-off
            </li>
            <li className="flex items-center gap-2">
              <FileText className="h-3.5 w-3.5 text-info-ink" /> Implementation steps auto-attached to client folder
            </li>
          </ul>
        </Card>
      </div>

      <Dialog
        open={open !== null}
        onOpenChange={(v) => !v && setOpen(null)}
        title={open?.title ?? ""}
        description={`${open?.category} · ${STATUS_LABEL[open?.status ?? "identified"]}`}
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(null)} leftIcon={<X className="h-4 w-4" />}>
              Reject
            </Button>
            <Button variant="outline" onClick={() => setOpen(null)}>
              Save for review
            </Button>
            <Button
              leftIcon={<Check className="h-4 w-4" />}
              onClick={() => {
                toast({ kind: "success", title: "Approved", description: `${open?.title} delivered to advisor queue` });
                setOpen(null);
              }}
            >
              Approve & deliver
            </Button>
          </>
        }
      >
        {open && (
          <div className="space-y-5">
            <div className="grid grid-cols-3 gap-3">
              <MiniStat label="Estimated savings" value={formatCurrency(open.estimatedSavings)} tone="success" />
              <MiniStat label="AI Confidence" value={`${open.confidence}%`} />
              <MiniStat
                label="Risk Level"
                value={open.riskLevel}
                tone={open.riskLevel === "Low" ? "success" : open.riskLevel === "Medium" ? "warn" : "danger"}
              />
            </div>

            <Section title="Why AI flagged this">
              <p className="text-small text-ink-500 leading-relaxed">{open.rationale}</p>
            </Section>

            <Section title="Evidence">
              <ul className="space-y-1.5">
                {open.evidence.map((e, i) => (
                  <li key={i} className="flex items-start gap-2 text-small text-ink-700">
                    <span className="mt-0.5 h-4 w-4 rounded-full bg-info-bg text-info-ink flex items-center justify-center text-[10px] font-semibold">
                      {i + 1}
                    </span>
                    {e}
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="Implementation steps">
              <ol className="space-y-1.5">
                {open.steps.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-small text-ink-700">
                    <span className="mt-0.5 h-4 w-4 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-[10px] font-semibold tabular">
                      {i + 1}
                    </span>
                    {s}
                  </li>
                ))}
              </ol>
            </Section>

            <Section title="Source playbook">
              <div className="border border-ink-150 rounded-md p-3 bg-ink-50 flex items-start gap-3">
                <div className="h-8 w-8 rounded bg-paper border border-ink-150 flex items-center justify-center text-ink-700">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[12.5px] font-medium text-ink-900">Aragon Internal Playbook · {open.category}</div>
                  <div className="text-[11.5px] text-ink-500 mt-0.5">v2.3 · Approved by Partner Committee · Mar 2024</div>
                </div>
                <Button size="sm" variant="ghost" rightIcon={<ArrowRight className="h-3 w-3" />}>
                  Open
                </Button>
              </div>
            </Section>
          </div>
        )}
      </Dialog>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
  tone = "neutral",
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
  tone?: "neutral" | "ai" | "brand" | "info" | "warn" | "success";
}) {
  const activeBg: Record<string, string> = {
    neutral: "bg-ink-900 text-white border-ink-900",
    ai: "bg-accent-violet text-white border-accent-violet",
    brand: "bg-brand-500 text-white border-brand-500",
    info: "bg-info text-white border-info",
    warn: "bg-warn text-white border-warn",
    success: "bg-success text-white border-success",
  };
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-7 px-2.5 inline-flex items-center rounded-full text-[12px] font-medium transition-colors border",
        active ? activeBg[tone] : "border-ink-200 text-ink-700 hover:bg-ink-50",
      )}
    >
      {label}
    </button>
  );
}

function MiniStat({ label, value, tone = "neutral" }: { label: string; value: string; tone?: "neutral" | "success" | "info" | "warn" | "danger" }) {
  const colors = {
    neutral: "text-ink-900",
    success: "text-success-ink",
    info: "text-info-ink",
    warn: "text-warn-ink",
    danger: "text-danger-ink",
  };
  return (
    <div className="border border-ink-150 rounded-md p-3 bg-paper">
      <div className="text-micro uppercase text-ink-400 mb-1">{label}</div>
      <div className={cn("text-[15px] font-semibold tabular", colors[tone])}>{value}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-micro uppercase text-ink-400 mb-2">{title}</div>
      {children}
    </div>
  );
}
