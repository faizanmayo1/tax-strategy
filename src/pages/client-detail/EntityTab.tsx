import { Check, Sparkles, Crown } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ConfidenceMeter } from "@/components/shared/ConfidenceMeter";
import { useToast } from "@/app/providers/ToastProvider";
import { entityComparison } from "@/mocks/compliance";
import { type Client } from "@/mocks/clients";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

interface Props {
  client: Client;
}

export function EntityTab({ client }: Props) {
  const { toast } = useToast();
  const recommendation = entityComparison.reduce((best, e) => (e.takeHome > best.takeHome ? e : best));
  const current = entityComparison.find((e) => e.type === client.entity) ?? entityComparison[1];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card padded>
          <div className="text-micro uppercase text-ink-400 mb-1">Current</div>
          <div className="flex items-center gap-2 mb-2">
            <div className="text-[20px] font-semibold text-ink-900">{client.entity}</div>
            <Badge tone="neutral">Today</Badge>
          </div>
          <div className="text-small text-ink-500">
            Take-home: <span className="font-mono tabular text-ink-900">{formatCurrency(current.takeHome, { compact: true })}</span>
          </div>
          <div className="text-small text-ink-500 mt-1">
            Audit risk:{" "}
            <Badge
              size="sm"
              tone={current.auditRiskLevel === "Low" ? "success" : current.auditRiskLevel === "Medium" ? "warn" : "danger"}
            >
              {current.auditRiskLevel}
            </Badge>
          </div>
        </Card>

        <Card padded className="lg:col-span-2 ai-border bg-paper">
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-md bg-ai-gradient flex items-center justify-center shrink-0">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="text-h3 text-ink-900">AI recommendation: convert to {recommendation.type}</h3>
                <Crown className="h-4 w-4 text-warn-ink" />
              </div>
              <p className="text-small text-ink-500 leading-relaxed">
                Based on owner comp benchmarks, projected revenue, and audit-risk profile, restructuring to{" "}
                <span className="font-semibold text-ink-900">{recommendation.type}</span> increases take-home by{" "}
                <span className="font-mono tabular text-success-ink">
                  {formatCurrency(recommendation.takeHome - current.takeHome, { compact: true })}
                </span>{" "}
                annually while reducing audit risk to <span className="font-medium">{recommendation.auditRiskLevel}</span>.
              </p>
              <div className="flex items-center gap-3 mt-3">
                <ConfidenceMeter value={88} />
                <Button size="sm" onClick={() => toast({ kind: "success", title: "Restructure plan generated", description: "Implementation checklist ready in the Reports tab" })}>
                  Generate restructure plan
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card padded={false}>
        <div className="px-5 pt-5 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-h3 text-ink-900">Entity comparison</h3>
            <p className="text-small text-ink-500 mt-0.5">Side-by-side projection across the five primary structures</p>
          </div>
          <Badge tone="neutral">Annualized · 2024</Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] min-w-[760px]">
            <thead>
              <tr className="text-[11px] font-semibold uppercase tracking-wider text-ink-400 border-y border-ink-100 bg-ink-50">
                <th className="text-left font-semibold px-5 py-2.5">Entity</th>
                <th className="text-right font-semibold py-2.5">SE Tax</th>
                <th className="text-right font-semibold py-2.5">Federal Tax</th>
                <th className="text-right font-semibold py-2.5">State Tax</th>
                <th className="text-right font-semibold py-2.5">Total Tax</th>
                <th className="text-right font-semibold py-2.5">Take-home</th>
                <th className="text-left font-semibold py-2.5 px-3">Audit risk</th>
              </tr>
            </thead>
            <tbody>
              {entityComparison.map((e) => {
                const isCurrent = e.type === client.entity;
                const isRec = e.type === recommendation.type;
                return (
                  <tr
                    key={e.type}
                    className={cn(
                      "border-b border-ink-100 last:border-0",
                      isRec && "bg-success-bg/40",
                      isCurrent && "bg-brand-100/30",
                    )}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-ink-900">{e.type}</span>
                        {isCurrent && <Badge size="sm" tone="brand">Current</Badge>}
                        {isRec && <Badge size="sm" tone="success">Recommended</Badge>}
                      </div>
                    </td>
                    <td className="py-3 text-right font-mono tabular text-ink-700">{formatCurrency(e.selfEmploymentTax, { compact: true })}</td>
                    <td className="py-3 text-right font-mono tabular text-ink-700">{formatCurrency(e.federalTax, { compact: true })}</td>
                    <td className="py-3 text-right font-mono tabular text-ink-700">{formatCurrency(e.stateTax, { compact: true })}</td>
                    <td className="py-3 text-right font-mono tabular text-ink-900 font-semibold">{formatCurrency(e.totalTax, { compact: true })}</td>
                    <td className="py-3 text-right font-mono tabular font-semibold text-success-ink">{formatCurrency(e.takeHome, { compact: true })}</td>
                    <td className="py-3 px-3">
                      <Badge tone={e.auditRiskLevel === "Low" ? "success" : e.auditRiskLevel === "Medium" ? "warn" : "danger"}>
                        {e.auditRiskLevel}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card padded>
          <h3 className="text-h3 text-ink-900 mb-3">Pros — {recommendation.type}</h3>
          <ul className="space-y-2">
            {recommendation.pros.map((p, i) => (
              <li key={i} className="flex items-start gap-2 text-small text-ink-700">
                <Check className="h-4 w-4 text-success-ink shrink-0 mt-0.5" />
                {p}
              </li>
            ))}
          </ul>
          <h4 className="text-h3 text-ink-900 mt-5 mb-3">Cons</h4>
          <ul className="space-y-2">
            {recommendation.cons.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-small text-ink-700">
                <span className="h-4 w-4 rounded-full border-2 border-warn shrink-0 mt-0.5" />
                {c}
              </li>
            ))}
          </ul>
        </Card>

        <Card padded>
          <h3 className="text-h3 text-ink-900 mb-3">Implementation checklist</h3>
          <ol className="space-y-2.5">
            {[
              "Run reasonable compensation study",
              "File Form 2553 by Mar 15",
              "Set up payroll system",
              "Amend operating agreement",
              "Open S-Corp election bank account",
              "Reconcile basis through closing date",
              "First payroll run + W-2 setup",
            ].map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-small text-ink-700">
                <span className="h-5 w-5 rounded-full bg-ink-100 text-ink-500 text-[10px] font-semibold flex items-center justify-center shrink-0 mt-0.5 tabular">
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </div>
  );
}
