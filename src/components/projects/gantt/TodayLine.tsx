"use client";

import { getPositionPercent } from "@/lib/gantt/dateUtils";

interface TodayLineProps {
  viewStart: Date;
  viewEnd: Date;
  totalHeight: number;
}

export function TodayLine({ viewStart, viewEnd, totalHeight }: TodayLineProps) {
  const today = new Date();
  if (today < viewStart || today > viewEnd) return null;

  const leftPct = getPositionPercent(today, viewStart, viewEnd);

  return (
    <div
      className="absolute top-0 z-10 pointer-events-none"
      style={{ left: `${leftPct}%`, height: totalHeight }}
    >
      {/* Label */}
      <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold tracking-[0.08em] text-accent uppercase whitespace-nowrap">
        Today
      </div>
      {/* Dashed line */}
      <div
        className="absolute top-0 bottom-0 border-l border-dashed"
        style={{ borderColor: "rgba(0, 229, 255, 0.4)", left: 0 }}
      />
    </div>
  );
}
