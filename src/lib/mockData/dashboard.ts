export interface StatData {
  label: string;
  value: string;
  trendText: string;
  trendDirection: "up" | "down" | "neutral";
  icon: string;
  sparkline: { value: number }[];
}

export interface ProjectData {
  id: string;
  name: string;
  clientId: string;
  status: "ACTIVE" | "REVIEW" | "ON-HOLD";
  progress: number;
  burnRateSpent: number;
  burnRateTotal: number;
}

export interface ActivityData {
  id: string;
  actionText: string;
  timestamp: string; // ISO date string
  avatarColor: string;
  initials: string;
}

export const MOCK_STATS: StatData[] = [
  {
    label: "Total Active Projects",
    value: "142",
    trendText: "+12% vs last month",
    trendDirection: "up",
    icon: "domain",
    sparkline: [{ value: 10 }, { value: 12 }, { value: 11 }, { value: 15 }, { value: 16 }, { value: 14 }, { value: 18 }],
  },
  {
    label: "Open Invoices",
    value: "38",
    trendText: "Action required on 5",
    trendDirection: "neutral",
    icon: "receipt_long",
    sparkline: [{ value: 5 }, { value: 8 }, { value: 7 }, { value: 12 }, { value: 10 }, { value: 11 }, { value: 14 }],
  },
  {
    label: "Monthly Revenue",
    value: "$1.2M",
    trendText: "Trending up",
    trendDirection: "up",
    icon: "account_balance",
    sparkline: [{ value: 100 }, { value: 105 }, { value: 102 }, { value: 110 }, { value: 115 }, { value: 112 }, { value: 120 }],
  },
  {
    label: "Overdue Tasks",
    value: "14",
    trendText: "Critical priority",
    trendDirection: "down",
    icon: "warning",
    sparkline: [{ value: 20 }, { value: 18 }, { value: 19 }, { value: 15 }, { value: 16 }, { value: 14 }, { value: 14 }],
  },
];

export const MOCK_PROJECTS: ProjectData[] = [
  {
    id: "PRJ-GOOG-26-001",
    name: "Alpha Core Migration",
    clientId: "CLI-GOOG-26",
    status: "ACTIVE",
    progress: 78,
    burnRateSpent: 45000,
    burnRateTotal: 60000,
  },
  {
    id: "PRJ-AMZN-26-003",
    name: "Logistics Node Omega",
    clientId: "CLI-AMZN-26",
    status: "REVIEW",
    progress: 92,
    burnRateSpent: 112000,
    burnRateTotal: 120000,
  },
  {
    id: "PRJ-MSFT-26-002",
    name: "Quantum Sync Protocol",
    clientId: "CLI-MSFT-26",
    status: "ACTIVE",
    progress: 34,
    burnRateSpent: 12000,
    burnRateTotal: 150000,
  },
  {
    id: "PRJ-META-26-004",
    name: "Social Graph Integration",
    clientId: "CLI-META-26",
    status: "ON-HOLD",
    progress: 45,
    burnRateSpent: 20000,
    burnRateTotal: 50000,
  },
];

export const MOCK_DISTRIBUTION = [
  { name: "Active", value: 65, color: "#00E5FF" },
  { name: "On-Hold", value: 20, color: "#FFB800" },
  { name: "Completed", value: 15, color: "#00C896" },
];

export const MOCK_ACTIVITIES: ActivityData[] = [
  {
    id: "act-1",
    actionText: "TSK-PRJ-GOOG-26-005-12 moved to QA by @Arjun",
    timestamp: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    avatarColor: "bg-accent/20 text-accent",
    initials: "AJ",
  },
  {
    id: "act-2",
    actionText: "Invoice INV-2026-089 generated for Client CLI-MSFT-26",
    timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    avatarColor: "bg-warning/20 text-warning",
    initials: "SYS",
  },
  {
    id: "act-3",
    actionText: "Database backup completed on Node 4",
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    avatarColor: "bg-success/20 text-success",
    initials: "DB",
  },
];
