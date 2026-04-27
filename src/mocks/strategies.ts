export type StrategyCategory =
  | "Entity Optimization"
  | "Accountable Plan"
  | "Retirement Planning"
  | "Owner Compensation"
  | "Home Office"
  | "Meals & Travel"
  | "Multi-State Tax"
  | "Asset / Cost Seg"
  | "Augusta Rule"
  | "Hire Family";

export type StrategyStatus = "identified" | "pending-approval" | "approved" | "delivered" | "realized";

export interface Strategy {
  id: string;
  clientId: string;
  category: StrategyCategory;
  title: string;
  rationale: string;
  estimatedSavings: number;
  confidence: number; // 0-100
  riskLevel: "Low" | "Medium" | "High";
  status: StrategyStatus;
  steps: string[];
  evidence: string[];
  identifiedAt: string;
}

const STRAT_TEMPLATES: Array<Omit<Strategy, "id" | "clientId" | "estimatedSavings" | "confidence" | "status" | "identifiedAt">> = [
  {
    category: "Owner Compensation",
    title: "Reduce S-Corp salary to reasonable comp benchmark",
    rationale: "Owner is paying themselves above the 75th-percentile industry benchmark. Reducing salary while maintaining reasonable comp shifts net income to distributions, lowering payroll tax exposure.",
    riskLevel: "Medium",
    steps: ["Run reasonable comp study", "Adjust quarterly payroll", "File amended 941 if mid-year"],
    evidence: ["W-2 wages: $312K", "Industry median: $215K", "Net income post-adjustment: $190K"],
  },
  {
    category: "Accountable Plan",
    title: "Implement accountable plan for owner-paid expenses",
    rationale: "Owner is paying $42K of business expenses personally. Accountable plan reimburses these tax-free and shifts deduction to S-Corp.",
    riskLevel: "Low",
    steps: ["Adopt board-approved accountable plan policy", "Categorize 12 months of personal-paid expenses", "Reimburse via payroll"],
    evidence: ["Personal cards: 287 business charges identified", "Total reimbursable: $42,150"],
  },
  {
    category: "Retirement Planning",
    title: "Establish solo 401(k) with profit-sharing",
    rationale: "S-Corp owner has no current retirement plan. A solo 401(k) with employer profit-sharing allows up to $69K (2024) in deferrals.",
    riskLevel: "Low",
    steps: ["Set up solo 401(k) plan documents", "Fund employee deferral by year-end", "Profit-share contribution by tax filing"],
    evidence: ["No Form 5500 filed", "W-2 wages support max contributions", "Plan setup deadline: Dec 31"],
  },
  {
    category: "Entity Optimization",
    title: "Convert sole proprietorship to S-Corp election",
    rationale: "Net SE income exceeds $175K. S-Corp election would eliminate ~$26K in self-employment tax annually with reasonable comp split.",
    riskLevel: "Medium",
    steps: ["File Form 2553 by Mar 15", "Set up payroll", "Amend operating agreement"],
    evidence: ["2023 Schedule C net: $238K", "Projected savings: $26,400/yr", "No employees on payroll yet"],
  },
  {
    category: "Home Office",
    title: "Activate home office deduction (regular method)",
    rationale: "Owner uses 340 sq ft (15% of home) exclusively for business. Regular method outperforms simplified by $4.2K based on actual costs.",
    riskLevel: "Low",
    steps: ["Document space photos and floor plan", "Compile utilities and insurance", "File Form 8829 with 1040"],
    evidence: ["Home: 2,260 sq ft total", "Office: 340 sq ft (15%)", "Allocable expenses: $28K"],
  },
  {
    category: "Meals & Travel",
    title: "Recategorize 142 meals from 100% deductible to 50%",
    rationale: "Bookkeeping recorded all client meals at 100%. Most do not meet de minimis exception. Correction prevents IRS adjustment risk.",
    riskLevel: "High",
    steps: ["Audit meal transactions", "Reclass per IRS Pub 463", "Update accounting policy"],
    evidence: ["Total meals: $48K", "Mistakenly 100%: $31K", "Should be 50%: $15.5K deductible"],
  },
  {
    category: "Multi-State Tax",
    title: "Register and file in NM and AZ for nexus exposure",
    rationale: "Revenue exceeded economic nexus thresholds in NM ($100K) and AZ ($150K). Voluntary disclosure agreement reduces back-tax penalties.",
    riskLevel: "High",
    steps: ["File VDA in NM", "File VDA in AZ", "Set up apportionment going forward"],
    evidence: ["NM revenue YTD: $186K", "AZ revenue YTD: $312K", "Estimated back-tax exposure: $24K"],
  },
  {
    category: "Asset / Cost Seg",
    title: "Cost segregation study on $2.4M property",
    rationale: "Building purchased Q1 2024. Cost seg accelerates ~30% of basis to 5/7/15 yr property. First-year bonus depreciation captures ~$184K deduction.",
    riskLevel: "Low",
    steps: ["Engage engineering-based cost seg firm", "Apply Form 3115 for in-service property", "Recognize accelerated depreciation"],
    evidence: ["Acquisition cost: $2.4M", "Allocable to 5/7/15 yr: ~$720K", "Year-1 deduction: $184K"],
  },
  {
    category: "Augusta Rule",
    title: "Apply §280A(g) Augusta Rule for board meetings",
    rationale: "S-Corp can rent owner's home up to 14 days/yr for business. Tax-free to owner, deductible to corp at fair market value.",
    riskLevel: "Medium",
    steps: ["Document business purpose for each rental day", "Establish FMV rental rate", "Issue 1099 to owner"],
    evidence: ["Comparable rate: $850/day", "14 days = $11,900 deduction", "Tax-free to owner"],
  },
  {
    category: "Hire Family",
    title: "Hire 16-year-old child for marketing/admin work",
    rationale: "Wages up to standard deduction ($14,600) are tax-free to child. Deductible to S-Corp. Funds Roth IRA potential.",
    riskLevel: "Low",
    steps: ["Document role and time logs", "Set up payroll for minor", "Pay reasonable wage"],
    evidence: ["Eligible wage: $12,000/yr", "Federal tax savings: $4,400", "Roth eligibility unlocked"],
  },
];

