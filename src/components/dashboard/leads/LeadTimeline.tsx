"use client";

import { Phone, Mail, FileText, User, Plus } from "lucide-react";
import { LeadTimelineEvent } from "@/types/lead";
import { format } from "date-fns";

const EVENT_ICONS = {
  call: <Phone className="w-4 h-4" />,
  email: <Mail className="w-4 h-4" />,
  status_change: <FileText className="w-4 h-4" />,
  note: <FileText className="w-4 h-4" />,
};

export function LeadTimeline({ events }: { events: LeadTimelineEvent[] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[11px] font-bold tracking-[0.2em] text-text-secondary uppercase">
          Activity Log
        </h3>
        <button className="text-text-secondary hover:text-accent transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="relative pl-8 space-y-8 before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-[1px] before:bg-border">
        {events.map((event) => (
          <div key={event.id} className="relative">
            {/* Icon Circle */}
            <div className="absolute -left-8 top-0 w-8 h-8 rounded-full bg-bg-card border border-border flex items-center justify-center text-text-secondary z-10">
              {EVENT_ICONS[event.type]}
            </div>

            <div className="bg-bg-card border border-border rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-[14px] font-semibold text-text-primary">{event.title}</h4>
                <span className="text-[11px] font-medium text-text-muted uppercase">
                  {format(new Date(event.timestamp), "HH:mm - eeee")}
                </span>
              </div>
              <p className="text-[13px] text-text-secondary leading-relaxed mb-0">
                {event.description}
              </p>
            </div>
          </div>
        ))}

        {events.length === 0 && (
          <div className="text-center py-12 border border-dashed border-border rounded-xl">
            <p className="text-text-muted text-[13px]">No activity recorded yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
