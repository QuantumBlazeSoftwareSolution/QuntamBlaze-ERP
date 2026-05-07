"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Pencil, Trash2, ChevronRight } from "lucide-react";
import { useTaskPanel } from "@/hooks/useTaskPanel";
import { IDChip } from "@/components/ui/IDChip";
import { TaskMetaGrid } from "./TaskMetaGrid";
import { TaskDescription } from "./TaskDescription";
import { SubTaskList } from "./SubTaskList";
import { TaskAttachments } from "./TaskAttachments";
import { TaskActivityThread } from "./TaskActivityThread";
import { MOCK_TASK_DETAIL } from "@/lib/mockData/taskDetail";
import { TaskDetail, TaskComment } from "@/types/task";

export function TaskDetailPanel() {
  const { isOpen, closeTask, activeTaskId } = useTaskPanel();
  const [task, setTask] = useState<TaskDetail | null>(null);

  // Load task data when activeTaskId changes
  useEffect(() => {
    if (activeTaskId) {
      // Simulate fetching task by ID
      const timer = setTimeout(() => {
        setTask(MOCK_TASK_DETAIL);
      }, 0);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setTask(null);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [activeTaskId]);

  const handleUpdate = (field: keyof TaskDetail, value: unknown) => {
    if (!task) return;
    console.log(`[TASK ENGINE] Updating ${field}:`, value);
    setTask({ ...task, [field]: value } as TaskDetail);
  };

  const handlePostComment = (text: string) => {
    if (!task) return;
    const newComment: TaskComment = {
      id: `com-${Date.now()}`,
      userId: "USR-JD-26-001", // Hardcoded current user for mock
      userName: "James Doe",
      userInitials: "JD",
      userColor: "bg-accent/20 text-accent",
      text,
      timestamp: new Date().toISOString(),
    };
    setTask({
      ...task,
      activity: [newComment, ...task.activity],
    });
  };

  if (!isOpen || !task) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeTask}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Panel */}
        <motion.div
          initial={{ x: 480 }}
          animate={{ x: 0 }}
          exit={{ x: 480 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative w-full max-w-[480px] h-full bg-[#0A0A0A] border-l border-[#1A1A1A] shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#1A1A1A] flex items-center justify-between bg-[#0D0D0D]">
            <div className="flex items-center gap-3">
              <IDChip id={task.id} className="bg-accent/10 border-accent/20 text-accent font-mono text-xs px-3" />
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-white/5 rounded-lg text-text-secondary hover:text-text-primary transition-all">
                <Pencil className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-danger/10 rounded-lg text-text-secondary hover:text-danger transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="w-[1px] h-4 bg-[#1A1A1A] mx-1" />
              <button
                onClick={closeTask}
                className="p-2 hover:bg-white/5 rounded-lg text-text-secondary hover:text-text-primary transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.1em] text-text-secondary uppercase">
              <span className="hover:text-accent cursor-pointer transition-colors">{task.projectName}</span>
              <ChevronRight className="w-3 h-3 opacity-30" />
              <span className="text-[#3A3A3A] font-mono">{task.clientId}</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-text-primary tracking-tight leading-tight">
              {task.title}
            </h1>

            {/* Meta Grid */}
            <TaskMetaGrid task={task} onUpdate={handleUpdate} />

            {/* Description */}
            <TaskDescription 
              description={task.description} 
              onUpdate={(val) => handleUpdate("description", val)} 
            />

            {/* Sub-tasks */}
            <SubTaskList 
              subTasks={task.subTasks} 
              onToggle={(id) => {
                const updated = task.subTasks.map(st => 
                  st.id === id ? { ...st, isCompleted: !st.isCompleted } : st
                );
                handleUpdate("subTasks", updated);
              }}
              onAdd={(title) => {
                const newSubTask = {
                  id: `STSK-${task.id}-${String(task.subTasks.length + 1).padStart(2, "0")}`,
                  title,
                  isCompleted: false
                };
                handleUpdate("subTasks", [...task.subTasks, newSubTask]);
              }}
            />

            {/* Attachments */}
            <TaskAttachments attachments={task.attachments} />

            {/* Activity Thread */}
            <TaskActivityThread 
              comments={task.activity} 
              onPostComment={handlePostComment} 
            />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
