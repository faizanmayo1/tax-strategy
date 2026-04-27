// Cash flow, P&L, budget vs actual, anomalies — per client (with global series for the dashboard)

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function rng(seed: number) {
  let x = seed;
  return () => {
    x = (x * 9301 + 49297) % 233280;
    return x / 233280;
  };
}

export interface CashFlowPoint {
  month: string;
  inflow: number;
  outflow: number;
  net: number;
  forecast?: boolean;
  confLo?: number;
  confHi?: number;
}

export function generateCashFlow(clientId: string, monthlyAvg: number): CashFlowPoint[] {
  const seed = clientId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const r = rng(seed);
  const points: CashFlowPoint[] = months.map((m, i) => {
    const seasonality = 1 + Math.sin(((i + 1) / 12) * Math.PI * 2) * 0.18;
    const inflow = Math.round(monthlyAvg * seasonality * (0.85 + r() * 0.30));
    const outflow = Math.round(inflow * (0.72 + r() * 0.20));
    const future = i >= 8;
    return {
      month: m,
      inflow,
      outflow,
      net: inflow - outflow,
      forecast: future,
      confLo: future ? Math.round((inflow - outflow) * 0.78) : undefined,
      confHi: future ? Math.round((inflow - outflow) * 1.22) : undefined,
    };
  });
  return points;
}

export interface ScenarioInput {
  revenueDelta: number; // %
  expenseDelta: number; // %
  payrollDelta: number; // %
  retirementContribution: number; // $
  bonusTimingShift: "current" | "next-year";
  s_corp_salary_reduction: number; // $
  cost_seg_deduction: number; // $
}

export function defaultScenario(): ScenarioInput {
  return {
    revenueDelta: 25,
    expenseDelta: 8,
    payrollDelta: 0,
    retirementContribution: 69_000,
    bonusTimingShift: "next-year",
    s_corp_salary_reduction: 80_000,
    cost_seg_deduction: 184_000,
  };
}

export interface ScenarioOutcome {
  baselineLiability: number;
  optimizedLiability: number;
  savings: number;
  effectiveRateBaseline: number;
  effectiveRateOptimized: number;
  federalSavings: number;
  stateSavings: number;
  ssMedicareSavings: number;
  riskFlag: "low" | "medium" | "high";
}

export function calculateScenario(baseRevenue: number, baseExpenses: number, input: ScenarioInput): ScenarioOutcome {
  const baselineRevenue = baseRevenue;
  const baselineExpenses = baseExpenses;
  const baselineNet = baselineRevenue - baselineExpenses;
  const baselineLiability = Math.round(baselineNet * 0.32);

  const newRevenue = baselineRevenue * (1 + input.revenueDelta / 100);
  const newExpenses = baselineExpenses * (1 + input.expenseDelta / 100);
  const additionalDeductions =
    input.retirementContribution +
    input.cost_seg_deduction +
    (input.bonusTimingShift === "next-year" ? 45_000 : 0);
  const ssMedicareSavings = Math.round(input.s_corp_salary_reduction * 0.153);
  const newNet = newRevenue - newExpenses - additionalDeductions;
  const optimizedLiability = Math.max(0, Math.round(newNet * 0.30) - ssMedicareSavings);
  const savings = baselineLiability - optimizedLiability;
  const federalSavings = Math.round(savings * 0.78);
  const stateSavings = Math.round(savings * 0.22);

  return {
    baselineLiability,
    optimizedLiability,
    savings,
    effectiveRateBaseline: +(baselineLiability / baselineRevenue * 100).toFixed(1),
    effectiveRateOptimized: +(optimizedLiability / newRevenue * 100).toFixed(1),
    federalSavings,
    stateSavings,
    ssMedicareSavings,
    riskFlag: input.s_corp_salary_reduction > 100_000 ? "medium" : "low",
  };
}

export interface AnomalyTxn {
  id: string;
  clientId: string;
  date: string;
  vendor: string;
  amount: number;
  category: string;
  flag: "duplicate" | "miscategorized" | "missing-receipt" | "owner-draw" | "variance" | "personal";
  severity: "low" | "medium" | "high";
  suggestedFix: string;
}

const VENDORS = [
  "Uber", "AmEx Travel", "Costco Wholesale", "Brex", "Office Depot", "Amazon", "Delta Airlines",
  "Marriott Hotels", "Stripe", "Shopify", "Square", "Quill", "Apple", "Verizon",
  "Whole Foods", "Hertz", "United Airlines", "Sysco", "ADT Security", "AT&T",
];
const CATEGORIES = ["Meals & Entertainment", "Office Supplies", "Travel", "Vehicle", "Insurance", "Owner Draw", "Software", "Telecom"];

export function generateAnomalies(clientId: string, count = 14): AnomalyTxn[] {
  const seed = clientId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const r = rng(seed);
  const flags: AnomalyTxn["flag"][] = ["duplicate", "miscategorized", "missing-receipt", "owner-draw", "variance", "personal"];
  const sev: AnomalyTxn["severity"][] = ["low", "medium", "high"];
  return Array.from({ length: count }, (_, i) => {
    const flag = flags[i % flags.length];
    const sevPick = sev[Math.floor(r() * sev.length)];
    const amount = Math.round((r() * 6800 + 80) * 100) / 100;
    return {
      id: `a-${clientId}-${i}`,
      clientId,
      date: new Date(Date.now() - Math.floor(r() * 60) * 86_400_000).toISOString().slice(0, 10),
      vendor: VENDORS[Math.floor(r() * VENDORS.length)],
      amount,
      category: CATEGORIES[Math.floor(r() * CATEGORIES.length)],
      flag,
      severity: sevPick,
      suggestedFix: suggestFix(flag),
    };
  });
}

function suggestFix(flag: AnomalyTxn["flag"]): string {
  switch (flag) {
    case "duplicate": return "Likely duplicate of prior week's entry — recommend deletion.";
    case "miscategorized": return "Recategorize from Office Supplies → Meals (50% deductible).";
    case "missing-receipt": return "Request receipt from owner; flag for substantiation.";
    case "owner-draw": return "Reclass from Owner Draw to Distribution — affects basis tracking.";
    case "variance": return "Variance >2σ vs. trailing 6 months — confirm with owner.";
    case "personal": return "Likely personal expense; remove from books or add to draw.";
  }
}

export interface BudgetVsActualPoint {
  month: string;
  budget: number;
  actual: number;
}

export function generateBudgetVsActual(clientId: string, monthlyBudget: number): BudgetVsActualPoint[] {
  const seed = clientId.split("").reduce((a, c) => a + c.charCodeAt(0), 0) + 7;
  const r = rng(seed);
  return months.slice(0, 9).map((m) => {
    const variance = 0.85 + r() * 0.30;
    return { month: m, budget: monthlyBudget, actual: Math.round(monthlyBudget * variance) };
  });
}

// portfolio-wide trends
export const portfolioTaxExposure: Array<{ month: string; revenue: number; liability: number }> = months.map((m, i) => ({
  month: m,
  revenue: 480 + i * 12 + Math.sin(i / 2) * 22,
  liability: 96 + i * 3 + Math.cos(i / 1.5) * 6,
}));

export const cashFlowDistribution = [
  { bucket: "Healthy 8-10", count: 76 },
  { bucket: "Stable 6-8", count: 41 },
  { bucket: "Watch 4-6", count: 22 },
  { bucket: "Risk 2-4", count: 9 },
  { bucket: "Critical 0-2", count: 2 },
];
