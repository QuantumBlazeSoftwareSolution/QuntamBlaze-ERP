import { AppNotification } from "@/types/notifications";
import { NotificationItem } from "./NotificationItem";

interface NotificationGroupProps {
  label: string;
  notifications: AppNotification[];
}

export function NotificationGroup({ label, notifications }: NotificationGroupProps) {
  if (notifications.length === 0) return null;

  return (
    <div className="mb-4">
      <div className="sticky top-0 bg-[#0A0A0A]/95 backdrop-blur-sm z-10 px-5 py-3 border-b border-[#1A1A1A]">
        <h4 className="text-[10px] font-bold tracking-[0.1em] text-[#3A3A3A] uppercase">
          {label}
        </h4>
      </div>
      <div>
        {notifications.map((n) => (
          <NotificationItem key={n.id} notification={n} />
        ))}
      </div>
    </div>
  );
}
