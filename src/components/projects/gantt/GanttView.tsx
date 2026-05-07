"use client";

import { useState } from "react";
import { GanttTask, GanttMilestoneType, ViewMode } from "@/types/gantt";
import { buildViewRange, buildHeaderColumns } from "@/lib/gantt/dateUtils";
import { GanttTaskList } from "./GanttTaskList";
import { GanttBar } from "./GanttBar";
import { GanttMilestone } from "./GanttMilestone";
import { TodayLine } from "./TodayLine";
import { ZoomControls } from "./ZoomControls";

const ROW_HEIGHT = 48;
const HEADER_HEIGHT = 48;

// Column width in px per view mode — controls horizontal scale
const COL_WIDTH_PX: Record<ViewMode, number> = {
  day: 40,
  week: 120,
  month: 200,
};

interface GanttViewProps {
  tasks: GanttTask[];
  milestones?: GanttMilestoneType[];
  initialViewMode?: ViewMode;
}

export function GanttView({ tasks, milestones = [], initialViewMode = "month" }: GanttViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);

  const { viewStart, viewEnd } = buildViewRange(
    tasks.map((t) => ({ start: t.start, end: t.end })),
    milestones.map((m) => ({ date: m.date }))
  );

  const headerCols = buildHeaderColumns(viewStart, viewEnd, viewMode);
  const totalTimelineHeight = tasks.length * ROW_HEIGHT;

  // Calculate a minimum width from column widths to allow scrolling
  const minWidth = headerCols.length * COL_WIDTH_PX[viewMode];

  return (
    <div className="bg-[#050505] rounded-xl border border-[#1A1A1A] overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1A1A1A] bg-[#0A0A0A]">
        <h3 className="text-[11px] font-bold tracking-[0.1em] text-text-secondary uppercase">
          Timeline
        </h3>
        <ZoomControls viewMode={viewMode} onChange={setViewMode} />
      </div>

      {/* Board: Task List + Timeline side by side */}
      <div className="flex overflow-hidden">
        {/* Fixed Task List */}
        <GanttTaskList tasks={tasks} rowHeight={ROW_HEIGHT} />

        {/* Scrollable Timeline */}
        <div className="flex-1 overflow-x-auto hide-scrollbar">
          <div style={{ minWidth: `${minWidth}px`, position: "relative" }}>

            {/* Header Columns */}
            <div
              className="flex border-b border-[#1A1A1A] bg-[#0A0A0A] sticky top-0 z-20"
              style={{ height: HEADER_HEIGHT }}
            >
              {headerCols.map((col, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center border-r border-[#1A1A1A] flex-shrink-0"
                  style={{ width: `${col.widthPercent}%`, minWidth: `${COL_WIDTH_PX[viewMode]}px` }}
                >
                  <span className="text-[10px] font-bold tracking-[0.08em] text-text-secondary uppercase truncate px-2">
                    {col.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Grid rows background */}
            <div className="relative" style={{ height: totalTimelineHeight }}>
              {/* Horizontal grid lines per row */}
              {tasks.map((_, i) => (
                <div
                  key={i}
                  className="absolute left-0 right-0 border-b border-[#0F0F0F]"
                  style={{ top: (i + 1) * ROW_HEIGHT - 1 }}
                />
              ))}

              {/* Vertical column grid lines */}
              {headerCols.map((col, i) => (
                <div
                  key={i}
                  className="absolute top-0 bottom-0 border-l border-[#0F0F0F]"
                  style={{ left: `${col.widthPercent * i}%` }}
                />
              ))}

              {/* Today line */}
              <TodayLine
                viewStart={viewStart}
                viewEnd={viewEnd}
                totalHeight={totalTimelineHeight}
              />

              {/* Milestone markers */}
              {milestones.map((m) => (
                <GanttMilestone
                  key={m.id}
                  milestone={m}
                  viewStart={viewStart}
                  viewEnd={viewEnd}
                  totalHeight={totalTimelineHeight}
                />
              ))}

              {/* Task bars */}
              {tasks.map((task, i) => (
                <GanttBar
                  key={task.id}
                  task={task}
                  viewStart={viewStart}
                  viewEnd={viewEnd}
                  rowIndex={i}
                  rowHeight={ROW_HEIGHT}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
