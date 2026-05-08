export type AuditActionType = "Created" | "Updated" | "Deleted" | "Status Change" | "Comment";

export interface AuditDiff {
  field: string;
  oldValue: string;
  newValue: string;
}

export interface AuditEntry {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  entityId: string;
  entityType: string;
  action: AuditActionType;
  timestamp: string;
  description: string;
  diffs?: AuditDiff[];
}
