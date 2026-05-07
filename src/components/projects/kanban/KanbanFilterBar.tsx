"use client";

import { ChevronDown } from "lucide-react";
import { Priority } from "@/types/kanban";

const PRIORITIES: Priority[] = ["Critical", "High", "Medium", "Low"];

interface KanbanFilterBarProps {
  selectedPriority: string;
  onPriorityChange: (p: string) => void;
}

export function KanbanFilterBar({ selectedPriority, onPriorityChange }: KanbanFilterBarProps) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="relative">
        <select
          value={selectedPriority}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="appearance-none bg-bg-surface border border-border rounded-lg px-3 py-1.5 pr-7 text-[12px] text-text-secondary focus:outline-none focus:border-accent cursor-pointer transition-colors"
        >
          <option value="">All Priorities</option>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-text-secondary pointer-events-none" />
      </div>
    </div>
  );
}
