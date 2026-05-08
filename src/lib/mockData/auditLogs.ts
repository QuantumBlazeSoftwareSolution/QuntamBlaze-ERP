import { AuditEntry } from "@/types/audit";

export const MOCK_AUDIT_LOGS: AuditEntry[] = [
  {
    id: "AUD-001",
    userId: "USR-ER-26-004",
    userName: "Elena Rostova",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop",
    entityId: "TSK-PRJ-GOOG-26-005-12",
    entityType: "Task",
    action: "Status Change",
    timestamp: "2023.10.24 14:32:05Z",
    description: "Changed status from PENDING_REVIEW to ACTIVE_DEPLOYMENT",
    diffs: [
      { field: "status", oldValue: "PENDING_REVIEW", newValue: "ACTIVE_DEPLOYMENT" }
    ]
  },
  {
    id: "AUD-002",
    userId: "SYSTEM_AUTO",
    userName: "System Automation",
    entityId: "CFG-NET-NODE-ALPHA-09",
    entityType: "Config",
    action: "Updated",
    timestamp: "2023.10.24 11:15:00Z",
    description: "Optimized network latency parameters.",
    diffs: [
      { field: "max_latency_ms", oldValue: "50", newValue: "20" },
      { field: "redundancy_mode", oldValue: "passive", newValue: "active_active" }
    ]
  },
  {
    id: "AUD-003",
    userId: "USR-MV-26-009",
    userName: "Marcus Vance",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop",
    entityId: "USR-EXT-CONT-442",
    entityType: "Access",
    action: "Deleted",
    timestamp: "2023.10.23 09:05:11Z",
    description: "Access Revoked for external contractor.",
    diffs: [
      { field: "access_state", oldValue: "GRANTED", newValue: "REVOKED" }
    ]
  },
  // Add more to test virtualization
  ...Array.from({ length: 50 }).map((_, i) => ({
    id: `AUD-100${i}`,
    userId: "USR-JD-26-001",
    userName: "J. Doe",
    entityId: `PRJ-GOOG-26-00${i % 9}`,
    entityType: "Project",
    action: (i % 4 === 0 ? "Created" : i % 4 === 1 ? "Updated" : "Status Change") as any,
    timestamp: `2023.10.22 08:${(i % 60).toString().padStart(2, '0')}:00Z`,
    description: `Automated audit entry ${i}`,
  }))
];
