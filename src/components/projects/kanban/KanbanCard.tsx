"use client";

import { motion } from "framer-motion";
import { Clock, CheckSquare, GripVertical } from "lucide-react";
import { KanbanTask, Priority } from "@/types/kanban";
import { IDChip } from "@/components/ui/IDChip";
import { isPast, parseISO, format } from "date-fns";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { useTaskPanel } from "@/hooks/useTaskPanel";

const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; bg: string }> = {
  Critical: { label: "Critical", color: "text-danger", bg: "bg-danger/10 border-danger/30" },
  High: { label: "High", color: "text-warning", bg: "bg-warning/10 border-warning/30" },
  Medium: { label: "Medium", color: "text-accent", bg: "bg-accent/10 border-accent/30" },
  Low: { label: "Low", color: "text-[#3A3A3A]", bg: "bg-[#3A3A3A]/10 border-[#3A3A3A]/30" },
};

interface KanbanCardProps {
  task: KanbanTask;
  isDragging?: boolean;
  isOverlay?: boolean;
}

export function KanbanCard({ task, isDragging, isOverlay }: KanbanCardProps) {
  const { openTask } = useTaskPanel();
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priority = PRIORITY_CONFIG[task.priority];
  const dueDate = parseISO(task.dueDate);
  const isOverdue = isPast(dueDate);
  const visibleAssignees = task.assignees.slice(0, 2);
  const overflowCount = task.assignees.length - 2;

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    openTask(task.id);
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className={cn(
        "relative bg-[#0F0F0F] border rounded-lg p-3.5 cursor-grab active:cursor-grabbing select-none group transition-all",
        isOverlay
          ? "border-accent/20 shadow-[0_16px_40px_rgba(0,0,0,0.6),0_0_20px_rgba(0,229,255,0.13)] rotate-1"
          : isDragging
          ? "border-[#252525] opacity-40"
          : "border-[#1A1A1A] hover:border-[#252525] hover:shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
      )}
      {...attributes}
      {...listeners}
    >
      {/* Top Row: ID + Drag Handle */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div onClick={handleOpen} className="cursor-pointer">
          <IDChip
            id={task.id}
            className="text-[10px] px-1.5 py-0.5 bg-transparent border-none shadow-none text-text-secondary/60 hover:text-accent pointer-events-none"
          />
        </div>
        <GripVertical className="w-3.5 h-3.5 text-[#3A3A3A] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
      </div>

      {/* Title */}
      <p 
        onClick={handleOpen}
        className="text-sm font-medium text-text-primary leading-snug mb-3 cursor-pointer hover:text-accent transition-colors"
      >
        {task.title}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2">
        {/* Left: Priority + Subtasks */}
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-[9px] font-bold tracking-[0.08em] uppercase px-1.5 py-0.5 rounded border",
              priority.bg,
              priority.color
            )}
          >
            {priority.label}
          </span>
          {task.subTasksTotal > 0 && (
            <span className="flex items-center gap-1 text-[11px] text-text-secondary">
              <CheckSquare className="w-3 h-3" />
              {task.subTasksDone}/{task.subTasksTotal}
            </span>
          )}
        </div>

        {/* Right: Assignees + Due Date */}
        <div className="flex items-center gap-2">
          {/* Stacked Avatars */}
          <div className="flex items-center">
            {visibleAssignees.map((a, i) => (
              <div
                key={a.initials}
                style={{ marginLeft: i > 0 ? "-6px" : 0 }}
                className={cn(
                  "w-5 h-5 rounded-full border border-[#0F0F0F] flex items-center justify-center text-[9px] font-bold z-10",
                  a.color
                )}
              >
                {a.initials}
              </div>
            ))}
            {overflowCount > 0 && (
              <div
                style={{ marginLeft: "-6px" }}
                className="w-5 h-5 rounded-full border border-[#0F0F0F] bg-[#1A1A1A] flex items-center justify-center text-[9px] font-bold text-text-secondary z-10"
              >
                +{overflowCount}
              </div>
            )}
          </div>

          {/* Due Date */}
          <span
            className={cn(
              "flex items-center gap-1 text-[10px] font-mono",
              isOverdue ? "text-danger" : "text-text-secondary"
            )}
          >
            <Clock className="w-3 h-3" />
            {format(dueDate, "MMM dd")}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
