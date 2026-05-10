"use client";

import { Bell } from "lucide-react";
import { useNotificationsStore } from "@/store/notificationsStore";

export function NotificationBell() {
  const { notifications, openPanel } = useNotificationsStore();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <button 
      onClick={openPanel}
      className="text-text-secondary hover:bg-page-bg transition-colors duration-200 p-2 rounded-full relative"
    >
      <Bell className="w-5 h-5" />
      {unreadCount > 0 && (
        <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
      )}
    </button>
  );
}
