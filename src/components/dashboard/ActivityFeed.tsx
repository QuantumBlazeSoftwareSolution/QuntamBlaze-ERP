"use client";

import { ActivityData } from "@/lib/mockData/dashboard";
import { formatDistanceToNow } from "date-fns";
import { IDChip } from "@/components/ui/IDChip";

const ID_REGEX = /((?:PRJ|TSK|INV|CLI|LED|SRS|PRO|QTO|AGR|RCT)-[A-Z0-9-]+)/g;

function renderActionText(text: string) {
  const parts = text.split(ID_REGEX);
  
  return parts.map((part, index) => {
    if (part.match(ID_REGEX)) {
      return <IDChip key={index} id={part} className="px-1 py-0 shadow-none border-none bg-transparent hover:bg-accent/10 -ml-1 mr-0.5" />;
    }
    return <span key={index}>{part}</span>;
  });
}

export function ActivityFeed({ activities }: { activities: ActivityData[] }) {
  return (
    <div className="bg-bg-card border border-border rounded-xl p-6">
      <h3 className="text-[11px] font-bold tracking-[0.1em] text-text-secondary uppercase mb-6 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(0,229,255,0.5)] animate-pulse" />
        Live Telemetry Stream
      </h3>
      
      <div className="relative pl-4 space-y-6 before:absolute before:left-[3px] before:top-2 before:bottom-2 before:w-px before:bg-border/50">
        {activities.map((activity) => (
          <div key={activity.id} className="relative">
            {/* Timeline dot/avatar */}
            <div className={`absolute -left-[20px] top-1 w-2 h-2 rounded-full ring-4 ring-bg-card ${activity.avatarColor.split(" ")[0]}`} />
            
            <div className="text-sm text-text-primary leading-relaxed">
              {renderActionText(activity.actionText)}
            </div>
            
            <div className="text-[10px] font-mono text-text-secondary/60 mt-1 uppercase tracking-widest">
              {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
