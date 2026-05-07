"use client";

import { motion } from "framer-motion";
import { Receipt, CheckSquare, FileText, UserPlus } from "lucide-react";
import { AppNotification } from "@/types/notifications";
import { IDChip } from "@/components/ui/IDChip";
import { formatDistanceToNow } from "date-fns";

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
      return { Icon: Receipt, color: "text-danger" };
    case "task":
      return { Icon: CheckSquare, color: "text-success" };
    case "proposal":
      return { Icon: FileText, color: "text-accent" };
    case "lead":
      return { Icon: UserPlus, color: "text-warning" };
  }
}

interface NotificationItemProps {
  notification: AppNotification;
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const { Icon, color } = getIconAndColor(notification.type);

  return (
    <div
      className={`relative p-5 border-b border-[#1A1A1A] transition-colors ${
        notification.read ? "bg-transparent" : "bg-[#0F0F0F]"
      }`}
    >
      <div className="flex gap-4">
        {/* Icon Container */}
        <div className="mt-1 flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-bg-surface border border-border flex items-center justify-center">
            <Icon className={`w-4 h-4 ${color}`} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 pr-6">
          <div className="text-[13px] leading-relaxed text-text-primary mb-1.5">
            {renderNotificationText(notification.message)}
          </div>
          <div className="text-[10px] font-mono text-text-secondary uppercase tracking-widest">
            {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
          </div>
        </div>

        {/* Unread Dot */}
        {!notification.read && (
          <div className="absolute right-5 top-6">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(0,229,255,0.8)]"
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
