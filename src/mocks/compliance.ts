export type DeadlineType =
  | "Estimated Tax"
  | "Form Filing"
  | "Payroll Tax"
  | "Sales Tax"
  | "Entity Renewal"
  | "Advisory Meeting"
  | "1099 Issuance"
  | "Annual Report";

export interface Deadline {
  id: string;
  clientId: string;
  clientName: string;
  type: DeadlineType;
  title: string;
  dueDate: string; // ISO
  state?: string;
  status: "upcoming" | "due-soon" | "overdue" | "complete";
  assignedTo: string;
  amount?: number;
  notes?: string;
}

const STATES = ["CA", "NY", "TX", "FL", "WA", "IL", "MA", "CO"];
const ADVISORS = ["Adnan Karim", "Priya Shah", "Marcus Lee", "Renée Dubois"];

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

export const deadlines: Deadline[] = (() => {
  const out: Deadline[] = [];
  const now = Date.now();
  const types: DeadlineType[] = ["Estimated Tax", "Form Filing", "Payroll Tax", "Sales Tax", "Entity Renewal", "Advisory Meeting", "1099 Issuance", "Annual Report"];
  const titles: Record<DeadlineType, string> = {
    "Estimated Tax": "Q4 2024 estimated tax payment",
    "Form Filing": "Form 1120-S deadline",
    "Payroll Tax": "Form 941 quarterly filing",
    "Sales Tax": "State sales & use tax remittance",
    "Entity Renewal": "Statement of Information renewal",
    "Advisory Meeting": "Year-end planning meeting",
    "1099 Issuance": "1099-NEC issuance to contractors",
    "Annual Report": "Annual report filing",
  };

  const featured = ["c-001", "c-002", "c-003", "c-004", "c-005", "c-006", "c-007", "c-008"];
  let id = 1;
  featured.forEach((cid, i) => {
    types.forEach((t, j) => {
      const days = ((i * 5 + j * 3) % 60) - 12; // -12..+47
      const status: Deadline["status"] = days < 0 ? "overdue" : days < 5 ? "due-soon" : "upcoming";
      out.push({
        id: `d-${String(id++).padStart(4, "0")}`,
        clientId: cid,
        clientName: ["Halcyon Roastery & Co.", "Fairhaven Logistics", "Wildwood Builders", "Brightway Health Group", "Kestrel Robotics", "Granite Vale Realty", "Ash & Linden Apparel", "Beacon Hill Capital"][i],
        type: t,
        title: titles[t],
        dueDate: new Date(now + days * 86_400_000).toISOString(),
        state: pick(STATES, i + j),
        status,
        assignedTo: pick(ADVISORS, i + j),
        amount: t.includes("Tax") ? 4000 + ((i * j * 1300) % 80000) : undefined,
      });
    });
  });

  // Generic broader portfolio
  for (let i = 0; i < 60; i++) {
    const days = ((i * 7) % 90) - 5;
    const status: Deadline["status"] = days < 0 ? "overdue" : days < 7 ? "due-soon" : "upcoming";
    const t = types[i % types.length];
    out.push({
      id: `d-${String(id++).padStart(4, "0")}`,
      clientId: `c-${String(((i * 13) % 142) + 9).padStart(3, "0")}`,
      clientName: `Client #${((i * 13) % 142) + 9}`,
      type: t,
      title: titles[t],
      dueDate: new Date(now + days * 86_400_000).toISOString(),
      state: pick(STATES, i),
      status,
      assignedTo: pick(ADVISORS, i),
      amount: t.includes("Tax") ? 1000 + ((i * 700) % 25_000) : undefined,
    });
  }
  return out;
})();

export interface NexusAlert {
  id: string;
  clientId: string;
  clientName: string;
  state: string;
  triggerType: "Sales Threshold" | "Payroll" | "Property" | "New Hire" | "New Customer Concentration";
  triggerDetail: string;
  detectedAt: string;
  exposureEstimate: number;
  status: "new" | "investigating" | "registered" | "monitoring";
}

