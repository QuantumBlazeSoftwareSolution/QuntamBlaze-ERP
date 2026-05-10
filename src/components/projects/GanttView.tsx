"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  format, 
  addDays, 
  startOfToday, 
  isSameDay, 
  eachDayOfInterval, 
  startOfMonth, 
  endOfMonth,
  eachWeekOfInterval
} from 'date-fns';
import { GanttTask, ViewMode, GanttStatus } from '@/types/gantt';
import { IDChip } from '@/components/ui/IDChip';
import { cn } from '@/lib/utils';
import { 
  getTaskWidth, 
  getPositionFromDate, 
  generateTimelineDays 
} from '@/lib/gantt/dateUtils';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Layers,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

const MOCK_GANTT_TASKS: GanttTask[] = [
  { id: 'TSK-26-001', name: 'Requirement Gathering', start: '2026-05-01', end: '2026-05-07', status: 'Done', assignee: { initials: 'JD', color: 'bg-emerald-500' } },
  { id: 'TSK-26-002', name: 'UI/UX Design Phase', start: '2026-05-05', end: '2026-05-15', status: 'Done', assignee: { initials: 'AL', color: 'bg-blue-500' }, dependsOn: 'TSK-26-001' },
  { id: 'TSK-26-003', name: 'Core Engine Dev', start: '2026-05-12', end: '2026-05-25', status: 'In Progress', assignee: { initials: 'MK', color: 'bg-amber-500' }, dependsOn: 'TSK-26-002' },
  { id: 'TSK-26-004', name: 'API Integration', start: '2026-05-20', end: '2026-06-05', status: 'To-Do', assignee: { initials: 'JD', color: 'bg-emerald-500' } },
  { id: 'TSK-26-005', name: 'QA & Unit Testing', start: '2026-05-28', end: '2026-06-15', status: 'Blocked', assignee: { initials: 'AL', color: 'bg-blue-500' } },
];

const STATUS_COLORS: Record<GanttStatus, string> = {
  'Done': 'bg-[#3B82F6]',
  'In Progress': 'bg-[#10B981]',
  'To-Do': 'bg-[#E2E8F0]',
  'Blocked': 'bg-[#EF4444]',
};

