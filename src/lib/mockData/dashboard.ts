export interface SparklinePoint {
  value: number;
}

export interface ActivityItem {
  id: string;
  type: "task" | "invoice" | "project" | "client";
  entityId: string;
  userId: string;
  action: string;
  timestamp: string;
}

export interface ProjectHealth {
  id: string;
  name: string;
  clientId: string;
  progress: number;
  budgetSpent: number;
  budgetTotal: number;
  status: "active" | "on-hold" | "completed";
}

export const statsData = [
  {
    label: "Total Revenue",
    value: "$128,430",
    trend: 12.5,
    sparkline: [
      { value: 40 },
      { value: 35 },
      { value: 50 },
      { value: 45 },
      { value: 60 },
      { value: 55 },
      { value: 70 },
    ],
  },
  {
    label: "Active Projects",
    value: "24",
    trend: 8.2,
    sparkline: [
      { value: 20 },
      { value: 22 },
      { value: 21 },
      { value: 24 },
      { value: 23 },
      { value: 25 },
      { value: 24 },
    ],
  },
  {
    label: "Outstanding Invoices",
    value: "14",
    trend: -2.4,
    sparkline: [
      { value: 18 },
      { value: 16 },
      { value: 17 },
      { value: 15 },
      { value: 14 },
      { value: 13 },
      { value: 14 },
    ],
  },
  {
    label: "Lead Conversion",
    value: "18.5%",
    trend: 4.1,
    sparkline: [
      { value: 15 },
      { value: 16 },
      { value: 15.5 },
      { value: 17 },
      { value: 18 },
      { value: 17.5 },
      { value: 18.5 },
    ],
  },
];

export const projectHealthData: ProjectHealth[] = [
  {
    id: "PRJ-GOOG-26-001",
    name: "Cloud Infrastructure Migration",
    clientId: "CLI-GOOG-26-001",
    progress: 75,
    budgetSpent: 45000,
    budgetTotal: 60000,
    status: "active",
  },
  {
    id: "PRJ-META-26-004",
    name: "VR Experience Design",
    clientId: "CLI-META-26-012",
    progress: 40,
    budgetSpent: 12000,
    budgetTotal: 40000,
    status: "active",
  },
  {
    id: "PRJ-MSFT-26-008",
    name: "AI Copilot Integration",
    clientId: "CLI-MSFT-26-003",
    progress: 95,
    budgetSpent: 28000,
    budgetTotal: 30000,
    status: "active",
  },
  {
    id: "PRJ-AMZN-26-002",
    name: "Supply Chain Optimization",
    clientId: "CLI-AMZN-26-005",
    progress: 20,
    budgetSpent: 8000,
    budgetTotal: 50000,
    status: "on-hold",
  },
];

export const activityFeedData: ActivityItem[] = [
  {
    id: "ACT-001",
    type: "task",
    entityId: "TSK-PRJ-GOOG-26-005-12",
    userId: "USR-JD-26-004",
    action: "moved to Done",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
  },
  {
    id: "ACT-002",
    type: "invoice",
    entityId: "INV-2605-0042",
    userId: "USR-AS-26-001",
    action: "marked as Overdue",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: "ACT-003",
    type: "project",
    entityId: "PRJ-META-26-004",
    userId: "USR-EM-26-009",
    action: "updated budget allocation",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
  },
  {
    id: "ACT-004",
    type: "client",
    entityId: "CLI-GOOG-26-001",
    userId: "USR-JD-26-004",
    action: "added new contact person",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
];

export const statusDistribution = [
  { name: "Active", value: 14, color: "#10B981" },
  { name: "On-Hold", value: 4, color: "#F59E0B" },
  { name: "Completed", value: 6, color: "#3B82F6" },
];
