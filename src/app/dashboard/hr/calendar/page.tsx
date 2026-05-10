"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  ChevronDown,
  Calendar as CalendarIcon,
  Download,
  Share2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { HRCalendar } from '@/components/hr/calendar/HRCalendar';
import { UpcomingInterviewsList } from '@/components/hr/calendar/UpcomingInterviewsList';
import { ScheduleInterviewModal } from '@/components/hr/calendar/ScheduleInterviewModal';

const TABS = ["Overview", "Recruitment", "Employees", "Attendance", "Leave", "Payroll"];

export default function HRCalendarPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const activeTab = "Recruitment"; // Calendar is part of recruitment flow usually, or its own

  return (
    <div className="flex-1 bg-[#F8FAFC] min-h-screen flex flex-col">
      {/* Sub-navigation bar */}
      <div className="bg-white border-b border-[#E2E8F0] px-8 flex items-center h-14 sticky top-0 z-30">
        <div className="flex gap-8 h-full">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={cn(
                "h-full px-1 text-sm font-bold transition-all border-b-2 flex items-center",
                activeTab === tab
                  ? "border-[#10B981] text-[#10B981]"
                  : "border-transparent text-[#94A3B8] hover:text-[#475569]"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="p-8 max-w-[1600px] mx-auto w-full flex-1">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
               <h1 className="text-[#0F172A] text-2xl font-bold">Interview Calendar</h1>
               <div className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-100 uppercase tracking-widest">
                  Live Sync Active
               </div>
            </div>
            <p className="text-[#475569] text-sm">Coordinate interviewers and manage recruitment availability.</p>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#94A3B8] hover:bg-[#F8FAFC] transition-all">
               <Download className="w-5 h-5" />
            </button>
            <button className="p-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#94A3B8] hover:bg-[#F8FAFC] transition-all">
               <Share2 className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#10B981] text-white text-sm font-bold shadow-lg shadow-[#10B981]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Schedule Interview</span>
            </button>
          </div>
        </div>

        {/* Filters & Tools */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
           <div className="flex items-center gap-3">
              <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                 <input 
                   type="text" 
                   placeholder="Search interviewer..."
                   className="pl-10 pr-4 py-2 rounded-xl border border-[#E2E8F0] bg-white text-sm w-64 focus:ring-2 focus:ring-[#10B981]/10 outline-none"
                 />
              </div>
              <div className="h-8 w-px bg-[#E2E8F0] mx-2" />
              <div className="flex gap-2">
                 <FilterChip label="Department" value="Engineering" />
                 <FilterChip label="Status" value="All Sessions" />
              </div>
           </div>

           <div className="flex items-center gap-4 text-[#94A3B8]">
              <span className="text-[10px] font-bold uppercase tracking-widest">Legend:</span>
              <div className="flex items-center gap-4">
                 <LegendItem color="bg-violet-500" label="Technical" />
                 <LegendItem color="bg-blue-500" label="HR Round" />
                 <LegendItem color="bg-amber-500" label="Final" />
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 h-[calc(100vh-280px)] min-h-[700px]">
          <div className="xl:col-span-3 h-full">
            <HRCalendar />
          </div>
          <div className="xl:col-span-1 h-full">
            <UpcomingInterviewsList />
          </div>
        </div>
      </div>

      <ScheduleInterviewModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}

function FilterChip({ label, value }: { label: string, value: string }) {
  return (
    <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] transition-all">
       <span className="text-[10px] font-bold text-[#94A3B8] uppercase">{label}:</span>
       <span className="text-xs font-bold text-[#475569]">{value}</span>
       <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
    </button>
  );
}

function LegendItem({ color, label }: { color: string, label: string }) {
  return (
    <div className="flex items-center gap-2">
       <div className={cn("w-2 h-2 rounded-full", color)} />
       <span className="text-[10px] font-bold text-[#64748B] uppercase">{label}</span>
    </div>
  );
}
