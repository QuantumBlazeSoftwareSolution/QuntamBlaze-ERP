import { create } from "zustand";
import { AppNotification } from "@/types/notifications";

interface NotificationsState {
  notifications: AppNotification[];
  isPanelOpen: boolean;
  openPanel: () => void;
  closePanel: () => void;
  togglePanel: () => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  addNotification: (n: AppNotification) => void;
}

const INITIAL_MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif-1",
    type: "invoice",
    entityId: "INV-2605-0042",
    message: "INV-2605-0042 is 7 days overdue — CLI-GOOG-26-001",
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2m ago
    read: false,
    group: "today",
  },
  {
    id: "notif-2",
    type: "task",
    entityId: "TSK-PRJ-GOOG-26-005-12",
    message: "TSK-PRJ-GOOG-26-005-12 was moved to Done by @Sarah",
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1h ago
    read: false,
    group: "today",
  },
  {
    id: "notif-3",
    type: "proposal",
    entityId: "PRO-PRJ-MSFT-26-002-01",
    message: "PRO-PRJ-MSFT-26-002-01 was approved by client",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    read: false,
    group: "earlier",
  },
  {
    id: "notif-4",
    type: "lead",
    entityId: "LED-26-034",
    message: "LED-26-034 was converted to CLI-AMZN-26-005",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    read: true,
    group: "earlier",
  },
];

export const useNotificationsStore = create<NotificationsState>((set) => ({
  notifications: INITIAL_MOCK_NOTIFICATIONS,
  isPanelOpen: false,
  openPanel: () => set({ isPanelOpen: true }),
  closePanel: () => set({ isPanelOpen: false }),
  togglePanel: () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),
  markRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    })),
  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),
  addNotification: (n) => set((state) => ({ notifications: [n, ...state.notifications] })),
}));
