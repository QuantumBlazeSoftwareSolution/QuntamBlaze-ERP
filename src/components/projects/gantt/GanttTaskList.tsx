"use client";

import { GanttTask } from "@/types/gantt";
import { IDChip } from "@/components/ui/IDChip";
import { ProjectStatusChip } from "@/components/projects/ProjectStatusChip";
import { ProjectStatus } from "@/lib/mockData/projects";
import { cn } from "@/lib/utils";
import { useTaskPanel } from "@/hooks/useTaskPanel";

const STATUS_MAP: Record<string, ProjectStatus> = {
  "In Progress": "Active",
  "Done": "Completed",
  "Blocked": "OnHold",
  "To-Do": "Draft",
};

interface GanttTaskListProps {
  tasks: GanttTask[];
  rowHeight: number;
}

export function GanttTaskList({ tasks, rowHeight }: GanttTaskListProps) {
  const { openTask } = useTaskPanel();

  return (
    <div className="w-[280px] flex-shrink-0 border-r border-[#1A1A1A] bg-[#050505]">
      {/* Header placeholder to align with timeline header */}
      <div
        className="border-b border-[#1A1A1A] bg-[#0A0A0A] flex items-center px-4"
        style={{ height: rowHeight }}
      >
        <span className="text-[10px] font-bold tracking-[0.1em] text-text-secondary uppercase">
          Tasks
        </span>
      </div>

      {/* Task Rows */}
      {tasks.map((task) => (
        <div
          key={task.id}
          onClick={() => openTask(task.id)}
          className="flex items-center gap-3 px-4 border-b border-[#0F0F0F] hover:bg-[#0A0A0A] transition-colors cursor-pointer group"
          style={{ height: rowHeight }}
        >
          {/* Assignee Avatar */}
          {task.assignee && (
            <div
              className={cn(
                "w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-bold",
                task.assignee.color
              )}
            >
              {task.assignee.initials}
            </div>
          )}

          {/* Task Details */}
          <div className="flex-1 min-w-0">
            <IDChip
              id={task.id}
              className="text-[9px] px-1 py-0 bg-transparent border-none shadow-none text-text-secondary/50 mb-0.5 group-hover:text-accent transition-colors"
            />
            <div className="text-[12px] font-medium text-text-primary truncate leading-none group-hover:text-accent transition-colors">
              {task.name}
            </div>
          </div>

          {/* Status */}
          <div className="flex-shrink-0">
            <ProjectStatusChip status={STATUS_MAP[task.status] ?? "Draft"} />
          </div>
        </div>
      ))}
    </div>
  );
}
