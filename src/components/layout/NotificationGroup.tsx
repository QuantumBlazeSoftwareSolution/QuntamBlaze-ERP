import { AppNotification } from "@/types/notifications";
import { NotificationItem } from "./NotificationItem";

interface NotificationGroupProps {
  label: string;
  notifications: AppNotification[];
}

export function NotificationGroup({ label, notifications }: NotificationGroupProps) {
  if (notifications.length === 0) return null;

  return (
    <div className="mb-2">
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 px-6 py-2.5 border-b border-divider">
        <h4 className="text-[10px] font-bold tracking-widest text-text-muted uppercase">{label}</h4>
      </div>
      <div>
        {notifications.map((n) => (
          <NotificationItem key={n.id} notification={n} />
        ))}
      </div>
    </div>
  );
}
