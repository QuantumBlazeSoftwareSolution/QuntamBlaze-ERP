"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Check } from "lucide-react";
import { SubTask } from "@/types/task";
import { cn } from "@/lib/utils";

interface SubTaskListProps {
  subTasks: SubTask[];
  onToggle: (subTaskId: string) => void;
  onAdd: (title: string) => void;
}

export function SubTaskList({ subTasks, onToggle, onAdd }: SubTaskListProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const handleAdd = () => {
    if (newTitle.trim()) {
      onAdd(newTitle.trim());
      setNewTitle("");
      setIsAdding(false);
    }
  };

  const completedCount = subTasks.filter(st => st.isCompleted).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-bold tracking-[0.1em] text-text-secondary uppercase">
          Sub-Tasks
        </label>
        <span className="text-[10px] font-mono text-text-secondary bg-[#1A1A1A] px-1.5 py-0.5 rounded">
          {completedCount}/{subTasks.length}
        </span>
      </div>

      <div className="space-y-2">
        {subTasks.map((st) => (
          <div key={st.id} className="flex items-center gap-3 group">
            <button
              onClick={() => onToggle(st.id)}
              className={cn(
                "w-4 h-4 rounded border transition-all flex items-center justify-center",
                st.isCompleted 
                  ? "bg-success border-success shadow-[0_0_8px_rgba(0,200,150,0.3)]" 
                  : "bg-transparent border-[#3A3A3A] group-hover:border-[#5A5A5A]"
              )}
            >
              <AnimatePresence>
                {st.isCompleted && (
                  <motion.div
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    exit={{ pathLength: 0, opacity: 0 }}
                  >
                    <Check className="w-3 h-3 text-[#050505]" strokeWidth={4} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
            <div className="flex-1 min-w-0">
              <div className="text-[9px] font-mono text-text-secondary/40">{st.id}</div>
              <span className={cn(
                "text-sm transition-all",
                st.isCompleted ? "text-[#3A3A3A] line-through" : "text-text-primary"
              )}>
                {st.title}
              </span>
            </div>
          </div>
        ))}

        {isAdding ? (
          <div className="flex items-center gap-3 pt-2">
            <div className="w-4 h-4 rounded border border-[#3A3A3A]" />
            <input
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              onBlur={() => !newTitle && setIsAdding(false)}
              placeholder="Enter sub-task title..."
              className="flex-1 bg-transparent text-sm text-text-primary focus:outline-none placeholder:text-text-secondary/20"
            />
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 text-[11px] font-bold tracking-[0.1em] text-text-secondary hover:text-accent transition-colors pt-2 uppercase"
          >
            <Plus className="w-3.5 h-3.5" />
            Add sub-task
          </button>
        )}
      </div>
    </div>
  );
}
