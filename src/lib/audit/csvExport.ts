import { AuditEntry } from "@/types/audit";

export function exportAuditLogCSV(entries: AuditEntry[]): Blob {
  const headers = ["Timestamp", "User", "USR-ID", "Action", "Entity", "Entity Type", "Description"];
  const rows = entries.map(e => [
    e.timestamp,
    e.userName,
    e.userId,
    e.action,
    e.entityId,
    e.entityType,
    e.description.replace(/,/g, ";")
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map(r => r.join(","))
  ].join("\n");

  return new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
}
