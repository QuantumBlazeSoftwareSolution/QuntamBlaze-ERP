"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { Plus, Edit3, Trash2, DollarSign, Lock, Cpu, Filter } from "lucide-react";
import { IDChip } from "@/components/ui/IDChip";
import { cn } from "@/lib/utils";
import { MOCK_ACTIVITY, ActivityEvent, ActivityEventType } from "@/lib/mockData/activity";

const TYPE_CONFIG: Record<
  ActivityEventType,
  { label: string; icon: typeof Plus; bg: string; dot: string }
> = {
  created: {
    label: "Created",
    icon: Plus,
    bg: "bg-success/10 border-success/20",
    dot: "bg-success",
  },
  updated: { label: "Updated", icon: Edit3, bg: "bg-accent/10 border-accent/20", dot: "bg-accent" },
  deleted: { label: "Deleted", icon: Trash2, bg: "bg-red-50 border-red-200", dot: "bg-red-500" },
  finance: {
    label: "Finance",
    icon: DollarSign,
    bg: "bg-amber-50 border-amber-200",
    dot: "bg-warning",
  },
  auth: { label: "Auth", icon: Lock, bg: "bg-purple-50 border-purple-200", dot: "bg-purple-500" },
  system: { label: "System", icon: Cpu, bg: "bg-page-bg border-divider", dot: "bg-text-muted" },
};

const FILTERS: { id: ActivityEventType | "all"; label: string }[] = [
  { id: "all", label: "All Events" },
  { id: "created", label: "Created" },
  { id: "updated", label: "Updated" },
  { id: "deleted", label: "Deleted" },
  { id: "finance", label: "Finance" },
  { id: "auth", label: "Auth" },
  { id: "system", label: "System" },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
};

function TimelineEvent({ event }: { event: ActivityEvent }) {
  const config = TYPE_CONFIG[event.type];
  const Icon = config.icon;

  return (
    <motion.div variants={itemVariants} className="flex gap-4 group">
      {/* Timeline column */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "w-9 h-9 rounded-full border flex items-center justify-center shrink-0 mt-0.5",
            config.bg
          )}
        >
          <Icon className="w-4 h-4 text-text-secondary" />
        </div>
        {/* Connector line */}
        <div className="w-px flex-1 bg-divider mt-2 mb-0" />
      </div>

      {/* Content */}
      <div className="pb-8 flex-1">
        <div className="bg-white border border-divider rounded-xl p-4 shadow-sm group-hover:border-border transition-colors">
          <div className="flex items-start justify-between gap-3 mb-2">
            <IDChip id={event.entityId} size="xs" />
            <span className="text-[10px] font-mono font-bold text-text-muted whitespace-nowrap mt-0.5">
              {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
            </span>
          </div>

          <p className="text-[13px] text-text-secondary leading-relaxed mb-3">
            {event.description}
          </p>

          <div className="flex items-center gap-2">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0"
              style={{ backgroundColor: event.actor.color }}
            >
              {event.actor.initials}
            </div>
            <span className="text-[11px] font-medium text-text-muted">{event.actor.name}</span>
            <span className="text-[11px] text-text-muted/50">·</span>
            <span
              className={cn(
                "text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border",
                config.bg,
                config.dot === "bg-success"
                  ? "text-success"
                  : config.dot === "bg-accent"
                    ? "text-accent"
                    : config.dot === "bg-red-500"
                      ? "text-red-500"
                      : config.dot === "bg-warning"
                        ? "text-warning"
                        : "text-text-muted"
              )}
            >
              {config.label}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ActivityPage() {
  const [activeFilter, setActiveFilter] = useState<ActivityEventType | "all">("all");

  const filtered =
    activeFilter === "all" ? MOCK_ACTIVITY : MOCK_ACTIVITY.filter((e) => e.type === activeFilter);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">Activity Timeline</h1>
          <p className="text-text-secondary mt-1">
            Global audit log of all system events and entity changes.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-bold text-text-muted bg-white border border-divider rounded-lg px-3 py-2">
          <Filter className="w-3.5 h-3.5" />
          {filtered.length} events
        </div>
      </motion.div>

      {/* Filter Pills */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-2"
      >
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={cn(
              "px-4 py-1.5 rounded-full text-[12px] font-bold border transition-all",
              activeFilter === f.id
                ? "bg-accent/10 text-accent border-accent/30"
                : "bg-white text-text-secondary border-border hover:border-accent/30 hover:text-accent"
            )}
          >
            {f.label}
          </button>
        ))}
      </motion.div>

      {/* Timeline */}
      <motion.div
        key={activeFilter}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-3xl"
      >
        {filtered.map((event) => (
          <TimelineEvent key={event.id} event={event} />
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-sm font-medium text-text-secondary">No events found.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
