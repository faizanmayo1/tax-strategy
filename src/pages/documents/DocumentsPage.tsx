import { useMemo, useState } from "react";
import {
  FileText,
  UploadCloud,
  Search,
  Download,
  AlertCircle,
  Check,
  Eye,
  CheckCheck,
  FolderInput,
  FilePlus,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Avatar } from "@/components/shared/Avatar";
import { useToast } from "@/app/providers/ToastProvider";
import { documents, readiness, portfolioReadiness } from "@/mocks/documents";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

const STATUS_TONE = {
  received: { tone: "info", label: "Received" },
  approved: { tone: "success", label: "Approved" },
  "needs-review": { tone: "warn", label: "Review" },
  missing: { tone: "danger", label: "Missing" },
} as const;

export function DocumentsPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | keyof typeof STATUS_TONE>("all");
  const [client, setClient] = useState<string>("all");

  const filtered = useMemo(() => {
    let r = documents;
    if (status !== "all") r = r.filter((d) => d.status === status);
    if (client !== "all") r = r.filter((d) => d.clientId === client);
    if (search) {
      const q = search.toLowerCase();
      r = r.filter((d) => d.name.toLowerCase().includes(q) || d.clientName.toLowerCase().includes(q));
    }
    return r;
  }, [search, status, client]);

  const clientOptions = [
    { value: "all", label: "All clients" },
    ...readiness.map((r) => ({ value: r.clientId, label: r.clientName })),
  ];

  return (
    <div className="px-8 py-7 max-w-[1480px] mx-auto">
      <PageHeader
        title="Documents · Tax Readiness"
        subtitle="Client-facing portal for prior returns, bookkeeping exports, and supporting documentation"
        actions={
          <>
            <Button variant="outline" size="md" leftIcon={<Download className="h-4 w-4" />}>
              Export
            </Button>
            <Button size="md" leftIcon={<UploadCloud className="h-4 w-4" />} onClick={() => toast({ kind: "info", title: "Upload window", description: "File picker placeholder for the demo" })}>
              Upload documents
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <Card padded>
          <div className="text-micro uppercase text-ink-400 mb-1">Avg readiness</div>
          <div className="text-display font-display text-ink-900 tabular">{portfolioReadiness.avgReadiness}%</div>
          <div className="text-[11.5px] text-ink-500 mt-1">across featured clients</div>
        </Card>
        <Card padded>
          <div className="text-micro uppercase text-ink-400 mb-1">Received</div>
          <div className="text-display font-display text-success-ink tabular">{portfolioReadiness.totalReceived}</div>
          <div className="text-[11.5px] text-ink-500 mt-1">verified or approved</div>
        </Card>
        <Card padded>
          <div className="text-micro uppercase text-ink-400 mb-1">Need review</div>
          <div className="text-display font-display text-warn-ink tabular">{portfolioReadiness.needsReview}</div>
          <div className="text-[11.5px] text-ink-500 mt-1">advisor sign-off pending</div>
        </Card>
        <Card padded>
          <div className="text-micro uppercase text-ink-400 mb-1">Missing</div>
          <div className="text-display font-display text-danger-ink tabular">{portfolioReadiness.totalMissing}</div>
          <div className="text-[11.5px] text-ink-500 mt-1">requested from clients</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <div className="lg:col-span-2 space-y-3">
          <Card padded>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <h3 className="text-h3 text-ink-900">Document tracker</h3>
              <div className="flex-1" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search documents…"
                leftIcon={<Search className="h-4 w-4" />}
                className="w-[260px]"
              />
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value as typeof status)}
                options={[
                  { value: "all", label: "All statuses" },
                  { value: "received", label: "Received" },
                  { value: "approved", label: "Approved" },
                  { value: "needs-review", label: "Needs review" },
                  { value: "missing", label: "Missing" },
                ]}
              />
              <Select
                value={client}
                onChange={(e) => setClient(e.target.value)}
                options={clientOptions}
              />
            </div>
            <div className="overflow-x-auto -mx-5">
              <table className="w-full text-[13px] min-w-[820px]">
                <thead>
                  <tr className="text-[11px] font-semibold uppercase tracking-wider text-ink-400 border-y border-ink-100 bg-ink-50">
                    <th className="text-left font-semibold px-5 py-2.5">Document</th>
                    <th className="text-left font-semibold py-2.5">Client</th>
                    <th className="text-left font-semibold py-2.5">Category</th>
                    <th className="text-left font-semibold py-2.5">Status</th>
                    <th className="text-left font-semibold py-2.5">Uploaded</th>
                    <th className="pr-5 py-2.5" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.slice(0, 22).map((d) => {
                    const meta = STATUS_TONE[d.status];
                    return (
                      <tr key={d.id} className="border-b border-ink-100 last:border-0 hover:bg-ink-50 transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="h-7 w-7 rounded bg-ink-100 flex items-center justify-center text-ink-500 shrink-0">
                              <FileText className="h-3.5 w-3.5" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-[13px] font-medium text-ink-900 truncate">{d.name}</div>
                              {d.size && <div className="text-[11px] text-ink-400">{d.size}</div>}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 text-ink-700">{d.clientName}</td>
                        <td className="py-3 text-ink-500 text-[12.5px]">{d.category}</td>
                        <td className="py-3">
                          <Badge tone={meta.tone} dot>
                            {meta.label}
                          </Badge>
                        </td>
                        <td className="py-3 text-[12px] text-ink-500">
                          {d.uploadedAt ? formatDate(d.uploadedAt, { format: "rel" }) : <span className="text-ink-300">—</span>}
                        </td>
                        <td className="pr-5 py-3 text-right">
                          {d.status === "missing" ? (
                            <Button size="sm" variant="ghost" onClick={() => toast({ kind: "info", title: "Reminder sent", description: `${d.clientName} · ${d.name}` })}>
                              Request
                            </Button>
                          ) : (
                            <Button size="sm" variant="ghost" leftIcon={<Eye className="h-3.5 w-3.5" />}>
                              View
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          <Card padded>
            <div className="flex items-center gap-2 mb-3">
              <FolderInput className="h-4 w-4 text-info-ink" />
              <h3 className="text-h3 text-ink-900">Drop files for any client</h3>
            </div>
            <button
              onClick={() => toast({ kind: "success", title: "AI tagging complete", description: "12 files categorized · readiness updated" })}
              className="w-full border-2 border-dashed border-ink-200 rounded-lg py-12 px-6 flex flex-col items-center text-center hover:border-brand-500 hover:bg-brand-100/30 transition-colors"
            >
              <UploadCloud className="h-8 w-8 text-ink-300 mb-2" />
              <div className="text-[14px] font-medium text-ink-900">Drop PDFs, images, or zip files here</div>
              <div className="text-[12px] text-ink-500 mt-1">
                AI auto-tags by client and category · supports up to 50 files at once
              </div>
            </button>
          </Card>
        </div>

        <Card padded>
          <h3 className="text-h3 text-ink-900 mb-3">Client readiness</h3>
          <ul className="space-y-3">
            {readiness.map((r) => (
              <li key={r.clientId} className="border border-ink-150 rounded-md p-3">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <Avatar name={r.clientName} size="xs" />
                    <span className="text-[12.5px] font-medium text-ink-900 truncate">{r.clientName}</span>
                  </div>
                  <span className={cn("text-[11.5px] font-mono tabular font-medium",
                    r.pct >= 80 ? "text-success-ink" : r.pct >= 50 ? "text-warn-ink" : "text-danger-ink",
                  )}>
                    {r.pct}%
                  </span>
                </div>
                <div className="h-1.5 bg-ink-100 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      r.pct >= 80 ? "bg-success" : r.pct >= 50 ? "bg-warn" : "bg-danger",
                    )}
                    style={{ width: `${r.pct}%` }}
                  />
                </div>
                <div className="flex items-center gap-3 mt-1.5 text-[10.5px] text-ink-500">
                  <span className="inline-flex items-center gap-1"><Check className="h-3 w-3 text-success-ink" /> {r.receivedDocs} received</span>
                  <span className="inline-flex items-center gap-1"><AlertCircle className="h-3 w-3 text-danger-ink" /> {r.missingDocs} missing</span>
                </div>
              </li>
            ))}
          </ul>
          <Button size="sm" variant="ghost" className="w-full mt-3" leftIcon={<CheckCheck className="h-3.5 w-3.5" />} onClick={() => toast({ kind: "success", title: "Reminders sent", description: `${readiness.length} clients notified` })}>
            Email reminder sweep
          </Button>
        </Card>
      </div>

      <Card padded>
        <div className="flex items-center gap-2 mb-3">
          <FilePlus className="h-4 w-4 text-accent-violet" />
          <h3 className="text-h3 text-ink-900">Auto-tag rules</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-small">
          {[
            { rule: "Filenames starting with `1120`", action: "Tag as Tax Returns / S-Corp" },
            { rule: "PDFs with Form 941 header", action: "Tag as Payroll · 941 quarterly" },
            { rule: "Documents > 50 MB", action: "Auto-compress + flag for archival" },
            { rule: "Bank statements (3+ pages)", action: "Tag as Bank Statements; OCR text" },
            { rule: "Insurance .pdf", action: "Tag as Other / Insurance · expires alerts" },
            { rule: "K-1 in filename", action: "Tag as Tax Returns / K-1" },
          ].map((r, i) => (
            <div key={i} className="border border-ink-150 rounded-md p-3 bg-ink-50">
              <div className="text-[11.5px] uppercase tracking-wide text-ink-400">If</div>
              <div className="text-[12.5px] text-ink-900">{r.rule}</div>
              <div className="text-[11.5px] uppercase tracking-wide text-ink-400 mt-2">Then</div>
              <div className="text-[12.5px] text-ink-900">{r.action}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
