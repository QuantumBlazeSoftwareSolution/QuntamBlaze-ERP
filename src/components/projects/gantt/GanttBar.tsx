"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { GanttTask, GanttStatus } from "@/types/gantt";
import { getPositionPercent, getWidthPercent } from "@/lib/gantt/dateUtils";
import { cn } from "@/lib/utils";

const STATUS_COLORS: Record<GanttStatus, string> = {
  "In Progress": "bg-accent",
  "Done": "bg-success",
  "Blocked": "bg-danger",
  "To-Do": "bg-[#3A3A3A]",
};

interface GanttBarProps {
  task: GanttTask;
  viewStart: Date;
  viewEnd: Date;
  rowIndex: number;
  rowHeight: number;
}

export function GanttBar({ task, viewStart, viewEnd, rowIndex, rowHeight }: GanttBarProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const taskStart = parseISO(task.start);
  const taskEnd = parseISO(task.end);

  const leftPct = getPositionPercent(taskStart, viewStart, viewEnd);
  const widthPct = getWidthPercent(taskStart, taskEnd, viewStart, viewEnd);
  const color = STATUS_COLORS[task.status];

  const topPx = rowIndex * rowHeight + (rowHeight - 24) / 2;

  return (
    <div
      className="absolute"
      style={{
        left: `${leftPct}%`,
        width: `${widthPct}%`,
        top: `${topPx}px`,
        height: "24px",
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <motion.div
        className={cn("w-full h-full rounded-[4px] relative flex items-center overflow-hidden cursor-pointer", color)}
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5, delay: rowIndex * 0.04, ease: "easeOut" }}
        style={{ transformOrigin: "left" }}
      >
        {/* Assignee on left edge */}
        {task.assignee && (
          <div
            className={cn(
              "w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-bold ml-1 border border-white/20",
              task.assignee.color
            )}
          >
            {task.assignee.initials}
          </div>
        )}
        {/* Subtle shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0" />
      </motion.div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-0 mb-2 z-50 bg-bg-surface border border-border rounded-lg p-3 shadow-xl min-w-[200px] pointer-events-none">
          <div className="text-[10px] font-mono text-accent mb-1">{task.id}</div>
          <div className="text-sm font-medium text-text-primary mb-2">{task.name}</div>
          <div className="text-[11px] text-text-secondary space-y-0.5">
            <div>Start: {format(taskStart, "MMM dd, yyyy")}</div>
            <div>End: &nbsp;&nbsp;{format(taskEnd, "MMM dd, yyyy")}</div>
            {task.assignee && <div>Owner: {task.assignee.initials}</div>}
          </div>
        </div>
      )}
    </div>
  );
}
