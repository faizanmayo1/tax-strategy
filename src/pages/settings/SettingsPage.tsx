import { useState } from "react";
import { Plug, Users, Lock, ScrollText, Building2, Check, AlertCircle, Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/shared/Avatar";
import { useToast } from "@/app/providers/ToastProvider";
import { cn } from "@/lib/utils";

type Tab = "integrations" | "team" | "permissions" | "audit" | "firm";

export function SettingsPage() {
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>("integrations");

  return (
    <div className="px-8 py-7 max-w-[1480px] mx-auto">
      <PageHeader
        title="Workspace settings"
        subtitle="Aragon Advisors · Enterprise plan · 4 partners · 12 staff"
      />

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-5">
        <nav className="bg-paper border border-ink-150 rounded-lg shadow-sm p-2 h-fit sticky top-20">
          <SettingsNav active={tab} onChange={setTab} />
        </nav>

        <div className="space-y-5">
          {tab === "integrations" && <IntegrationsTab toast={toast} />}
          {tab === "team" && <TeamTab />}
          {tab === "permissions" && <PermissionsTab />}
          {tab === "audit" && <AuditTab />}
          {tab === "firm" && <FirmTab />}
        </div>
      </div>
    </div>
  );
}

function SettingsNav({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  const items: { id: Tab; label: string; icon: any }[] = [
    { id: "integrations", label: "Integrations", icon: Plug },
    { id: "team", label: "Team & roles", icon: Users },
    { id: "permissions", label: "Permissions", icon: Lock },
    { id: "audit", label: "Audit log", icon: ScrollText },
    { id: "firm", label: "Firm profile", icon: Building2 },
  ];
  return (
    <ul className="space-y-1">
      {items.map((i) => (
        <li key={i.id}>
          <button
            onClick={() => onChange(i.id)}
            className={cn(
              "w-full flex items-center gap-2 h-9 px-3 rounded-md text-[13px] transition-colors",
              active === i.id ? "bg-brand-100/60 text-brand-700 font-medium" : "text-ink-700 hover:bg-ink-50",
            )}
          >
            <i.icon className="h-4 w-4" />
            {i.label}
          </button>
        </li>
      ))}
    </ul>
  );
}

const INTEGRATIONS = [
  { name: "QuickBooks Online", category: "Bookkeeping", connected: true, accounts: 142 },
  { name: "Xero", category: "Bookkeeping", connected: true, accounts: 8 },
  { name: "Gusto", category: "Payroll", connected: true, accounts: 96 },
  { name: "ADP Run", category: "Payroll", connected: false, accounts: 0 },
  { name: "Plaid", category: "Bank feeds", connected: true, accounts: 138 },
  { name: "Drake Tax", category: "Tax software", connected: true, accounts: 150 },
  { name: "Lacerte", category: "Tax software", connected: false, accounts: 0 },
  { name: "Google Drive", category: "Documents", connected: true, accounts: 1 },
  { name: "DocuSign", category: "Signatures", connected: true, accounts: 1 },
];

function IntegrationsTab({ toast }: { toast: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {INTEGRATIONS.map((i) => (
        <Card key={i.name} padded>
          <div className="flex items-start justify-between mb-3">
            <div className="h-10 w-10 rounded bg-ink-100 flex items-center justify-center text-[14px] font-bold text-ink-700">
              {i.name[0]}
            </div>
            <Badge tone={i.connected ? "success" : "neutral"} dot>
              {i.connected ? "Connected" : "Not connected"}
            </Badge>
          </div>
          <div className="text-[14px] font-semibold text-ink-900">{i.name}</div>
          <div className="text-[11.5px] text-ink-500 mb-3">{i.category}</div>
          <div className="text-[11.5px] text-ink-500">
            {i.connected ? <span><span className="font-mono tabular text-ink-900">{i.accounts}</span> client accounts synced</span> : "Set up to enable sync"}
          </div>
          <Button
            size="sm"
            variant={i.connected ? "outline" : "primary"}
            className="w-full mt-3"
            onClick={() => toast({ kind: "success", title: i.connected ? "Re-syncing" : "Connection started", description: i.name })}
          >
            {i.connected ? "Manage" : "Connect"}
          </Button>
        </Card>
      ))}
    </div>
  );
}

function TeamTab() {
  const team = [
    { name: "Adnan Karim", role: "Managing Partner", email: "adnan@aragonadvisors.com", clients: 38, status: "active" },
    { name: "Priya Shah", role: "Senior Tax Strategist", email: "priya@aragonadvisors.com", clients: 42, status: "active" },
    { name: "Marcus Lee", role: "CFO Advisor", email: "marcus@aragonadvisors.com", clients: 36, status: "active" },
    { name: "Renée Dubois", role: "Senior Advisor", email: "renee@aragonadvisors.com", clients: 34, status: "active" },
    { name: "Omar Bennett", role: "Bookkeeping Lead", email: "omar@aragonadvisors.com", clients: 0, status: "active" },
    { name: "Sara Voss", role: "Junior Advisor", email: "sara@aragonadvisors.com", clients: 8, status: "pending" },
  ];
  return (
    <Card padded={false}>
      <div className="flex items-center justify-between p-5 pb-3">
        <div>
          <h3 className="text-h3 text-ink-900">Team & roles</h3>
          <p className="text-small text-ink-500 mt-0.5">{team.length} active members · Invite or manage role assignments</p>
        </div>
        <Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>
          Invite member
        </Button>
      </div>
      <table className="w-full text-[13px]">
        <thead>
          <tr className="text-[11px] font-semibold uppercase tracking-wider text-ink-400 border-y border-ink-100 bg-ink-50">
            <th className="text-left font-semibold px-5 py-2.5">Name</th>
            <th className="text-left font-semibold py-2.5">Role</th>
            <th className="text-left font-semibold py-2.5">Email</th>
            <th className="text-right font-semibold py-2.5">Clients</th>
            <th className="text-left font-semibold py-2.5 px-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {team.map((m, i) => (
            <tr key={i} className="border-b border-ink-100 last:border-0 hover:bg-ink-50">
              <td className="px-5 py-3">
                <div className="flex items-center gap-2.5">
                  <Avatar name={m.name} size="sm" />
                  <span className="font-medium text-ink-900">{m.name}</span>
                </div>
              </td>
              <td className="py-3 text-ink-700">{m.role}</td>
              <td className="py-3 text-ink-500">{m.email}</td>
              <td className="py-3 text-right font-mono tabular text-ink-700">{m.clients}</td>
              <td className="py-3 px-3">
                <Badge tone={m.status === "active" ? "success" : "warn"} dot>
                  {m.status === "active" ? "Active" : "Pending invite"}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function PermissionsTab() {
  const matrix = [
    { feature: "View all clients", partner: true, advisor: true, staff: false, client: false },
    { feature: "Approve tax strategies", partner: true, advisor: false, staff: false, client: false },
    { feature: "Run portfolio scan", partner: true, advisor: true, staff: false, client: false },
    { feature: "Edit bookkeeping fixes", partner: true, advisor: true, staff: true, client: false },
    { feature: "Generate reports", partner: true, advisor: true, staff: true, client: false },
    { feature: "Upload documents", partner: true, advisor: true, staff: true, client: true },
    { feature: "View own reports only", partner: false, advisor: false, staff: false, client: true },
    { feature: "Invite team members", partner: true, advisor: false, staff: false, client: false },
  ];
  return (
    <Card padded={false}>
      <div className="p-5 pb-3">
        <h3 className="text-h3 text-ink-900">Role-based permissions</h3>
        <p className="text-small text-ink-500 mt-0.5">Default matrix · custom overrides per user available</p>
      </div>
      <table className="w-full text-[13px]">
        <thead>
          <tr className="text-[11px] font-semibold uppercase tracking-wider text-ink-400 border-y border-ink-100 bg-ink-50">
            <th className="text-left font-semibold px-5 py-2.5">Capability</th>
            <th className="text-center font-semibold py-2.5">Partner</th>
            <th className="text-center font-semibold py-2.5">Advisor</th>
            <th className="text-center font-semibold py-2.5">Staff</th>
            <th className="text-center font-semibold py-2.5 pr-5">Client (portal)</th>
          </tr>
        </thead>
        <tbody>
          {matrix.map((m, i) => (
            <tr key={i} className="border-b border-ink-100 last:border-0">
              <td className="px-5 py-2.5 text-ink-900">{m.feature}</td>
              <PermCell on={m.partner} />
              <PermCell on={m.advisor} />
              <PermCell on={m.staff} />
              <PermCell on={m.client} className="pr-5" />
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function PermCell({ on, className }: { on: boolean; className?: string }) {
  return (
    <td className={cn("py-2.5 text-center", className)}>
      {on ? (
        <span className="inline-flex h-5 w-5 rounded-full bg-success-bg text-success-ink items-center justify-center">
          <Check className="h-3 w-3" />
        </span>
      ) : (
        <span className="inline-block h-1 w-3 bg-ink-200 rounded-full" />
      )}
    </td>
  );
}

function AuditTab() {
  const log = [
    { who: "Adnan Karim", action: "Approved strategy s-128 (Cost segregation)", target: "Granite Vale Realty", when: "2 min ago" },
    { who: "Priya Shah", action: "Generated report rpt-003 (Meeting brief)", target: "Fairhaven Logistics", when: "45 min ago" },
    { who: "Aragon Copilot", action: "Answered query — entity restructure ranked clients", target: "Internal", when: "1 hr ago" },
    { who: "Renée Dubois", action: "Delivered report rpt-002 (CFO Brief)", target: "Brightway Health Group", when: "3 hr ago" },
    { who: "System", action: "Portfolio scan completed · 5 strategies surfaced", target: "Aragon Advisors", when: "5 hr ago" },
    { who: "Marcus Lee", action: "Reclassified 12 transactions in bookkeeping", target: "Wildwood Builders", when: "Yesterday" },
    { who: "System", action: "Multi-state nexus alert raised — WA", target: "Halcyon Roastery", when: "Yesterday" },
  ];
  return (
    <Card padded>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-h3 text-ink-900">Audit log</h3>
          <p className="text-small text-ink-500 mt-0.5">All actions · timestamped · immutable</p>
        </div>
        <Badge tone="info">SOC 2 controls</Badge>
      </div>
      <ul className="space-y-2.5">
        {log.map((l, i) => (
          <li key={i} className="flex items-start gap-3 border-b border-ink-100 pb-2.5 last:border-0">
            <Avatar name={l.who} size="xs" />
            <div className="min-w-0 flex-1">
              <div className="text-[13px] text-ink-900">
                <span className="font-medium">{l.who}</span> · {l.action}
              </div>
              <div className="text-[11.5px] text-ink-500 mt-0.5">{l.target}</div>
            </div>
            <span className="text-[11px] text-ink-400 shrink-0">{l.when}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function FirmTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Card padded>
        <h3 className="text-h3 text-ink-900 mb-3">Firm profile</h3>
        <FirmRow label="Firm name" value="Aragon Advisors" />
        <FirmRow label="Plan" value="Enterprise" />
        <FirmRow label="Active clients" value="150" />
        <FirmRow label="Founded" value="2014" />
        <FirmRow label="Compliance" value="SOC 2 · GLBA aligned" />
        <FirmRow label="Region" value="United States" />
      </Card>
      <Card padded>
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle className="h-4 w-4 text-warn-ink" />
          <h3 className="text-h3 text-ink-900">Pilot agreement</h3>
        </div>
        <p className="text-small text-ink-500 leading-relaxed mb-4">
          You're enrolled in Aragon's pilot program through Aug 2024. After pilot, your seats and integrations carry forward
          automatically.
        </p>
        <Button size="sm" variant="outline">
          Review agreement
        </Button>
      </Card>
    </div>
  );
}

function FirmRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-ink-100 last:border-0 py-2.5">
      <span className="text-[12.5px] text-ink-500">{label}</span>
      <span className="text-[13px] text-ink-900 font-medium tabular">{value}</span>
    </div>
  );
}
