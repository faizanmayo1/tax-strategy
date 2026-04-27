export type EntityType = "Sole Prop" | "LLC" | "S-Corp" | "C-Corp" | "Partnership";
export type Industry =
  | "E-commerce"
  | "Professional Services"
  | "Real Estate"
  | "Healthcare"
  | "Construction"
  | "Manufacturing"
  | "Technology"
  | "Restaurants"
  | "Logistics"
  | "Consulting";

export interface Client {
  id: string;
  name: string;
  industry: Industry;
  entity: EntityType;
  state: string;
  multiState: string[];
  yearFounded: number;
  ownerName: string;
  advisor: string;
  taxRiskScore: number; // 0-10 (higher = riskier)
  cashFlowScore: number; // 0-10 (higher = healthier)
  bookkeepingScore: number; // 0-10 (higher = healthier)
  auditRiskScore: number; // 0-10 (higher = riskier)
  estimatedTaxLiability: number; // current year
  priorYearLiability: number;
  ytdRevenue: number;
  priorYearRevenue: number;
  netMarginPct: number;
  identifiedSavings: number;
  realizedSavings: number;
  openStrategies: number;
  flags: ("missing-docs" | "anomaly" | "deadline" | "nexus" | "audit")[];
  lastTouch: string; // ISO date
  readinessPct: number;
  priorityRank: number; // 1-10 (1 = highest priority)
}

const ADVISORS = ["Adnan Karim", "Priya Shah", "Marcus Lee", "Renée Dubois"];
const INDUSTRIES: Industry[] = [
  "E-commerce",
  "Professional Services",
  "Real Estate",
  "Healthcare",
  "Construction",
  "Manufacturing",
  "Technology",
  "Restaurants",
  "Logistics",
  "Consulting",
];
const ENTITIES: EntityType[] = ["Sole Prop", "LLC", "S-Corp", "C-Corp", "Partnership"];
const STATES = ["CA", "NY", "TX", "FL", "WA", "IL", "MA", "CO", "GA", "OR", "NC", "AZ", "MN", "VA", "PA"];
const FIRST_NAMES = [
  "Jordan", "Casey", "Alex", "Riley", "Morgan", "Taylor", "Drew", "Cameron", "Quinn", "Avery",
  "Hassan", "Nadia", "Sofia", "Leila", "Diego", "Camila", "Mateo", "Aisha", "Liam", "Zara",
  "Ethan", "Maya", "Noah", "Olivia", "Lucas", "Emma", "Ava", "Mia", "Ben", "Ella",
];
const LAST_NAMES = [
  "Patel", "Okonkwo", "Nguyen", "Garcia", "Rivera", "Cohen", "Park", "Singh", "Hassan", "Kim",
  "Mendez", "Ferraro", "Larsson", "Adebayo", "Wong", "Reyes", "Brennan", "Tanaka", "Morales", "Walsh",
];
const CO_ROOTS = [
  "Coast", "Pine", "Atlas", "Hill", "Bay", "River", "Cedar", "Birch", "Iron", "Stone",
  "Echo", "North", "Summit", "Harbor", "Beacon", "Field", "Meridian", "Ash", "Granite", "Vale",
  "Fairhaven", "Elkridge", "Wildwood", "Halcyon", "Westline", "Brightway", "Kestrel", "Linden",
];
const CO_SUFFIXES = [
  "Logistics", "Studio", "Holdings", "Group", "Partners", "Capital", "Realty", "Labs", "Ventures",
  "Trading", "Foods", "Builders", "Health", "Solutions", "Works", "Co.", "Industries", "Roastery",
  "Robotics", "Agency", "Bakery", "Apparel", "Plumbing", "Films", "Wines",
];

function rng(seed: number) {
  let x = seed;
  return () => {
    x = (x * 9301 + 49297) % 233280;
    return x / 233280;
  };
}

const r = rng(42);

function pick<T>(arr: T[]): T {
  return arr[Math.floor(r() * arr.length)];
}

function randInt(min: number, max: number) {
  return Math.floor(r() * (max - min + 1)) + min;
}

function maybeMultiState(home: string): string[] {
  if (r() < 0.35) {
    const set = new Set<string>([home]);
    const extra = randInt(1, 3);
    for (let i = 0; i < extra; i++) set.add(pick(STATES));
    return Array.from(set);
  }
  return [home];
}

