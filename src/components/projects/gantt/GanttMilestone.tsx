"use client";

import { useState } from "react";
import { GanttMilestoneType } from "@/types/gantt";
import { getPositionPercent } from "@/lib/gantt/dateUtils";
import { parseISO } from "date-fns";

interface GanttMilestoneProps {
  milestone: GanttMilestoneType;
  viewStart: Date;
  viewEnd: Date;
  totalHeight: number;
}

export function GanttMilestone({ milestone, viewStart, viewEnd, totalHeight }: GanttMilestoneProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const date = parseISO(milestone.date);
  const leftPct = getPositionPercent(date, viewStart, viewEnd);

  return (
    <div
      className="absolute top-0 z-20"
      style={{ left: `${leftPct}%`, height: totalHeight }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Vertical dashed line */}
      <div
        className="absolute top-0 bottom-0 border-l border-dashed border-warning/40"
        style={{ left: "6px" }}
      />

      {/* Diamond */}
      <div
        className="absolute top-0"
        style={{
          left: 0,
          width: 12,
          height: 12,
          backgroundColor: "#FFB800",
          transform: "rotate(45deg)",
          marginTop: "-6px",
          boxShadow: "0 0 8px rgba(255,184,0,0.5)",
        }}
      />

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute top-4 left-4 z-50 bg-bg-surface border border-warning/30 rounded-lg p-2.5 shadow-xl min-w-[160px] pointer-events-none">
          <div className="text-[10px] font-mono text-warning mb-0.5">{milestone.id}</div>
          <div className="text-sm font-medium text-text-primary">{milestone.label}</div>
        </div>
      )}
    </div>
  );
}
