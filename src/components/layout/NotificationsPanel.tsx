"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { useNotificationsStore } from "@/store/notificationsStore";
import { NotificationGroup } from "./NotificationGroup";

export function NotificationsPanel() {
  const { isPanelOpen, closePanel, notifications, markAllRead } = useNotificationsStore();

  const todayNotifications = notifications.filter((n) => n.group === "today");
  const earlierNotifications = notifications.filter((n) => n.group === "earlier");
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
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px]"
            onClick={closePanel}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: 380 }}
            animate={{ x: 0 }}
            exit={{ x: 380 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 bottom-0 z-[70] w-[380px] bg-[#0A0A0A] border-l border-[#1A1A1A] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-5 border-b border-[#1A1A1A]">
              <h2 className="text-lg font-medium text-text-primary">Notifications</h2>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1.5 text-xs text-accent hover:text-accent/80 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto hide-scrollbar">
              <NotificationGroup label="Today" notifications={todayNotifications} />
              <NotificationGroup label="Earlier" notifications={earlierNotifications} />
              
              {notifications.length === 0 && (
                <div className="p-8 text-center text-text-secondary text-sm">
                  You&apos;re all caught up!
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-[#1A1A1A] bg-[#0A0A0A]">
              <button className="flex items-center gap-2 text-[11px] font-bold tracking-[0.1em] text-text-secondary hover:text-text-primary uppercase transition-colors">
                View in Audit Log
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
