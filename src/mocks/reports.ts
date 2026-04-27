export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: "Tax Planning" | "CFO Brief" | "Compliance" | "Advisory";
  pages: number;
  sampleAudience: string;
}

export const reportTemplates: ReportTemplate[] = [
  {
    id: "tpl-tax-plan",
    name: "Annual Tax Planning Report",
    description: "Strategy summary, savings, before/after scenarios, implementation checklist.",
    category: "Tax Planning",
    pages: 14,
    sampleAudience: "Business owner",
  },
  {
    id: "tpl-cfo-brief",
    name: "Monthly CFO Brief",
    description: "Cash flow, P&L, working capital, runway, and CFO recommendations.",
    category: "CFO Brief",
    pages: 8,
    sampleAudience: "CEO / CFO",
  },
  {
    id: "tpl-meeting-prep",
    name: "Advisor Meeting Brief (1-pager)",
    description: "AI-generated talking points, opportunities, and questions for the upcoming meeting.",
    category: "Advisory",
    pages: 1,
    sampleAudience: "Advisor (internal)",
  },
  {
    id: "tpl-yearend",
    name: "Year-End Tax Optimization",
    description: "Last-mile strategies before Dec 31. Bonus timing, retirement, asset purchases.",
    category: "Tax Planning",
    pages: 6,
    sampleAudience: "Business owner",
  },
  {
    id: "tpl-audit",
    name: "Audit Risk Review",
    description: "Audit risk drivers, exposure, and mitigation plan with documentation checklist.",
    category: "Compliance",
    pages: 5,
    sampleAudience: "Owner + advisor",
  },
  {
    id: "tpl-entity",
    name: "Entity Restructure Recommendation",
    description: "Comparison of entity options, projected savings, implementation steps.",
    category: "Tax Planning",
    pages: 7,
    sampleAudience: "Business owner",
  },
];

export interface GeneratedReport {
  id: string;
  templateId: string;
  templateName: string;
  clientId: string;
  clientName: string;
  generatedAt: string;
  generatedBy: string;
  status: "draft" | "in-review" | "delivered";
  estimatedSavings?: number;
}

export const generatedReports: GeneratedReport[] = [
  {
    id: "rpt-001",
    templateId: "tpl-tax-plan",
    templateName: "Annual Tax Planning Report",
    clientId: "c-001",
    clientName: "Halcyon Roastery & Co.",
    generatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    generatedBy: "Adnan Karim",
    status: "in-review",
    estimatedSavings: 96_400,
  },
  {
    id: "rpt-002",
    templateId: "tpl-cfo-brief",
    templateName: "Monthly CFO Brief",
    clientId: "c-004",
    clientName: "Brightway Health Group",
    generatedAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    generatedBy: "Renée Dubois",
    status: "delivered",
  },
  {
    id: "rpt-003",
    templateId: "tpl-meeting-prep",
    templateName: "Advisor Meeting Brief (1-pager)",
    clientId: "c-002",
    clientName: "Fairhaven Logistics",
    generatedAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    generatedBy: "Priya Shah",
    status: "delivered",
  },
  {
    id: "rpt-004",
    templateId: "tpl-yearend",
    templateName: "Year-End Tax Optimization",
    clientId: "c-006",
    clientName: "Granite Vale Realty",
    generatedAt: new Date(Date.now() - 3 * 86_400 * 1000).toISOString(),
    generatedBy: "Renée Dubois",
    status: "draft",
    estimatedSavings: 118_000,
  },
  {
    id: "rpt-005",
    templateId: "tpl-entity",
    templateName: "Entity Restructure Recommendation",
    clientId: "c-003",
    clientName: "Wildwood Builders",
    generatedAt: new Date(Date.now() - 5 * 86_400 * 1000).toISOString(),
    generatedBy: "Marcus Lee",
    status: "delivered",
    estimatedSavings: 26_400,
  },
];

// Knowledge base for the Copilot
export interface KnowledgeArticle {
  id: string;
  title: string;
  category: "Strategy Playbook" | "Compliance" | "Internal Policy" | "Industry Guide";
  excerpt: string;
  source: string;
  tags: string[];
}

export const knowledgeBase: KnowledgeArticle[] = [
  {
    id: "kb-001",
    title: "Reasonable Compensation Benchmarking — S-Corp",
    category: "Strategy Playbook",
    excerpt:
      "Use BLS OEWS + RC Reports for industry-specific reasonable comp. Document a written analysis annually and adjust quarterly to defend during exam.",
    source: "Aragon Internal Playbook 04 · v2.3",
    tags: ["S-Corp", "Owner Comp", "Audit"],
  },
  {
    id: "kb-002",
    title: "Multi-State Nexus Decision Tree (Wayfair-era)",
    category: "Compliance",
    excerpt:
      "Sales-tax economic nexus thresholds vary by state. Most adopt $100K or 200 transactions. Income tax nexus also triggered by remote employee or property.",
    source: "Aragon Compliance Guide · 2024",
    tags: ["Nexus", "Multi-state"],
  },
  {
    id: "kb-003",
    title: "Augusta Rule §280A(g) Implementation Checklist",
    category: "Strategy Playbook",
    excerpt:
      "Rent personal residence to S-Corp/C-Corp up to 14 days/yr at FMV. Document business purpose, comparable rates, and issue 1099-MISC.",
    source: "Aragon Internal Playbook 12 · v1.4",
    tags: ["Augusta Rule", "Owner"],
  },
  {
    id: "kb-004",
    title: "Cost Segregation Studies — When They Pay Off",
    category: "Strategy Playbook",
    excerpt:
      "Properties >$500K typically yield 5–10% acceleration in year-1 deduction. Engineering-based studies hold up better than simplified.",
    source: "Aragon Internal Playbook 09 · v3.0",
    tags: ["Cost Seg", "Real Estate"],
  },
  {
    id: "kb-005",
    title: "Restaurant Industry — Common Deductions & Audit Triggers",
    category: "Industry Guide",
    excerpt:
      "Watch tip reporting accuracy, smallwares write-offs, and remodel vs. repair classification. Revenue per seat is a common audit benchmark.",
    source: "Aragon Industry Guide · Restaurants",
    tags: ["Restaurants", "Audit"],
  },
  {
    id: "kb-006",
    title: "Accountable Plan — Standard Adoption Resolution",
    category: "Internal Policy",
    excerpt:
      "Board-approved policy requiring substantiation within 60 days, reasonable connection to business, and return of excess advances. Sample template attached.",
    source: "Aragon Templates",
    tags: ["Accountable Plan", "Owner Comp"],
  },
];
