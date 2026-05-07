"use client";

import { ProjectStatus } from "@/lib/mockData/projects";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<
  ProjectStatus,
  { label: string; dotColor: string; borderColor: string; textColor: string }
> = {
  Active: {
    label: "Active",
    dotColor: "bg-accent",
    borderColor: "border-accent/40",
    textColor: "text-accent",
  },
  Review: {
    label: "Review",
    dotColor: "bg-warning",
    borderColor: "border-warning/40",
    textColor: "text-warning",
  },
  OnHold: {
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
  Draft: {
    label: "Draft",
    dotColor: "bg-[#3A3A3A]",
    borderColor: "border-[#3A3A3A]/40",
    textColor: "text-[#3A3A3A]",
  },
};

export function ProjectStatusChip({ status }: { status: ProjectStatus }) {
  const config = STATUS_CONFIG[status];

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
