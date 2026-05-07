export type NotificationType = "invoice" | "task" | "proposal" | "lead";

export interface AppNotification {
  id: string;
  type: NotificationType;
  entityId: string;
  message: string;
  timestamp: string; // ISO format
  read: boolean;
  group: "today" | "earlier";
}
