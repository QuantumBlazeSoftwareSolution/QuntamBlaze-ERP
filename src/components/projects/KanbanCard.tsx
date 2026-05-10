"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { KanbanTask, Priority } from "@/types/kanban";
import { GripVertical, CheckSquare, Clock, AlertTriangle } from "lucide-react";
import { IDChip } from "@/components/ui/IDChip";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useTaskPanel } from "@/hooks/useTaskPanel";

interface KanbanCardProps {
  task: KanbanTask;
  isOverlay?: boolean;
}

const PRIORITY_STYLES: Record<Priority, string> = {
  Critical: "bg-red-50 text-red-600 border-red-100",
  High: "bg-amber-50 text-amber-600 border-amber-100",
  Medium: "bg-blue-50 text-blue-600 border-blue-100",
  Low: "bg-slate-50 text-slate-400 border-slate-100",
};

export function KanbanCard({ task, isOverlay }: KanbanCardProps) {
  const { openTask } = useTaskPanel();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: isOverlay,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const isOverdue = new Date(task.dueDate) < new Date() && task.columnId !== "Done";

  if (isDragging && !isOverlay) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="w-full h-[120px] bg-[#F8FAFC] border-2 border-dashed border-[#E2E8F0] rounded-xl"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => openTask(task.id)}
      className={cn(
        "bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-sm hover:border-[#CBD5E1] transition-all cursor-grab active:cursor-grabbing group select-none",
        isOverlay && "cursor-grabbing shadow-2xl ring-2 ring-[#10B981]/20",
        isDragging && "opacity-50"
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <IDChip
          id={task.id}
          size="xs"
          className="font-bold opacity-70 group-hover:opacity-100 transition-opacity"
        />
        <GripVertical className="w-4 h-4 text-[#CBD5E1] opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <h4 className="text-[#0F172A] text-sm font-bold leading-tight mb-4 group-hover:text-[#10B981] transition-colors">
        {task.title}
      </h4>

      <div className="flex items-center gap-2 mb-4">
        <div
          className={cn(
            "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
            PRIORITY_STYLES[task.priority]
          )}
        >
          {task.priority}
        </div>
        {task.subTasksTotal > 0 && (
          <div className="flex items-center gap-1 text-[10px] font-bold text-[#94A3B8]">
            <CheckSquare className="w-3 h-3" />
            {task.subTasksDone}/{task.subTasksTotal}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-[#F1F5F9]">
        <div className="flex -space-x-1.5">
          {task.assignees.map((user, idx) => (
            <div
              key={idx}
              className={cn(
                "w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-white text-[8px] font-black",
                user.color
              )}
            >
              {user.initials}
            </div>
          ))}
        </div>

        <div
          className={cn(
            "flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[10px] font-bold",
            isOverdue
              ? "bg-red-50 border-red-100 text-red-600"
              : "bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B]"
          )}
        >
          {isOverdue ? <AlertTriangle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
          {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </div>
      </div>
    </div>
  );
}