export function GanttView() {
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [startDate] = useState(new Date('2026-05-01'));
  const [endDate] = useState(new Date('2026-06-30'));
  const dayWidth = viewMode === 'day' ? 48 : viewMode === 'week' ? 120 : 300;
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const taskListRef = useRef<HTMLDivElement>(null);

  const days = useMemo(() => generateTimelineDays(startDate, endDate), [startDate, endDate]);
  const today = startOfToday();

  // Sync scrolling between task list and timeline
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (taskListRef.current) {
      taskListRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden flex flex-col h-[600px] shadow-sm">
      {/* Gantt Header / Controls */}
      <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-white z-20">
        <div className="flex items-center gap-4">
           <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-widest flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#10B981]" />
              Project Timeline
           </h3>
           <div className="h-4 w-[1px] bg-[#E2E8F0]" />
           <div className="flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-lg border border-[#E2E8F0]">
              {(['day', 'week', 'month'] as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={cn(
                    "px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest transition-all",
                    viewMode === mode ? "bg-white text-[#10B981] shadow-sm" : "text-[#94A3B8] hover:text-[#475569]"
                  )}
                >
                  {mode}
                </button>
              ))}
           </div>
        </div>

        <div className="flex items-center gap-3">
           <button className="p-2 rounded-lg border border-[#E2E8F0] text-[#94A3B8] hover:text-[#0F172A] transition-all">
              <ChevronLeft className="w-4 h-4" />
           </button>
           <div className="text-xs font-bold text-[#0F172A] uppercase tracking-widest">
              May — June 2026
           </div>
           <button className="p-2 rounded-lg border border-[#E2E8F0] text-[#94A3B8] hover:text-[#0F172A] transition-all">
              <ChevronRight className="w-4 h-4" />
           </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Left: Task List */}
        <div 
          ref={taskListRef}
          className="w-[320px] border-r border-[#E2E8F0] bg-white overflow-hidden flex flex-col z-10 shadow-[4px_0_12px_rgba(0,0,0,0.02)]"
        >
           <div className="h-12 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center px-4 shrink-0">
              <span className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">Tasks & Milestones</span>
           </div>
           <div className="flex-1 overflow-hidden">
              {MOCK_GANTT_TASKS.map((task) => (
                <div key={task.id} className="h-12 border-b border-[#F1F5F9] px-4 flex items-center gap-3 hover:bg-[#F8FAFC] transition-colors group cursor-pointer">
                   <IDChip id={task.id} size="xs" className="font-bold opacity-60 group-hover:opacity-100" />
                   <span className="text-xs font-bold text-[#475569] truncate group-hover:text-[#0F172A]">{task.name}</span>
                </div>
              ))}
           </div>
        </div>

        {/* Right: Timeline Grid */}
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-auto custom-scrollbar relative bg-[#FAFAFA]"
        >
           {/* Timeline Header (Dates) */}
           <div className="sticky top-0 z-20 flex bg-[#F8FAFC] border-b border-[#E2E8F0]">
              {days.map((day) => (
                <div 
                  key={day.toISOString()} 
                  style={{ width: dayWidth }}
                  className={cn(
                    "h-12 border-r border-[#E2E8F0]/50 flex flex-col items-center justify-center shrink-0",
                    isSameDay(day, today) && "bg-[#10B981]/5"
                  )}
                >
                   <span className="text-[9px] font-black text-[#94A3B8] uppercase tracking-tighter">
                      {format(day, 'EEE')}
                   </span>
                   <span className={cn(
                     "text-[11px] font-bold",
                     isSameDay(day, today) ? "text-[#10B981]" : "text-[#0F172A]"
                   )}>
                      {format(day, 'd')}
                   </span>
                </div>
              ))}
           </div>

           {/* Timeline Grid Body */}
           <div className="relative min-h-full" style={{ width: days.length * dayWidth }}>
              {/* Vertical Grid Lines */}
              <div className="absolute inset-0 flex pointer-events-none">
                 {days.map((day) => (
                   <div 
                     key={day.toISOString()} 
                     style={{ width: dayWidth }}
                     className={cn(
                       "h-full border-r border-[#F1F5F9]",
                       isSameDay(day, today) && "bg-[#10B981]/5 border-r-[#10B981]/20"
                     )}
                   />
                 ))}
              </div>

              {/* Today Line */}
              {getPositionFromDate(today, startDate, dayWidth) >= 0 && (
                <div 
                  className="absolute top-0 bottom-0 w-px bg-[#10B981] z-10 pointer-events-none"
                  style={{ left: getPositionFromDate(today, startDate, dayWidth) }}
                >
                   <div className="absolute -top-1 -left-1.5 px-1.5 py-0.5 bg-[#10B981] text-white text-[8px] font-black uppercase rounded shadow-sm">
                      Today
                   </div>
                </div>
              )}

              {/* Task Bars */}
              <div className="relative pt-0">
                 {MOCK_GANTT_TASKS.map((task, idx) => {
                   const start = new Date(task.start);
                   const end = new Date(task.end);
                   const left = getPositionFromDate(start, startDate, dayWidth);
                   const width = getTaskWidth(start, end, dayWidth);

                   return (
                     <div key={task.id} className="h-12 flex items-center relative border-b border-[#F1F5F9]/30">
                        <motion.div
                          initial={{ opacity: 0, scaleX: 0 }}
                          animate={{ opacity: 1, scaleX: 1 }}
                          transition={{ delay: idx * 0.1, duration: 0.5, ease: "easeOut" }}
                          style={{ left, width, originX: 0 }}
                          className={cn(
                            "absolute h-7 rounded-lg shadow-sm border border-black/5 flex items-center px-3 group cursor-pointer transition-all hover:brightness-110 hover:shadow-md z-10",
                            STATUS_COLORS[task.status]
                          )}
                        >
                           <span className="text-[10px] font-bold text-white truncate drop-shadow-sm">
                              {task.name}
                           </span>
                           {task.assignee && (
                             <div className="absolute -right-1 -top-1 w-5 h-5 rounded-full border-2 border-white bg-white shadow-sm flex items-center justify-center overflow-hidden scale-0 group-hover:scale-100 transition-transform">
                                <div className={cn("w-full h-full flex items-center justify-center text-white text-[7px] font-black", task.assignee.color)}>
                                   {task.assignee.initials}
                                </div>
                             </div>
                           )}
                        </motion.div>

                        {/* Dependency Line (Simple horizontal to vertical placeholder) */}
                        {task.dependsOn && (
                           <div className="absolute border-l-2 border-t-2 border-[#E2E8F0] border-dashed pointer-events-none" />
                        )}
                     </div>
                   );
                 })}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
