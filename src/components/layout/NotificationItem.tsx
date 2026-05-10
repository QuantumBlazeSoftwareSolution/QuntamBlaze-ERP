"use client";

import { motion } from "framer-motion";
import { Receipt, CheckSquare, FileText, UserPlus } from "lucide-react";
import { AppNotification } from "@/types/notifications";
import { IDChip } from "@/components/ui/IDChip";
import { formatDistanceToNow } from "date-fns";
import { useNotificationsStore } from "@/store/notificationsStore";
import { cn } from "@/lib/utils";

const ID_REGEX = /((?:PRJ|TSK|INV|CLI|LED|SRS|PRO|QTO|AGR|RCT)-[A-Z0-9-]+(?:-\d+)?)/g;

function renderNotificationText(text: string) {
  const parts = text.split(ID_REGEX);
  return parts.map((part, index) => {
    if (part.match(ID_REGEX)) {
      return (
        <IDChip
          key={index}
          id={part}
          className="px-1 py-0 shadow-none border-none bg-accent/10 hover:bg-accent/20 -ml-0.5 mr-0.5 inline-flex"
        />
      );
    }
    return <span key={index}>{part}</span>;
  });
}

function getIconAndColor(type: AppNotification["type"]) {
  switch (type) {
    case "invoice":
      return { Icon: Receipt, color: "text-red-500", bg: "bg-red-50 border-red-100" };
    case "task":
      return { Icon: CheckSquare, color: "text-success", bg: "bg-success/10 border-success/20" };
    case "proposal":
      return { Icon: FileText, color: "text-accent", bg: "bg-accent/10 border-accent/20" };
    case "lead":
      return { Icon: UserPlus, color: "text-warning", bg: "bg-warning/10 border-warning/20" };
  }
}

interface NotificationItemProps {
  notification: AppNotification;
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const { markRead } = useNotificationsStore();
  const { Icon, color, bg } = getIconAndColor(notification.type);

  return (
    <div
      onClick={() => markRead(notification.id)}
      className={cn(
        "relative px-6 py-4 border-b border-divider transition-colors cursor-pointer",
        notification.read ? "bg-white hover:bg-page-bg" : "bg-accent/[0.03] hover:bg-accent/[0.06]"
      )}
    >
      <div className="flex gap-3.5">
        {/* Icon */}
        <div
          className={cn(
            "mt-0.5 w-8 h-8 rounded-full border flex items-center justify-center shrink-0",
            bg
          )}
        >
          <Icon className={cn("w-4 h-4", color)} />
        </div>

        {/* Content */}
        <div className="flex-1 pr-4 min-w-0">
          <div className="text-[13px] leading-relaxed text-text-primary mb-1.5">
            {renderNotificationText(notification.message)}
          </div>
          <div className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-widest">
            {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
          </div>
        </div>

        {/* Unread Dot */}
        {!notification.read && (
          <div className="absolute right-6 top-5">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-accent"
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