const HEADLINE_CLIENTS: Partial<Client>[] = [
  {
    id: "c-001",
    name: "Halcyon Roastery & Co.",
    industry: "Restaurants",
    entity: "S-Corp",
    state: "CA",
    multiState: ["CA", "OR", "WA"],
    ownerName: "Adrián Mendez",
    advisor: "Adnan Karim",
    taxRiskScore: 8.4,
    cashFlowScore: 5.2,
    bookkeepingScore: 6.8,
    auditRiskScore: 5.9,
    estimatedTaxLiability: 412_000,
    priorYearLiability: 348_000,
    ytdRevenue: 7_840_000,
    priorYearRevenue: 6_280_000,
    netMarginPct: 14.6,
    identifiedSavings: 96_400,
    realizedSavings: 0,
    openStrategies: 5,
    flags: ["anomaly", "nexus"],
    readinessPct: 72,
    priorityRank: 1,
  },
  {
    id: "c-002",
    name: "Fairhaven Logistics",
    industry: "Logistics",
    entity: "LLC",
    state: "TX",
    multiState: ["TX", "OK", "NM", "AZ"],
    ownerName: "Priya Iyer",
    advisor: "Priya Shah",
    taxRiskScore: 7.6,
    cashFlowScore: 4.1,
    bookkeepingScore: 5.5,
    auditRiskScore: 6.2,
    estimatedTaxLiability: 285_000,
    priorYearLiability: 220_000,
    ytdRevenue: 4_320_000,
    priorYearRevenue: 3_840_000,
    netMarginPct: 9.2,
    identifiedSavings: 64_300,
    realizedSavings: 8_200,
    openStrategies: 4,
    flags: ["nexus", "deadline"],
    readinessPct: 56,
    priorityRank: 2,
  },
  {
    id: "c-003",
    name: "Wildwood Builders",
    industry: "Construction",
    entity: "S-Corp",
    state: "CO",
    multiState: ["CO", "UT"],
    ownerName: "Marcus Albright",
    advisor: "Marcus Lee",
    taxRiskScore: 7.1,
    cashFlowScore: 6.4,
    bookkeepingScore: 4.2,
    auditRiskScore: 7.4,
    estimatedTaxLiability: 198_000,
    priorYearLiability: 156_000,
    ytdRevenue: 3_120_000,
    priorYearRevenue: 2_410_000,
    netMarginPct: 11.5,
    identifiedSavings: 48_900,
    realizedSavings: 12_400,
    openStrategies: 3,
    flags: ["missing-docs", "audit"],
    readinessPct: 41,
    priorityRank: 3,
  },
  {
    id: "c-004",
    name: "Brightway Health Group",
    industry: "Healthcare",
    entity: "C-Corp",
    state: "MA",
    multiState: ["MA", "NH", "CT"],
    ownerName: "Dr. Lena Park",
    advisor: "Renée Dubois",
    taxRiskScore: 6.8,
    cashFlowScore: 7.1,
    bookkeepingScore: 8.0,
    auditRiskScore: 4.5,
    estimatedTaxLiability: 624_000,
    priorYearLiability: 590_000,
    ytdRevenue: 12_400_000,
    priorYearRevenue: 11_800_000,
    netMarginPct: 16.2,
    identifiedSavings: 142_000,
    realizedSavings: 38_500,
    openStrategies: 6,
    flags: ["deadline"],
    readinessPct: 88,
    priorityRank: 4,
  },
  {
    id: "c-005",
    name: "Kestrel Robotics",
    industry: "Technology",
    entity: "C-Corp",
    state: "WA",
    multiState: ["WA", "CA"],
    ownerName: "Hiroshi Tanaka",
    advisor: "Adnan Karim",
    taxRiskScore: 5.9,
    cashFlowScore: 7.8,
    bookkeepingScore: 7.5,
    auditRiskScore: 3.4,
    estimatedTaxLiability: 348_000,
    priorYearLiability: 280_000,
    ytdRevenue: 8_900_000,
    priorYearRevenue: 6_400_000,
    netMarginPct: 18.4,
    identifiedSavings: 84_200,
    realizedSavings: 22_000,
    openStrategies: 4,
    flags: [],
    readinessPct: 92,
    priorityRank: 5,
  },
  {
    id: "c-006",
    name: "Granite Vale Realty",
    industry: "Real Estate",
    entity: "Partnership",
    state: "NY",
    multiState: ["NY", "NJ", "CT", "PA"],
    ownerName: "Eliana Cohen",
    advisor: "Renée Dubois",
    taxRiskScore: 7.4,
    cashFlowScore: 5.8,
    bookkeepingScore: 5.9,
    auditRiskScore: 6.8,
    estimatedTaxLiability: 510_000,
    priorYearLiability: 440_000,
    ytdRevenue: 6_200_000,
    priorYearRevenue: 5_800_000,
    netMarginPct: 22.1,
    identifiedSavings: 118_000,
    realizedSavings: 0,
    openStrategies: 5,
    flags: ["nexus", "audit"],
    readinessPct: 64,
    priorityRank: 6,
  },
  {
    id: "c-007",
    name: "Ash & Linden Apparel",
    industry: "E-commerce",
    entity: "LLC",
    state: "OR",
    multiState: ["OR", "CA", "WA", "NV", "ID"],
    ownerName: "Mateo Rivera",
    advisor: "Priya Shah",
    taxRiskScore: 6.6,
    cashFlowScore: 6.0,
    bookkeepingScore: 7.2,
    auditRiskScore: 5.1,
    estimatedTaxLiability: 168_000,
    priorYearLiability: 132_000,
    ytdRevenue: 2_840_000,
    priorYearRevenue: 2_120_000,
    netMarginPct: 12.4,
    identifiedSavings: 39_500,
    realizedSavings: 6_400,
    openStrategies: 3,
    flags: ["nexus", "missing-docs"],
    readinessPct: 78,
    priorityRank: 7,
  },
  {
    id: "c-008",
    name: "Beacon Hill Capital",
    industry: "Professional Services",
    entity: "S-Corp",
    state: "MA",
    multiState: ["MA"],
    ownerName: "Reza Karimi",
    advisor: "Adnan Karim",
    taxRiskScore: 4.2,
    cashFlowScore: 8.4,
    bookkeepingScore: 8.6,
    auditRiskScore: 3.0,
    estimatedTaxLiability: 240_000,
    priorYearLiability: 232_000,
    ytdRevenue: 1_980_000,
    priorYearRevenue: 1_840_000,
    netMarginPct: 31.5,
    identifiedSavings: 28_600,
    realizedSavings: 18_200,
    openStrategies: 2,
    flags: [],
    readinessPct: 96,
    priorityRank: 8,
  },
];

