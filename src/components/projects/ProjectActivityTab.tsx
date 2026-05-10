"use client";

import React from "react";
import {
  CheckCircle2,
  Clock,
  FileText,
  DollarSign,
  MessageSquare,
  User,
  ArrowUpRight,
  Zap,
  MoreVertical,
} from "lucide-react";
import { IDChip } from "@/components/ui/IDChip";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface Activity {
  id: string;
  type: "task" | "document" | "financial" | "system" | "communication";
  user: { name: string; initials: string; color: string };
  action: string;
  entityId?: string;
  timestamp: string;
  details?: string;
}

const MOCK_ACTIVITIES: Activity[] = [
  {
    id: "ACT-001",
    type: "system",
    user: { name: "System Orchestrator", initials: "SO", color: "bg-slate-900" },
    action: "Project phase transitioned to",
    details: "Integration Phase (v2.4 Calibration)",
    timestamp: "2 hours ago",
  },
  {
    id: "ACT-002",
    type: "task",
    user: { name: "Alice Lee", initials: "AL", color: "bg-blue-500" },
    action: "Completed critical task",
    entityId: "TSK-26-042",
    timestamp: "5 hours ago",
  },
  {
    id: "ACT-003",
    type: "document",
    user: { name: "John Doe", initials: "JD", color: "bg-emerald-500" },
    action: "Uploaded signed agreement",
    entityId: "AGR-GOOG-26-001",
    timestamp: "Yesterday, 14:20",
  },
  {
    id: "ACT-004",
    type: "financial",
    user: { name: "Sarah Chen", initials: "SC", color: "bg-amber-500" },
    action: "Approved milestone invoice",
    entityId: "INV-26-089",
    timestamp: "2 days ago",
  },
  {
    id: "ACT-005",
    type: "communication",
    user: { name: "Mike King", initials: "MK", color: "bg-violet-500" },
    action: "Added comment to scope artifact",
    details: '"Infrastructure redundancy requirements updated."',
    timestamp: "3 days ago",
  },
];

export function ProjectActivityTab() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Activity Filter Header */}
      <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-6">
        <div>
          <h3 className="text-lg font-black text-[#0F172A] tracking-tight uppercase">
            Audit Timeline
          </h3>
          <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest mt-1">
            Chronological project orchestration logs
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 rounded-lg bg-[#10B981]/10 text-[#10B981] text-[10px] font-black uppercase tracking-widest border border-[#10B981]/20">
            Live Sync
          </button>
          <button className="p-2 rounded-lg bg-white border border-[#E2E8F0] text-[#94A3B8] hover:text-[#0F172A] transition-all">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Timeline List */}
      <div className="relative space-y-12 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:-translate-x-px before:bg-[#E2E8F0]">
        {MOCK_ACTIVITIES.map((activity, idx) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="relative flex items-start gap-8"
          >
            {/* Icon Bubble */}
            <div
              className={cn(
                "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-4 border-white shadow-sm",
                activity.type === "task" && "bg-blue-500 text-white shadow-blue-500/20",
                activity.type === "document" && "bg-emerald-500 text-white shadow-emerald-500/20",
                activity.type === "financial" && "bg-amber-500 text-white shadow-amber-500/20",
                activity.type === "system" && "bg-slate-900 text-white shadow-slate-900/20",
                activity.type === "communication" && "bg-violet-500 text-white shadow-violet-500/20"
              )}
            >
              <ActivityIcon type={activity.type} />
            </div>

            {/* Content Card */}
            <div className="flex-1 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold text-white",
                      activity.user.color
                    )}
                  >
                    {activity.user.initials}
                  </div>
                  <span className="text-sm font-bold text-[#0F172A]">{activity.user.name}</span>
                </div>
                <span className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  {activity.timestamp}
                </span>
              </div>

              <p className="text-sm text-[#475569] leading-relaxed">
                {activity.action}{" "}
                {activity.details && (
                  <span className="font-bold text-[#0F172A]">{activity.details}</span>
                )}
              </p>

              {activity.entityId && (
                <div className="mt-4 flex items-center gap-2">
                  <IDChip id={activity.entityId} size="xs" variant="accent" />
                  <button className="flex items-center gap-1 text-[10px] font-black text-[#3B82F6] uppercase tracking-widest hover:underline">
                    View Context
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center pt-8">
        <button className="px-8 py-3 bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl text-xs font-black text-[#475569] uppercase tracking-[0.2em] hover:bg-[#E2E8F0] transition-all">
          Load Full Audit Archive
        </button>
      </div>
    </div>
  );
}

function ActivityIcon({ type }: { type: Activity["type"] }) {
  switch (type) {
    case "task":
      return <CheckCircle2 className="w-5 h-5" />;
    case "document":
      return <FileText className="w-5 h-5" />;
    case "financial":
      return <DollarSign className="w-5 h-5" />;
    case "system":
      return <Zap className="w-5 h-5" />;
    case "communication":
      return <MessageSquare className="w-5 h-5" />;
    default:
      return null;
  }
}
