"use client";

import React, { useMemo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { KanbanColumnType, KanbanTask } from '@/types/kanban';
import { KanbanCard } from './KanbanCard';
import { Plus, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  column: KanbanColumnType;
  tasks: KanbanTask[];
}

export function KanbanColumn({ column, tasks }: KanbanColumnProps) {
  const taskIds = useMemo(() => tasks.map(t => t.id), [tasks]);

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
  });

  return (
    <div 
      ref={setNodeRef}
      className={cn(
        "flex flex-col w-[280px] bg-white border border-[#E2E8F0] rounded-xl overflow-hidden h-fit max-h-full transition-all duration-200",
        isOver && "border-dashed border-2 border-[#10B981]/40 bg-[#ECFDF5]/30 ring-4 ring-[#10B981]/5"
      )}
    >
      {/* Header */}
      <div className={cn(
        "px-4 py-3 border-b-2 flex items-center justify-between bg-white sticky top-0 z-10",
        column.accentColor.includes('emerald') ? "border-b-[#10B981]" : 
        column.accentColor.includes('amber') ? "border-b-amber-500" :
        column.accentColor.includes('blue') ? "border-b-blue-500" : "border-b-slate-100"
      )}>
        <div className="flex items-center gap-2">
          <h3 className="text-[#0F172A] text-sm font-bold uppercase tracking-wider">{column.title}</h3>
          <AnimatePresence mode="wait">
            <motion.span
              key={tasks.length}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[#F1F5F9] text-[#475569] text-[10px] font-black px-2 py-0.5 rounded-full"
            >
              {tasks.length}
            </motion.span>
          </AnimatePresence>
        </div>
        <button className="text-[#94A3B8] hover:text-[#0F172A] transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Task List */}
      <div className="p-3 space-y-3 min-h-[150px] overflow-y-auto custom-scrollbar-hide">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task, idx) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <KanbanCard task={task} />
            </motion.div>
          ))}
        </SortableContext>
      </div>

      {/* Footer */}
      <button className="p-4 flex items-center justify-center gap-2 text-[#94A3B8] hover:text-[#10B981] text-xs font-bold uppercase tracking-widest border-t border-[#F1F5F9] hover:bg-[#F8FAFC] transition-all group">
        <Plus className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
        Add Task
      </button>
    </div>
  );
}
