import { ArrowLeft, MapPin, Building2, FileText, Sparkles, Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/shared/Avatar";
import { RiskScore } from "@/components/shared/RiskScore";
import { useNavigation } from "@/app/navigation";
import { useToast } from "@/app/providers/ToastProvider";
import { type Client } from "@/mocks/clients";
import { formatCurrency, formatDate } from "@/lib/format";

interface ClientHeaderProps {
  client: Client;
}

export function ClientHeader({ client }: ClientHeaderProps) {
  const { setPage } = useNavigation();
  const { toast } = useToast();

  return (
    <div className="bg-paper border-b border-ink-150">
      <div className="px-8 pt-6 pb-4 max-w-[1480px] mx-auto">
        <button
          onClick={() => setPage("clients")}
          className="inline-flex items-center gap-1.5 text-[12.5px] text-ink-500 hover:text-ink-700 transition-colors mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Clients
        </button>

        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div className="flex items-start gap-4 min-w-0 flex-1">
            <Avatar name={client.name} size="lg" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-h1 text-ink-900">{client.name}</h1>
                <Badge tone="brand">{client.entity}</Badge>
                {client.flags.includes("anomaly") && <Badge tone="warn">Anomaly flagged</Badge>}
                {client.flags.includes("audit") && <Badge tone="danger">Audit risk</Badge>}
                {client.flags.includes("nexus") && <Badge tone="info">Nexus alert</Badge>}
              </div>
              <div className="flex items-center gap-4 mt-1.5 text-[12.5px] text-ink-500 flex-wrap">
                <span className="inline-flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5" /> {client.industry}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> {client.state}
                  {client.multiState.length > 1 && ` · +${client.multiState.length - 1}`}
                </span>
                <span>Owner · {client.ownerName}</span>
                <span>Founded {client.yearFounded}</span>
                <span>Advisor · {client.advisor}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="md"
              leftIcon={<Calendar className="h-4 w-4" />}
              onClick={() => toast({ kind: "info", title: "Schedule meeting", description: "Calendar dialog placeholder" })}
            >
              Schedule
            </Button>
            <Button
              variant="outline"
              size="md"
              leftIcon={<FileText className="h-4 w-4" />}
              onClick={() => toast({ kind: "success", title: "Generating report", description: "Annual Tax Planning Report is being prepared" })}
            >
              Generate report
            </Button>
            <Button
              variant="ai"
              size="md"
              leftIcon={<Sparkles className="h-4 w-4" />}
              onClick={() => toast({ kind: "info", title: "Ask Aragon Copilot", description: "Opening copilot panel" })}
            >
              Ask Copilot
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-5">
          <Stat label="Tax Risk" value={<RiskScore score={client.taxRiskScore} showLabel size="md" />} />
          <Stat
            label="Est. Liability"
            value={<span className="font-mono tabular text-ink-900 text-[18px] font-semibold">{formatCurrency(client.estimatedTaxLiability, { compact: true })}</span>}
            sub={`vs ${formatCurrency(client.priorYearLiability, { compact: true })} prior yr`}
          />
          <Stat
            label="YTD Revenue"
            value={<span className="font-mono tabular text-ink-900 text-[18px] font-semibold">{formatCurrency(client.ytdRevenue, { compact: true })}</span>}
            sub={`${client.netMarginPct.toFixed(1)}% net margin`}
          />
          <Stat
            label="Savings Identified"
            value={<span className="font-mono tabular text-success-ink text-[18px] font-semibold">+{formatCurrency(client.identifiedSavings, { compact: true })}</span>}
            sub={`${client.openStrategies} open strategies`}
          />
          <Stat
            label="Doc Readiness"
            value={
              <div className="flex items-center gap-2">
                <span className="font-mono tabular text-ink-900 text-[18px] font-semibold">{client.readinessPct}%</span>
                <div className="flex-1 h-1.5 bg-ink-100 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-500 rounded-full" style={{ width: `${client.readinessPct}%` }} />
                </div>
              </div>
            }
            sub={`Last touch · ${formatDate(client.lastTouch, { format: "rel" })}`}
          />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: React.ReactNode; sub?: string }) {
  return (
    <div>
      <div className="text-micro uppercase text-ink-400 mb-1">{label}</div>
      <div>{value}</div>
      {sub && <div className="text-[11px] text-ink-400 mt-0.5">{sub}</div>}
    </div>
  );
}