const TITLES_BY_CLIENT: Record<string, number[]> = {
  "c-001": [0, 1, 2, 5, 6],
  "c-002": [3, 6, 7, 9],
  "c-003": [4, 5, 7],
  "c-004": [0, 1, 2, 7, 8, 9],
  "c-005": [2, 4, 7, 9],
  "c-006": [6, 7, 8, 0, 1],
  "c-007": [6, 9, 4],
  "c-008": [2, 8],
};

function statusFromIndex(i: number): { status: StrategyStatus; identifiedAt: string } {
  const cycle: StrategyStatus[] = [
    "identified",
    "identified",
    "pending-approval",
    "approved",
    "delivered",
    "realized",
  ];
  const status = cycle[i % cycle.length];
  const days = (i * 11) % 90;
  return { status, identifiedAt: new Date(Date.now() - days * 86_400_000).toISOString() };
}

const result: Strategy[] = [];
let sid = 1;
for (const [clientId, indexes] of Object.entries(TITLES_BY_CLIENT)) {
  indexes.forEach((idx, n) => {
    const t = STRAT_TEMPLATES[idx];
    const baseSavings = [42_000, 18_500, 26_400, 32_000, 4_200, 15_500, 24_000, 184_000, 11_900, 4_400][idx];
    const variance = 0.7 + ((sid * 17) % 60) / 100; // 0.7..1.3
    const { status, identifiedAt } = statusFromIndex(sid + n);
    result.push({
      id: `s-${String(sid++).padStart(3, "0")}`,
      clientId,
      ...t,
      estimatedSavings: Math.round(baseSavings * variance),
      confidence: 60 + ((sid * 7) % 38),
      status,
      identifiedAt,
    });
  });
}

// extra portfolio-wide strategies (random clients)
for (let i = 0; i < 70; i++) {
  const tIdx = i % STRAT_TEMPLATES.length;
  const t = STRAT_TEMPLATES[tIdx];
  const baseSavings = [42_000, 18_500, 26_400, 32_000, 4_200, 15_500, 24_000, 184_000, 11_900, 4_400][tIdx];
  const variance = 0.6 + ((i * 13) % 80) / 100;
  const clientId = `c-${String(((i * 7) % 142) + 9).padStart(3, "0")}`;
  const { status, identifiedAt } = statusFromIndex(i);
  result.push({
    id: `s-${String(sid++).padStart(3, "0")}`,
    clientId,
    ...t,
    estimatedSavings: Math.round(baseSavings * variance),
    confidence: 55 + ((i * 11) % 42),
    status,
    identifiedAt,
  });
}

export const strategies: Strategy[] = result;

export function strategiesForClient(clientId: string) {
  return strategies.filter((s) => s.clientId === clientId);
}

export const strategyTotals = {
  identified: strategies.filter((s) => s.status === "identified").length,
  pending: strategies.filter((s) => s.status === "pending-approval").length,
  approved: strategies.filter((s) => s.status === "approved").length,
  delivered: strategies.filter((s) => s.status === "delivered").length,
  realized: strategies.filter((s) => s.status === "realized").length,
  totalIdentifiedSavings: strategies.reduce((sum, s) => sum + s.estimatedSavings, 0),
  totalRealizedSavings: strategies.filter((s) => s.status === "realized").reduce((sum, s) => sum + s.estimatedSavings, 0),
};
