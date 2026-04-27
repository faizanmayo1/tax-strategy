import { useMemo, useState } from "react";
import {
  CalendarClock,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Plus,
  ArrowRight,
  Filter,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Avatar } from "@/components/shared/Avatar";
import { useToast } from "@/app/providers/ToastProvider";
import { deadlines, nexusAlerts, type DeadlineType } from "@/mocks/compliance";
import { formatCurrency, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

const STATUS_TONE: Record<"upcoming" | "due-soon" | "overdue" | "complete", "neutral" | "warn" | "danger" | "success"> = {
  upcoming: "neutral",
  "due-soon": "warn",
  overdue: "danger",
  complete: "success",
};

export function CompliancePage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [type, setType] = useState<DeadlineType | "all">("all");

  const filtered = useMemo(() => {
    let r = deadlines;
    if (type !== "all") r = r.filter((d) => d.type === type);
    if (search) {
      const q = search.toLowerCase();
      r = r.filter((d) => d.clientName.toLowerCase().includes(q) || d.title.toLowerCase().includes(q));
    }
    return r.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [search, type]);

  const stats = useMemo(() => {
    const next7 = deadlines.filter((d) => {
      const days = (new Date(d.dueDate).getTime() - Date.now()) / 86_400_000;
      return days >= 0 && days <= 7;
    }).length;
    const overdue = deadlines.filter((d) => d.status === "overdue").length;
    const next30 = deadlines.filter((d) => {
      const days = (new Date(d.dueDate).getTime() - Date.now()) / 86_400_000;
      return days >= 0 && days <= 30;
    }).length;
    return { next7, overdue, next30, nexus: nexusAlerts.filter((n) => n.status === "new").length };
  }, []);

  const types: DeadlineType[] = [
    "Estimated Tax",
    "Form Filing",
    "Payroll Tax",
    "Sales Tax",
    "Entity Renewal",
    "Advisory Meeting",
    "1099 Issuance",
    "Annual Report",
  ];

  return (
    <div className="px-8 py-7 max-w-[1480px] mx-auto">
      <PageHeader
        title="Compliance & Entity"
        subtitle="Firm-wide deadlines, multi-state nexus, and entity advisory"
        actions={
          <>
            <Button variant="outline" size="md" leftIcon={<Plus className="h-4 w-4" />}>
              New deadline
            </Button>
            <Button size="md" onClick={() => toast({ kind: "success", title: "Reminders queued", description: "Email reminders scheduled for 23 clients" })}>
              Send reminders
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <Card padded>
          <div className="text-micro uppercase text-ink-400 mb-1">Overdue</div>
          <div className="text-display font-display text-danger-ink tabular">{stats.overdue}</div>
          <div className="text-[11.5px] text-ink-500 mt-1">requires escalation</div>
        </Card>
        <Card padded>
          <div className="text-micro uppercase text-ink-400 mb-1">Next 7 days</div>
          <div className="text-display font-display text-warn-ink tabular">{stats.next7}</div>
          <div className="text-[11.5px] text-ink-500 mt-1">act this week</div>
        </Card>
        <Card padded>
          <div className="text-micro uppercase text-ink-400 mb-1">Next 30 days</div>
          <div className="text-display font-display text-info-ink tabular">{stats.next30}</div>
          <div className="text-[11.5px] text-ink-500 mt-1">in pipeline</div>
        </Card>
        <Card padded>
          <div className="text-micro uppercase text-ink-400 mb-1">Open nexus alerts</div>
          <div className="text-display font-display text-accent-violet tabular">{stats.nexus}</div>
          <div className="text-[11.5px] text-ink-500 mt-1">multi-state exposure</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <Card padded={false} className="lg:col-span-2 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-ink-100 flex-wrap">
            <h3 className="text-h3 text-ink-900">Compliance Calendar</h3>
            <div className="flex-1" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search clients or deadlines"
              className="w-[260px]"
            />
            <Select
              value={type}
              onChange={(e) => setType(e.target.value as DeadlineType | "all")}
              options={[{ value: "all", label: "All types" }, ...types.map((t) => ({ value: t, label: t }))]}
            />
            <Button size="sm" variant="ghost" leftIcon={<Filter className="h-3.5 w-3.5" />}>
              More
            </Button>
          </div>
          <div className="max-h-[640px] overflow-y-auto">
            <table className="w-full text-[13px]">
              <thead className="sticky top-0">
                <tr className="text-[11px] font-semibold uppercase tracking-wider text-ink-400 border-b border-ink-150 bg-ink-50">
                  <th className="text-left font-semibold px-5 py-2.5">Due</th>
                  <th className="text-left font-semibold py-2.5">Type</th>
                  <th className="text-left font-semibold py-2.5">Client</th>
                  <th className="text-left font-semibold py-2.5">Title</th>
                  <th className="text-right font-semibold py-2.5">Amount</th>
                  <th className="text-left font-semibold py-2.5 px-3">Status</th>
                  <th className="text-left font-semibold py-2.5">Owner</th>
                  <th className="pr-5 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 30).map((d) => (
                  <tr key={d.id} className="border-b border-ink-100 last:border-0 hover:bg-ink-50 transition-colors">
                    <td className="px-5 py-3 text-ink-700 font-mono tabular text-[12px] whitespace-nowrap">
                      {formatDate(d.dueDate, { format: "rel" })}
                    </td>
                    <td className="py-3">
                      <Badge tone="neutral">{d.type}</Badge>
                    </td>
                    <td className="py-3 text-ink-900 font-medium truncate max-w-[200px]">{d.clientName}</td>
                    <td className="py-3 text-ink-700">{d.title}</td>
                    <td className="py-3 text-right font-mono tabular text-ink-900">
                      {d.amount ? formatCurrency(d.amount, { compact: true }) : <span className="text-ink-300">—</span>}
                    </td>
                    <td className="py-3 px-3">
                      <Badge tone={STATUS_TONE[d.status]} dot>
                        {d.status === "due-soon" ? "Due soon" : d.status[0].toUpperCase() + d.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <Avatar name={d.assignedTo} size="xs" />
                        <span className="text-[12px] text-ink-700">{d.assignedTo.split(" ")[0]}</span>
                      </div>
                    </td>
                    <td className="pr-5 py-3 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toast({ kind: "success", title: "Reminder sent", description: `${d.clientName} · ${d.title}` })}
                      >
                        Remind
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card padded>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-7 w-7 rounded bg-accent-violetBg flex items-center justify-center">
              <MapPin className="h-3.5 w-3.5 text-accent-violet" />
            </div>
            <h3 className="text-h3 text-ink-900">Multi-State Nexus Alerts</h3>
          </div>
          <ul className="space-y-3">
            {nexusAlerts.map((a) => (
              <li key={a.id} className="border border-ink-150 rounded-md p-3 hover:bg-ink-50 transition-colors cursor-pointer">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[14px] text-ink-900 font-semibold tabular">{a.state}</span>
                    <Badge
                      tone={a.status === "new" ? "danger" : a.status === "investigating" ? "warn" : a.status === "registered" ? "success" : "neutral"}
                      dot
                    >
                      {a.status}
                    </Badge>
                  </div>
                  <span className="text-[11px] text-ink-400">{formatDate(a.detectedAt, { format: "rel" })}</span>
                </div>
                <div className="text-[12.5px] font-medium text-ink-900">{a.clientName}</div>
                <div className="text-[11.5px] text-ink-500 mt-1 leading-snug">{a.triggerDetail}</div>
                <div className="mt-2 flex items-center justify-between text-[11.5px]">
                  <span className="text-ink-400">{a.triggerType}</span>
                  <span className="font-mono tabular text-warn-ink font-medium">
                    Exposure ~{formatCurrency(a.exposureEstimate, { compact: true })}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card padded>
        <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
          <div>
            <h3 className="text-h3 text-ink-900">Internal team automation</h3>
            <p className="text-small text-ink-500 mt-0.5">
              Active workflows for deadline coverage, escalations, and reminder cadence
            </p>
          </div>
          <Button size="sm" variant="outline" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
            Manage rules
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Automation
            icon={CalendarClock}
            title="Estimated tax · 14-day reminder"
            sub="Auto-emails owners 14 days before each Q payment."
            active
          />
          <Automation
            icon={AlertTriangle}
            title="Escalation · 48h overdue"
            sub="Pages assigned advisor + partner if a deadline goes 48h past due."
            active
          />
          <Automation
            icon={CheckCircle2}
            title="Auto-close · receipt logged"
            sub="Marks payroll + estimated tax deadlines complete on payment confirmation."
          />
        </div>
      </Card>
    </div>
  );
}

function Automation({ icon: Icon, title, sub, active }: { icon: any; title: string; sub: string; active?: boolean }) {
  return (
    <div className="border border-ink-150 rounded-md p-4 bg-ink-50">
      <div className="flex items-start justify-between gap-2">
        <div className="h-8 w-8 rounded bg-paper border border-ink-150 flex items-center justify-center">
          <Icon className="h-4 w-4 text-info-ink" />
        </div>
        <Badge tone={active ? "success" : "neutral"} dot>
          {active ? "Active" : "Idle"}
        </Badge>
      </div>
      <div className="text-[13px] font-semibold text-ink-900 mt-3">{title}</div>
      <div className={cn("text-[11.5px] text-ink-500 mt-1 leading-snug")}>{sub}</div>
    </div>
  );
}
