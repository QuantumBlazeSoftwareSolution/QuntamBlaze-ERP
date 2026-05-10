"use client";

import { ProjectStatus } from "@/types/project";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<
  string,
  { label: string; dotColor: string; borderColor: string; textColor: string }
> = {
  Active: {
    label: "Active",
    dotColor: "bg-accent",
    borderColor: "border-accent/40",
    textColor: "text-accent",
  },
  "On-Hold": {
    label: "On-Hold",
    dotColor: "bg-warning",
    borderColor: "border-warning/40",
    textColor: "text-warning",
  },
  Completed: {
    label: "Completed",
    dotColor: "bg-success",
    borderColor: "border-success/40",
    textColor: "text-success",
  },
  Planning: {
    label: "Planning",
    dotColor: "bg-blue-500",
    borderColor: "border-blue-200",
    textColor: "text-blue-600",
  },
  Cancelled: {
    label: "Cancelled",
    dotColor: "bg-red-500",
    borderColor: "border-red-200",
    textColor: "text-red-600",
  },
};

export function ProjectStatusChip({ status }: { status: ProjectStatus }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG["Active"];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-[0.1em] uppercase border",
        config.borderColor,
        config.textColor
      )}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
      {config.label}
    </span>
  );
}
