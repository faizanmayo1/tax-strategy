export type AlertKind = "anomaly" | "nexus" | "deadline" | "missing-doc" | "strategy" | "audit";

export interface AlertItem {
  id: string;
  kind: AlertKind;
  severity: "info" | "warn" | "danger" | "ai";
  title: string;
  description: string;
  clientId?: string;
  clientName?: string;
  occurredAt: string;
  read: boolean;
}

const now = Date.now();

export const alerts: AlertItem[] = [
  {
    id: "al-001",
    kind: "anomaly",
    severity: "warn",
    title: "Duplicate vendor payment detected",
    description: "Halcyon Roastery: $4,820 to Costco Wholesale recorded twice on Mar 14 and Mar 15.",
    clientId: "c-001",
    clientName: "Halcyon Roastery & Co.",
    occurredAt: new Date(now - 24 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: "al-002",
    kind: "nexus",
    severity: "danger",
    title: "Multi-state nexus triggered — WA",
    description: "Halcyon Roastery crossed $100K WA economic-nexus threshold ($124K trailing 12 mo).",
    clientId: "c-001",
    clientName: "Halcyon Roastery & Co.",
    occurredAt: new Date(now - 3 * 3600 * 1000).toISOString(),
    read: false,
  },
  {
    id: "al-003",
    kind: "strategy",
    severity: "ai",
    title: "5 new strategies discovered overnight",
    description: "AI surfaced strategies across 4 clients · $268,400 estimated savings.",
    occurredAt: new Date(now - 5 * 3600 * 1000).toISOString(),
    read: false,
  },
  {
    id: "al-004",
    kind: "deadline",
    severity: "warn",
    title: "Q4 estimated tax payment in 5 days",
    description: "12 clients have Jan 15 estimated payments approaching.",
    occurredAt: new Date(now - 1 * 3600 * 1000).toISOString(),
    read: false,
  },
  {
    id: "al-005",
    kind: "missing-doc",
    severity: "info",
    title: "Wildwood Builders uploaded payroll register",
    description: "Document readiness updated 41% → 56%.",
    clientId: "c-003",
    clientName: "Wildwood Builders",
    occurredAt: new Date(now - 8 * 3600 * 1000).toISOString(),
    read: true,
  },
  {
    id: "al-006",
    kind: "audit",
    severity: "danger",
    title: "Audit risk score elevated for Granite Vale Realty",
    description: "Score moved 5.4 → 6.8 after Schedule E variance detected.",
    clientId: "c-006",
    clientName: "Granite Vale Realty",
    occurredAt: new Date(now - 14 * 3600 * 1000).toISOString(),
    read: true,
  },
  {
    id: "al-007",
    kind: "strategy",
    severity: "ai",
    title: "Cost segregation opportunity flagged",
    description: "Granite Vale Realty: $2.4M property → ~$184K year-1 deduction.",
    clientId: "c-006",
    clientName: "Granite Vale Realty",
    occurredAt: new Date(now - 18 * 3600 * 1000).toISOString(),
    read: true,
  },
  {
    id: "al-008",
    kind: "anomaly",
    severity: "warn",
    title: "Owner-paid expenses pattern detected",
    description: "Brightway Health: 287 personal-card business charges over 12 mo — accountable plan recommended.",
    clientId: "c-004",
    clientName: "Brightway Health Group",
    occurredAt: new Date(now - 22 * 3600 * 1000).toISOString(),
    read: true,
  },
];
