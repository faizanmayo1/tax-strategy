export interface CopilotMessage {
  role: "user" | "assistant";
  content: string;
  citations?: { title: string; source: string }[];
  data?: { type: "ranked-clients"; rows: { name: string; reason: string; savings: number }[] };
}

export const sampleCopilotThread: CopilotMessage[] = [
  {
    role: "user",
    content: "Which clients may benefit from entity restructuring this quarter?",
  },
  {
    role: "assistant",
    content:
      "I scanned 150 clients and ranked the top entity-restructure opportunities by projected savings. Each is a sole prop or single-member LLC with net SE income above $175K — strong candidates for S-Corp election before Mar 15.",
    citations: [
      { title: "Reasonable Comp Benchmarking", source: "Aragon Internal Playbook 04 · v2.3" },
      { title: "Form 2553 Election Procedure", source: "Aragon Compliance Guide · 2024" },
    ],
    data: {
      type: "ranked-clients",
      rows: [
        { name: "Halcyon Roastery & Co.", reason: "Sole prop · Net SE $238K · No payroll yet", savings: 26_400 },
        { name: "Wildwood Builders", reason: "LLC default · Net $192K · One owner-operator", savings: 18_900 },
        { name: "Ash & Linden Apparel", reason: "LLC · Net $186K · Eligible for mid-year election", savings: 17_800 },
        { name: "Fairhaven Logistics", reason: "LLC · Net $174K · S-Corp election + RC study", savings: 16_200 },
      ],
    },
  },
];

export const suggestedPrompts = [
  "Draft a one-page brief for tomorrow's Halcyon Roastery meeting",
  "Which clients are most exposed to multi-state nexus this year?",
  "Summarize all retirement planning strategies open across the book",
  "Find clients with high audit risk and missing receipts",
  "Write a client email explaining the Augusta Rule in plain language",
  "Prep a year-end planning agenda for our top 10 clients",
];
