"use client";

import { Calendar, Users, ChevronDown } from "lucide-react";
import { TaskDetail } from "@/types/task";
import { cn } from "@/lib/utils";

interface TaskMetaGridProps {
  task: TaskDetail;
  onUpdate: (field: keyof TaskDetail, value: unknown) => void;
}

export function TaskMetaGrid({ task, onUpdate }: TaskMetaGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Status */}
      <div className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-lg p-3 space-y-1">
        <label className="text-[10px] font-bold tracking-[0.1em] text-text-secondary uppercase">Status</label>
        <div className="relative">
          <select
            value={task.status}
            onChange={(e) => onUpdate("status", e.target.value)}
            className="w-full bg-transparent text-sm text-text-primary appearance-none focus:outline-none cursor-pointer"
          >
            <option value="Backlog">Backlog</option>
            <option value="In Progress">In Progress</option>
            <option value="Review">Review</option>
            <option value="Done">Done</option>
          </select>
          <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
        </div>
      </div>

      {/* Priority */}
      <div className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-lg p-3 space-y-1">
        <label className="text-[10px] font-bold tracking-[0.1em] text-text-secondary uppercase">Priority</label>
        <div className="relative">
          <select
            value={task.priority}
            onChange={(e) => onUpdate("priority", e.target.value)}
            className="w-full bg-transparent text-sm text-text-primary appearance-none focus:outline-none cursor-pointer"
          >
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
        </div>
      </div>

      {/* Assignee */}
      <div className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-lg p-3 space-y-1">
        <label className="text-[10px] font-bold tracking-[0.1em] text-text-secondary uppercase flex items-center justify-between">
          Assignee
          <Users className="w-3 h-3" />
        </label>
        <div className="flex items-center gap-2 mt-1">
          {task.assignees.map((a) => (
            <div
              key={a.id}
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border border-[#1A1A1A]",
                a.color
              )}
              title={a.name}
            >
              {a.initials}
            </div>
          ))}
          <button className="w-6 h-6 rounded-full border border-dashed border-[#3A3A3A] flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors">
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Due Date */}
      <div className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-lg p-3 space-y-1">
        <label className="text-[10px] font-bold tracking-[0.1em] text-text-secondary uppercase flex items-center justify-between">
          Due Date
          <Calendar className="w-3 h-3" />
        </label>
        <input
          type="date"
          value={task.dueDate}
          onChange={(e) => onUpdate("dueDate", e.target.value)}
          className="w-full bg-transparent text-sm text-text-primary focus:outline-none cursor-pointer mt-1"
        />
      </div>
    </div>
  );
}

function Plus({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14"/><path d="M12 5v14"/>
    </svg>
  );
}
