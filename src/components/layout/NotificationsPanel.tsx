"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, Bell, Tag, Settings } from "lucide-react";
import { useNotificationsStore } from "@/store/notificationsStore";
import { NotificationGroup } from "./NotificationGroup";
import { useState } from "react";
import { cn } from "@/lib/utils";

type FilterTab = "all" | "mentions" | "system";

const FILTER_TABS: { id: FilterTab; label: string; icon: typeof Bell }[] = [
  { id: "all", label: "All", icon: Bell },
  { id: "mentions", label: "Mentions", icon: Tag },
  { id: "system", label: "System", icon: Settings },
];

export function NotificationsPanel() {
  const { isPanelOpen, closePanel, notifications, markAllRead } = useNotificationsStore();
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");

  const filtered = notifications.filter((n) => {
    if (activeFilter === "mentions") return n.type === "task" || n.type === "lead";
    if (activeFilter === "system") return n.type === "proposal";
    return true;
  });

  const todayNotifications = filtered.filter((n) => n.group === "today");
  const earlierNotifications = filtered.filter((n) => n.group === "earlier");
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AnimatePresence>
      {isPanelOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-[#0F172A]/60 backdrop-blur-sm"
            onClick={closePanel}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: 420 }}
            animate={{ x: 0 }}
            exit={{ x: 420 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 bottom-0 z-[70] w-[400px] bg-white border-l border-divider shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-divider bg-page-bg shrink-0">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-bold text-text-primary">Notifications</h2>
                {unreadCount > 0 && (
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-accent text-white text-[10px] font-bold">
                    {unreadCount}
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1.5 text-[11px] font-bold text-text-muted hover:text-accent transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex border-b border-divider bg-white shrink-0">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 py-3 text-[11px] font-bold uppercase tracking-wider transition-all relative",
                    activeFilter === tab.id
                      ? "text-accent"
                      : "text-text-muted hover:text-text-secondary"
                  )}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                  {activeFilter === tab.id && (
                    <motion.div
                      layoutId="notif-tab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-8">
                  <div className="w-12 h-12 rounded-full bg-page-bg border border-divider flex items-center justify-center">
                    <Bell className="w-5 h-5 text-text-muted" />
                  </div>
                  <p className="text-sm font-medium text-text-secondary">All caught up!</p>
                  <p className="text-[12px] text-text-muted">No notifications in this category.</p>
                </div>
              ) : (
                <>
                  <NotificationGroup label="Today" notifications={todayNotifications} />
                  <NotificationGroup label="Earlier" notifications={earlierNotifications} />
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-divider bg-page-bg shrink-0">
              <button className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-text-secondary hover:text-accent uppercase transition-colors">
                View Full Activity Log
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
