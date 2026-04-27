export type DocStatus = "received" | "missing" | "needs-review" | "approved";

export interface DocItem {
  id: string;
  clientId: string;
  clientName: string;
  category: "Tax Returns" | "Bookkeeping" | "Bank Statements" | "Payroll" | "Entity" | "Other";
  name: string;
  status: DocStatus;
  uploadedAt?: string;
  size?: string;
  uploader?: string;
}

export interface ClientReadiness {
  clientId: string;
  clientName: string;
  pct: number;
  totalDocs: number;
  receivedDocs: number;
  missingDocs: number;
  lastActivity: string;
}

const FEATURED = [
  { id: "c-001", name: "Halcyon Roastery & Co." },
  { id: "c-002", name: "Fairhaven Logistics" },
  { id: "c-003", name: "Wildwood Builders" },
  { id: "c-004", name: "Brightway Health Group" },
  { id: "c-005", name: "Kestrel Robotics" },
  { id: "c-006", name: "Granite Vale Realty" },
  { id: "c-007", name: "Ash & Linden Apparel" },
  { id: "c-008", name: "Beacon Hill Capital" },
];

const CHECKLIST: Array<{ category: DocItem["category"]; name: string }> = [
  { category: "Tax Returns", name: "2023 Form 1120-S (S-Corp return)" },
  { category: "Tax Returns", name: "2023 Schedule K-1" },
  { category: "Bookkeeping", name: "QuickBooks YTD P&L" },
  { category: "Bookkeeping", name: "QuickBooks Balance Sheet" },
  { category: "Bookkeeping", name: "General Ledger detail" },
  { category: "Bank Statements", name: "Operating account · Q1–Q3" },
  { category: "Bank Statements", name: "Savings account · Q1–Q3" },
  { category: "Bank Statements", name: "Credit card statements" },
  { category: "Payroll", name: "Payroll register YTD" },
  { category: "Payroll", name: "Form 941 Q1, Q2, Q3" },
  { category: "Payroll", name: "W-2 / 1099 worksheet" },
  { category: "Entity", name: "Articles of Organization" },
  { category: "Entity", name: "Operating Agreement" },
  { category: "Other", name: "Insurance policy declarations" },
];

let did = 1;
const documents: DocItem[] = [];
const readiness: ClientReadiness[] = [];

FEATURED.forEach((c, ci) => {
  let recv = 0;
  let miss = 0;
  CHECKLIST.forEach((d, i) => {
    const score = (ci * 7 + i * 11) % 10;
    let status: DocStatus = "received";
    if (score === 9) status = "missing";
    else if (score === 4) status = "needs-review";
    else if (score === 0) status = "approved";

    const uploadedAt =
      status === "missing"
        ? undefined
        : new Date(Date.now() - ((ci * 5 + i) % 30) * 86_400_000).toISOString();
    if (status === "missing") miss++;
    else recv++;

    documents.push({
      id: `doc-${String(did++).padStart(4, "0")}`,
      clientId: c.id,
      clientName: c.name,
      category: d.category,
      name: d.name,
      status,
      uploadedAt,
      size: status !== "missing" ? `${(0.4 + ((i * 3) % 12) / 4).toFixed(1)} MB` : undefined,
      uploader: status !== "missing" ? c.name.split(" ")[0] + " (Owner)" : undefined,
    });
  });

  readiness.push({
    clientId: c.id,
    clientName: c.name,
    pct: Math.round((recv / CHECKLIST.length) * 100),
    totalDocs: CHECKLIST.length,
    receivedDocs: recv,
    missingDocs: miss,
    lastActivity: new Date(Date.now() - (ci * 3) * 86_400_000).toISOString(),
  });
});

export { documents, readiness };

export const portfolioReadiness = {
  avgReadiness: Math.round(readiness.reduce((sum, r) => sum + r.pct, 0) / readiness.length),
  totalMissing: documents.filter((d) => d.status === "missing").length,
  totalReceived: documents.filter((d) => d.status === "received" || d.status === "approved").length,
  needsReview: documents.filter((d) => d.status === "needs-review").length,
};
