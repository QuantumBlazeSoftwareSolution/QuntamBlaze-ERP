export type ActivityEventType = "created" | "updated" | "deleted" | "finance" | "auth" | "system";

export interface ActivityEvent {
  id: string;
  type: ActivityEventType;
  entityId: string;
  entityType: "project" | "client" | "invoice" | "lead" | "receipt" | "user" | "system";
  actor: {
    name: string;
    initials: string;
    color: string;
  };
  description: string;
  timestamp: string;
}

const now = Date.now();
const mins = (n: number) => new Date(now - n * 60 * 1000).toISOString();
const hours = (n: number) => new Date(now - n * 3600 * 1000).toISOString();
const days = (n: number) => new Date(now - n * 86400 * 1000).toISOString();

export const MOCK_ACTIVITY: ActivityEvent[] = [
  {
    id: "act-001",
    type: "finance",
    entityId: "INV-2605-0042",
    entityType: "invoice",
    actor: { name: "A. Mercer", initials: "AM", color: "#10B981" },
    description: "Invoice INV-2605-0042 marked as Overdue — 7 days past due date.",
    timestamp: mins(4),
  },
  {
    id: "act-002",
    type: "updated",
    entityId: "PRJ-GOOG-26-001",
    entityType: "project",
    actor: { name: "S. Ramirez", initials: "SR", color: "#3B82F6" },
    description: "Project progress updated to 79%. Milestone 3 marked complete.",
    timestamp: mins(18),
  },
  {
    id: "act-003",
    type: "created",
    entityId: "CLI-AMZN-26-005",
    entityType: "client",
    actor: { name: "A. Mercer", initials: "AM", color: "#10B981" },
    description: "New client CLI-AMZN-26-005 onboarded from lead LED-26-034.",
    timestamp: hours(1),
  },
  {
    id: "act-004",
    type: "finance",
    entityId: "RCT-2605-088",
    entityType: "receipt",
    actor: { name: "K. Tanaka", initials: "KT", color: "#F59E0B" },
    description: "Receipt RCT-2605-088 logged for INV-2404-098 — $8,200 collected.",
    timestamp: hours(2),
  },
  {
    id: "act-005",
    type: "updated",
    entityId: "PRJ-MSFT-26-002",
    entityType: "project",
    actor: { name: "N. Okafor", initials: "NO", color: "#8B5CF6" },
    description: "Status changed from Draft → Active. Team assigned.",
    timestamp: hours(3),
  },
  {
    id: "act-006",
    type: "created",
    entityId: "INV-2605-0043",
    entityType: "invoice",
    actor: { name: "A. Mercer", initials: "AM", color: "#10B981" },
    description: "Invoice INV-2605-0043 generated for CLI-SPX-26-088 — $250,000.",
    timestamp: hours(4),
  },
  {
    id: "act-007",
    type: "deleted",
    entityId: "LED-26-031",
    entityType: "lead",
    actor: { name: "S. Ramirez", initials: "SR", color: "#3B82F6" },
    description: "Lead LED-26-031 archived. Reason: duplicate entry.",
    timestamp: hours(5),
  },
  {
    id: "act-008",
    type: "auth",
    entityId: "USR-004",
    entityType: "user",
    actor: { name: "System", initials: "SY", color: "#94A3B8" },
    description: "New user invitation sent to dev@quantumblaze.io (role: Operator).",
    timestamp: hours(6),
  },
  {
    id: "act-009",
    type: "finance",
    entityId: "INV-2605-0041",
    entityType: "invoice",
    actor: { name: "K. Tanaka", initials: "KT", color: "#F59E0B" },
    description: "Invoice INV-2605-0041 status updated from Sent → Partially Paid.",
    timestamp: hours(8),
  },
  {
    id: "act-010",
    type: "updated",
    entityId: "CLI-GOOG-26-001",
    entityType: "client",
    actor: { name: "A. Mercer", initials: "AM", color: "#10B981" },
    description: "Billing address updated for Alphabet Inc. CLI-GOOG-26-001.",
    timestamp: hours(10),
  },
  {
    id: "act-011",
    type: "created",
    entityId: "PRJ-META-26-003",
    entityType: "project",
    actor: { name: "N. Okafor", initials: "NO", color: "#8B5CF6" },
    description: "New project PRJ-META-26-003 created — Reality OS Dashboard.",
    timestamp: days(1),
  },
  {
    id: "act-012",
    type: "system",
    entityId: "SYS-AUDIT",
    entityType: "system",
    actor: { name: "System", initials: "SY", color: "#94A3B8" },
    description: "Automated audit log export triggered. 2,401 entries archived.",
    timestamp: days(1),
  },
  {
    id: "act-013",
    type: "finance",
    entityId: "QTO-2605-012",
    entityType: "invoice",
    actor: { name: "S. Ramirez", initials: "SR", color: "#3B82F6" },
    description: "Quotation QTO-2605-012 sent to CLI-LOC-26-042. Valid 30 days.",
    timestamp: days(1),
  },
  {
    id: "act-014",
    type: "updated",
    entityId: "PRJ-AMZN-26-004",
    entityType: "project",
    actor: { name: "K. Tanaka", initials: "KT", color: "#F59E0B" },
    description: "Budget burn updated: $1.1M / $1.4M (63%). On-track.",
    timestamp: days(2),
  },
  {
    id: "act-015",
    type: "auth",
    entityId: "USR-002",
    entityType: "user",
    actor: { name: "System", initials: "SY", color: "#94A3B8" },
    description: "Role changed for S. Ramirez: Operator → Manager.",
    timestamp: days(2),
  },
  {
    id: "act-016",
    type: "created",
    entityId: "LED-26-038",
    entityType: "lead",
    actor: { name: "A. Mercer", initials: "AM", color: "#10B981" },
    description: "New lead LED-26-038 captured — Tesla Inc. via referral channel.",
    timestamp: days(3),
  },
  {
    id: "act-017",
    type: "deleted",
    entityId: "INV-2404-VOID",
    entityType: "invoice",
    actor: { name: "A. Mercer", initials: "AM", color: "#10B981" },
    description: "Invoice INV-2404-VOID cancelled and voided. Credit note issued.",
    timestamp: days(3),
  },
  {
    id: "act-018",
    type: "system",
    entityId: "SYS-BACKUP",
    entityType: "system",
    actor: { name: "System", initials: "SY", color: "#94A3B8" },
    description: "Daily database backup completed successfully — 4.2GB snapshot.",
    timestamp: days(4),
  },
  {
    id: "act-019",
    type: "finance",
    entityId: "INV-2404-098",
    entityType: "invoice",
    actor: { name: "K. Tanaka", initials: "KT", color: "#F59E0B" },
    description: "Invoice INV-2404-098 marked Paid. Receipt RCT-2404-012 linked.",
    timestamp: days(4),
  },
  {
    id: "act-020",
    type: "updated",
    entityId: "PRJ-GOOG-26-002",
    entityType: "project",
    actor: { name: "S. Ramirez", initials: "SR", color: "#3B82F6" },
    description: "Data Lake Infrastructure deadline extended to Sep 30, 2026.",
    timestamp: days(5),
  },
];