export const nexusAlerts: NexusAlert[] = [
  {
    id: "n-001",
    clientId: "c-001",
    clientName: "Halcyon Roastery & Co.",
    state: "WA",
    triggerType: "Sales Threshold",
    triggerDetail: "WA economic nexus crossed: $124K trailing 12 mo (threshold $100K).",
    detectedAt: new Date(Date.now() - 3 * 86_400_000).toISOString(),
    exposureEstimate: 14_200,
    status: "new",
  },
  {
    id: "n-002",
    clientId: "c-002",
    clientName: "Fairhaven Logistics",
    state: "AZ",
    triggerType: "Payroll",
    triggerDetail: "First W-2 employee hired in Phoenix, AZ. Triggers payroll + income tax registration.",
    detectedAt: new Date(Date.now() - 11 * 86_400_000).toISOString(),
    exposureEstimate: 8_400,
    status: "investigating",
  },
  {
    id: "n-003",
    clientId: "c-007",
    clientName: "Ash & Linden Apparel",
    state: "NV",
    triggerType: "Sales Threshold",
    triggerDetail: "NV gross receipts crossed $200K threshold.",
    detectedAt: new Date(Date.now() - 6 * 86_400_000).toISOString(),
    exposureEstimate: 5_600,
    status: "new",
  },
  {
    id: "n-004",
    clientId: "c-006",
    clientName: "Granite Vale Realty",
    state: "PA",
    triggerType: "Property",
    triggerDetail: "Property acquired in Allegheny County. PA franchise tax registration required.",
    detectedAt: new Date(Date.now() - 18 * 86_400_000).toISOString(),
    exposureEstimate: 22_400,
    status: "registered",
  },
  {
    id: "n-005",
    clientId: "c-005",
    clientName: "Kestrel Robotics",
    state: "CA",
    triggerType: "New Hire",
    triggerDetail: "Remote engineer in San Diego, CA — establishes payroll nexus.",
    detectedAt: new Date(Date.now() - 25 * 86_400_000).toISOString(),
    exposureEstimate: 6_800,
    status: "monitoring",
  },
];

// Entity comparator dataset
export interface EntityComparison {
  type: "Sole Prop" | "LLC" | "S-Corp" | "C-Corp" | "Partnership";
  selfEmploymentTax: number;
  federalTax: number;
  stateTax: number;
  totalTax: number;
  takeHome: number;
  auditRiskLevel: "Low" | "Medium" | "High";
  pros: string[];
  cons: string[];
}

export const entityComparison: EntityComparison[] = [
  {
    type: "Sole Prop",
    selfEmploymentTax: 36_400,
    federalTax: 58_200,
    stateTax: 17_800,
    totalTax: 112_400,
    takeHome: 125_600,
    auditRiskLevel: "High",
    pros: ["Simple setup", "No corporate filings"],
    cons: ["Full SE tax", "Higher audit risk", "No liability shield"],
  },
  {
    type: "LLC",
    selfEmploymentTax: 36_400,
    federalTax: 56_100,
    stateTax: 17_400,
    totalTax: 109_900,
    takeHome: 128_100,
    auditRiskLevel: "Medium",
    pros: ["Liability protection", "Flexible management"],
    cons: ["Default still SE-taxed", "No salary/distribution split"],
  },
  {
    type: "S-Corp",
    selfEmploymentTax: 18_400,
    federalTax: 53_800,
    stateTax: 16_900,
    totalTax: 89_100,
    takeHome: 148_900,
    auditRiskLevel: "Medium",
    pros: ["SE tax savings on distributions", "Reasonable comp opportunity"],
    cons: ["Reasonable comp scrutiny", "Payroll required"],
  },
  {
    type: "C-Corp",
    selfEmploymentTax: 0,
    federalTax: 50_000,
    stateTax: 21_400,
    totalTax: 71_400,
    takeHome: 166_600,
    auditRiskLevel: "Low",
    pros: ["Lowest direct tax", "Fringe benefits"],
    cons: ["Double taxation on dividends", "Higher complexity"],
  },
  {
    type: "Partnership",
    selfEmploymentTax: 36_400,
    federalTax: 55_200,
    stateTax: 17_100,
    totalTax: 108_700,
    takeHome: 129_300,
    auditRiskLevel: "Medium",
    pros: ["Pass-through", "Flexible allocations"],
    cons: ["SE tax on active partners", "K-1 complexity"],
  },
];
