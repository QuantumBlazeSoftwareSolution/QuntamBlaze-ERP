"use client";

import { ViewMode } from "@/types/gantt";
import { cn } from "@/lib/utils";

interface ZoomControlsProps {
  viewMode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

const MODES: { id: ViewMode; label: string }[] = [
  { id: "day", label: "Day" },
  { id: "week", label: "Week" },
  { id: "month", label: "Month" },
];

export function ZoomControls({ viewMode, onChange }: ZoomControlsProps) {
  return (
    <div className="flex items-center gap-1 bg-bg-surface border border-border rounded-lg p-1">
      {MODES.map((m) => (
        <button
          key={m.id}
          onClick={() => onChange(m.id)}
          className={cn(
            "px-3 py-1.5 rounded text-[11px] font-bold tracking-[0.1em] uppercase transition-all",
            viewMode === m.id
              ? "bg-bg-card text-text-primary"
              : "text-text-secondary hover:text-text-primary"
          )}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
