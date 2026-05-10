export type EntityType = "PROJECTS" | "CLIENTS" | "INVOICES" | "TASKS" | "LEADS";

export interface SearchEntity {
  id: string;
  type: EntityType;
  name: string;
  status?: string;
  statusColor?: string; // e.g. "bg-success" or a hex
}

export const SEARCH_INDEX: SearchEntity[] = [
  // PROJECTS
  { id: "PRJ-GOOG-26-001", type: "PROJECTS", name: "Alpha Core Migration", status: "ACTIVE" },
  { id: "PRJ-MSFT-26-042", type: "PROJECTS", name: "Nexus Integration", status: "REVIEW" },
  { id: "PRJ-AMZN-26-088", type: "PROJECTS", name: "Logistics Node Omega", status: "ACTIVE" },
  { id: "PRJ-META-26-012", type: "PROJECTS", name: "Social Graph V2", status: "ON-HOLD" },
  { id: "PRJ-NFLX-26-005", type: "PROJECTS", name: "Streaming Cache Layer", status: "ACTIVE" },

  // CLIENTS
  { id: "CLI-AAPL-01", type: "CLIENTS", name: "Apple Corp Logistics", status: "ACTIVE" },
  { id: "CLI-GOOG-02", type: "CLIENTS", name: "Alphabet Holdings", status: "ACTIVE" },
  { id: "CLI-MSFT-03", type: "CLIENTS", name: "Microsoft Cloud Division", status: "ACTIVE" },
  { id: "CLI-AMZN-04", type: "CLIENTS", name: "Amazon Fulfillment", status: "INACTIVE" },
  { id: "CLI-META-05", type: "CLIENTS", name: "Meta Platforms Inc", status: "ACTIVE" },

  // INVOICES
  { id: "INV-2026-893", type: "INVOICES", name: "Q3 Server Infrastructure", status: "PAID" },
  { id: "INV-2026-894", type: "INVOICES", name: "Monthly Retainer - Jan", status: "OVERDUE" },
  { id: "INV-2026-895", type: "INVOICES", name: "Cloud Migration Services", status: "PENDING" },
  { id: "INV-2026-896", type: "INVOICES", name: "Security Audit Q1", status: "PAID" },
  { id: "INV-2026-897", type: "INVOICES", name: "API Rate Limit Expansion", status: "PAID" },

  // TASKS
  { id: "TSK-SEC-092", type: "TASKS", name: "Audit Security Protocols", status: "PROCESSING" },
  { id: "TSK-DEV-104", type: "TASKS", name: "Deploy v4.2 Release", status: "QA" },
  { id: "TSK-OPS-045", type: "TASKS", name: "Scale Database Nodes", status: "BACKLOG" },
  { id: "TSK-FIN-012", type: "TASKS", name: "Quarterly Tax Filing", status: "IN-PROGRESS" },
  { id: "TSK-MKT-088", type: "TASKS", name: "Campaign Asset Delivery", status: "COMPLETED" },

  // LEADS
  { id: "LED-26-001", type: "LEADS", name: "Stark Industries", status: "HOT" },
  { id: "LED-26-002", type: "LEADS", name: "Wayne Enterprises", status: "WARM" },
  { id: "LED-26-003", type: "LEADS", name: "Oscorp Data Solutions", status: "COLD" },
  { id: "LED-26-004", type: "LEADS", name: "Cyberdyne Systems", status: "NEW" },
  { id: "LED-26-005", type: "LEADS", name: "Tyrell Corporation", status: "HOT" },
];
