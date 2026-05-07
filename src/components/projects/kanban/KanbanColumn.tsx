"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { KanbanColumnType, KanbanTask } from "@/types/kanban";
import { KanbanCard } from "./KanbanCard";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
  column: KanbanColumnType;
  tasks: KanbanTask[];
  isOver: boolean;
  activeTaskId: string | null;
  onAddTask: () => void;
}

export function KanbanColumn({ column, tasks, isOver, activeTaskId, onAddTask }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id: column.id });

  return (
    <div
      className={cn(
        "flex flex-col w-[280px] flex-shrink-0 rounded-xl border transition-all",
        isOver
          ? "border-dashed border-accent/30 bg-[#0D0D0D]"
          : "border-[#1A1A1A] bg-[#0A0A0A]"
      )}
      style={{ minHeight: "480px" }}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#1A1A1A]">
        <span className={cn("text-[11px] font-bold tracking-[0.1em] uppercase", column.accentColor)}>
          {column.title}
        </span>
        <AnimatePresence mode="wait">
          <motion.span
            key={tasks.length}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="text-[10px] font-mono font-bold text-text-secondary bg-bg-surface border border-border rounded-full px-2 py-0.5 min-w-[24px] text-center"
          >
            {tasks.length}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Drop Zone + Cards */}
      <div ref={setNodeRef} className="flex-1 flex flex-col gap-2.5 p-3 overflow-y-auto">
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <KanbanCard
              key={task.id}
              task={task}
              isDragging={task.id === activeTaskId}
            />
          ))}
        </SortableContext>

        {/* Drop placeholder when over */}
        {isOver && activeTaskId && !tasks.find((t) => t.id === activeTaskId) && (
          <div className="h-[88px] rounded-lg border border-dashed border-[#1A1A1A] bg-transparent" />
        )}
      </div>

      {/* Add Task Button */}
      <div className="px-3 pb-3">
        <button
          onClick={onAddTask}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-dashed border-[#1A1A1A] text-[11px] font-bold tracking-[0.1em] text-text-secondary hover:text-text-primary hover:border-[#252525] uppercase transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Task
        </button>
      </div>
    </div>
  );
}