function generateRandom(idNum: number): Client {
  const idx = idNum + 1;
  const industry = pick(INDUSTRIES);
  const entity = pick(ENTITIES);
  const state = pick(STATES);
  const ownerName = `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
  const name = `${pick(CO_ROOTS)} ${pick(CO_SUFFIXES)}`;
  const ytdRevenue = randInt(500_000, 14_000_000);
  const margin = 6 + r() * 22;
  const taxRiskScore = +(2 + r() * 8).toFixed(1);
  const cashFlowScore = +(2 + r() * 7.5).toFixed(1);
  const bookkeepingScore = +(3 + r() * 6.5).toFixed(1);
  const auditRiskScore = +(1 + r() * 8).toFixed(1);
  const estLiability = Math.round(ytdRevenue * (margin / 100) * (0.20 + r() * 0.15));
  const identifiedSavings = Math.round(estLiability * (0.05 + r() * 0.20));
  const realized = r() < 0.4 ? Math.round(identifiedSavings * (0.1 + r() * 0.5)) : 0;
  const flagsPool: Client["flags"][number][] = [];
  if (taxRiskScore > 6.5) flagsPool.push("anomaly");
  if (auditRiskScore > 6.5) flagsPool.push("audit");
  if (r() < 0.25) flagsPool.push("missing-docs");
  if (r() < 0.20) flagsPool.push("deadline");
  if (r() < 0.18) flagsPool.push("nexus");

  return {
    id: `c-${String(idx).padStart(3, "0")}`,
    name,
    industry,
    entity,
    state,
    multiState: maybeMultiState(state),
    yearFounded: randInt(1998, 2022),
    ownerName,
    advisor: pick(ADVISORS),
    taxRiskScore,
    cashFlowScore,
    bookkeepingScore,
    auditRiskScore,
    estimatedTaxLiability: estLiability,
    priorYearLiability: Math.round(estLiability * (0.78 + r() * 0.18)),
    ytdRevenue,
    priorYearRevenue: Math.round(ytdRevenue * (0.75 + r() * 0.18)),
    netMarginPct: +margin.toFixed(1),
    identifiedSavings,
    realizedSavings: realized,
    openStrategies: randInt(0, 6),
    flags: Array.from(new Set(flagsPool)),
    lastTouch: new Date(Date.now() - randInt(0, 28) * 86_400_000).toISOString(),
    readinessPct: randInt(35, 100),
    priorityRank: idx <= 8 ? idx : Math.min(10, Math.round((10 - taxRiskScore / 10 * 8))),
  };
}

const headlineClients: Client[] = HEADLINE_CLIENTS.map((p, i) => ({
  ...generateRandom(i),
  ...p,
  lastTouch: new Date(Date.now() - randInt(0, 14) * 86_400_000).toISOString(),
})) as Client[];

const filler: Client[] = Array.from({ length: 142 }, (_, i) => generateRandom(i + 8));

export const clients: Client[] = [...headlineClients, ...filler];

export function getClient(id: string): Client | undefined {
  return clients.find((c) => c.id === id);
}

export const clientsCount = clients.length;
