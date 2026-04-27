import { useMemo, useState } from "react";
import { Search, Filter, Download, Plus, ChevronRight, ChevronUp, ChevronDown, ArrowUpDown } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/shared/Avatar";
import { RiskScore, RiskBar } from "@/components/shared/RiskScore";
import { useNavigation } from "@/app/navigation";
import { useToast } from "@/app/providers/ToastProvider";
import { clients } from "@/mocks/clients";
import { formatCurrency, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

type SortKey = "name" | "taxRiskScore" | "estimatedTaxLiability" | "identifiedSavings" | "ytdRevenue" | "lastTouch";

export function ClientsPage() {
  const { openClient } = useNavigation();
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [advisor, setAdvisor] = useState("all");
  const [entity, setEntity] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("taxRiskScore");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const advisors = useMemo(() => Array.from(new Set(clients.map((c) => c.advisor))).sort(), []);
  const entities = useMemo(() => Array.from(new Set(clients.map((c) => c.entity))).sort(), []);

  const filtered = useMemo(() => {
    let r = clients;
    if (query) {
      const q = query.toLowerCase();
      r = r.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.ownerName.toLowerCase().includes(q) ||
          c.industry.toLowerCase().includes(q),
      );
    }
    if (advisor !== "all") r = r.filter((c) => c.advisor === advisor);
    if (entity !== "all") r = r.filter((c) => c.entity === entity);
    if (riskFilter === "high") r = r.filter((c) => c.taxRiskScore >= 7);
    if (riskFilter === "watch") r = r.filter((c) => c.taxRiskScore >= 4 && c.taxRiskScore < 7);
    if (riskFilter === "healthy") r = r.filter((c) => c.taxRiskScore < 4);

    r = [...r].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "string" && typeof bv === "string") {
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      const an = Number(av);
      const bn = Number(bv);
      return sortDir === "asc" ? an - bn : bn - an;
    });
    return r;
  }, [query, advisor, entity, riskFilter, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const high = filtered.filter((c) => c.taxRiskScore >= 7).length;
  const watch = filtered.filter((c) => c.taxRiskScore >= 4 && c.taxRiskScore < 7).length;
  const healthy = filtered.filter((c) => c.taxRiskScore < 4).length;

  return (
    <div className="px-8 py-7 max-w-[1480px] mx-auto">
      <PageHeader
        title="Clients"
        subtitle={`${clients.length} active business clients · sorted by tax risk`}
        breadcrumbs={[{ label: "Aragon Advisors" }, { label: "Clients" }]}
        actions={
          <>
            <Button variant="outline" size="md" leftIcon={<Download className="h-4 w-4" />} onClick={() => toast({ kind: "info", title: "Export started", description: "CSV will download in a moment" })}>
              Export
            </Button>
            <Button size="md" leftIcon={<Plus className="h-4 w-4" />} onClick={() => toast({ kind: "info", title: "Onboard new client", description: "Wizard placeholder for the demo" })}>
              Add client
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <Card padded>
          <div className="text-micro uppercase text-ink-400 mb-1">Total clients</div>
          <div className="text-display text-ink-900 font-display tabular">{filtered.length}</div>
          <div className="text-[11px] text-ink-500 mt-1">{filtered.length === clients.length ? "Showing all" : `Filtered from ${clients.length}`}</div>
        </Card>
        <Card padded>
          <div className="text-micro uppercase text-ink-400 mb-1">High risk</div>
          <div className="text-display text-danger-ink font-display tabular">{high}</div>
          <div className="text-[11px] text-ink-500 mt-1">Tax risk ≥ 7.0</div>
        </Card>
        <Card padded>
          <div className="text-micro uppercase text-ink-400 mb-1">Watch</div>
          <div className="text-display text-warn-ink font-display tabular">{watch}</div>
          <div className="text-[11px] text-ink-500 mt-1">Tax risk 4.0 – 6.9</div>
        </Card>
        <Card padded>
          <div className="text-micro uppercase text-ink-400 mb-1">Healthy</div>
          <div className="text-display text-success-ink font-display tabular">{healthy}</div>
          <div className="text-[11px] text-ink-500 mt-1">Tax risk &lt; 4.0</div>
        </Card>
      </div>

      <Card padded={false}>
        <div className="flex items-center gap-2 px-4 py-3 border-b border-ink-100 flex-wrap">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search clients, owners, industries…"
            leftIcon={<Search className="h-4 w-4" />}
            className="w-[300px]"
          />
          <Select
            value={advisor}
            onChange={(e) => setAdvisor(e.target.value)}
            options={[{ value: "all", label: "All advisors" }, ...advisors.map((a) => ({ value: a, label: a }))]}
          />
          <Select
            value={entity}
            onChange={(e) => setEntity(e.target.value)}
            options={[{ value: "all", label: "All entity types" }, ...entities.map((e) => ({ value: e, label: e }))]}
          />
          <Select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            options={[
              { value: "all", label: "All risk levels" },
              { value: "high", label: "High risk · ≥ 7.0" },
              { value: "watch", label: "Watch · 4.0–6.9" },
              { value: "healthy", label: "Healthy · < 4.0" },
            ]}
          />
          <div className="flex-1" />
          <Button variant="ghost" size="sm" leftIcon={<Filter className="h-3.5 w-3.5" />}>
            More filters
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[13.5px] min-w-[1100px]">
            <thead>
              <tr className="text-[11px] font-semibold uppercase tracking-wider text-ink-400 border-b border-ink-150 bg-ink-50">
                <Th sortable onClick={() => toggleSort("name")} active={sortKey === "name"} dir={sortDir}>
                  Client
                </Th>
                <Th>Entity / State</Th>
                <Th sortable onClick={() => toggleSort("taxRiskScore")} active={sortKey === "taxRiskScore"} dir={sortDir}>
                  Tax Risk
                </Th>
                <Th>Cash Flow</Th>
                <Th sortable onClick={() => toggleSort("estimatedTaxLiability")} active={sortKey === "estimatedTaxLiability"} dir={sortDir} align="right">
                  Tax Liability
                </Th>
                <Th sortable onClick={() => toggleSort("identifiedSavings")} active={sortKey === "identifiedSavings"} dir={sortDir} align="right">
                  Savings ID'd
                </Th>
                <Th>Advisor</Th>
                <Th sortable onClick={() => toggleSort("lastTouch")} active={sortKey === "lastTouch"} dir={sortDir} align="right">
                  Last Touch
                </Th>
                <Th />
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 60).map((c) => (
                <tr
                  key={c.id}
                  onClick={() => openClient(c.id, "tax-strategies")}
                  className="border-b border-ink-100 last:border-0 hover:bg-ink-50 transition-colors cursor-pointer group"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={c.name} size="sm" />
                      <div className="min-w-0">
                        <div className="font-medium text-ink-900 truncate">{c.name}</div>
                        <div className="text-[11.5px] text-ink-400 truncate">
                          {c.ownerName} · {c.industry}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="text-[12.5px] text-ink-700 font-medium">{c.entity}</div>
                    <div className="text-[11px] text-ink-400">
                      {c.state}
                      {c.multiState.length > 1 && ` · +${c.multiState.length - 1} states`}
                    </div>
                  </td>
                  <td className="py-3">
                    <RiskScore score={c.taxRiskScore} />
                  </td>
                  <td className="py-3 pr-4 w-[140px]">
                    <RiskBar score={c.cashFlowScore} />
                  </td>
                  <td className="py-3 text-right font-mono text-ink-900 tabular">
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
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <Avatar name={c.advisor} size="xs" />
                      <span className="text-[12px] text-ink-700">{c.advisor.split(" ")[0]}</span>
                    </div>
                  </td>
                  <td className="py-3 text-right pr-4 text-ink-500 text-[12px]">
                    {formatDate(c.lastTouch, { format: "rel" })}
                  </td>
                  <td className="pr-4 py-3 w-6 text-ink-300 group-hover:text-ink-700 transition-colors">
                    <ChevronRight className="h-4 w-4" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-ink-100 text-[12px] text-ink-500">
          <span>
            Showing <span className="font-mono tabular text-ink-700">1–{Math.min(60, filtered.length)}</span> of{" "}
            <span className="font-mono tabular text-ink-700">{filtered.length}</span>
          </span>
          <div className="flex items-center gap-2">
            <Badge tone="neutral">Page 1 / {Math.max(1, Math.ceil(filtered.length / 60))}</Badge>
            <Button size="sm" variant="ghost">Prev</Button>
            <Button size="sm" variant="outline">Next</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

interface ThProps {
  children?: React.ReactNode;
  sortable?: boolean;
  onClick?: () => void;
  active?: boolean;
  dir?: "asc" | "desc";
  align?: "left" | "right";
}

function Th({ children, sortable, onClick, active, dir, align = "left" }: ThProps) {
  return (
    <th
      className={cn(
        "px-4 py-2.5 font-semibold",
        align === "right" ? "text-right" : "text-left",
        sortable && "cursor-pointer hover:text-ink-700 select-none",
      )}
      onClick={onClick}
    >
      <span className={cn("inline-flex items-center gap-1", align === "right" && "justify-end")}>
        {children}
        {sortable &&
          (active ? (
            dir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
          ) : (
            <ArrowUpDown className="h-3 w-3 opacity-40" />
          ))}
      </span>
    </th>
  );
}
