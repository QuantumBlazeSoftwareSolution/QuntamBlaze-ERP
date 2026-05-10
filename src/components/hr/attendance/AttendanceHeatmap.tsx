"use client";

import React from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function AttendanceHeatmap() {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const weekdays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  // Mock data for attendance density (0-4)
  const getDensity = (day: number) => {
    if ([3, 4, 10, 11, 17, 18, 24, 25, 31].includes(day)) return 0; // Weekends
    if (day === 7) return 1; // Low attendance
    if (day % 5 === 0) return 2; // Medium
    return 4; // High
  };

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-3xl p-8 shadow-sm h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
           <h3 className="text-[#0F172A] font-bold">Attendance Heatmap</h3>
           <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-widest mt-1">Workforce Density — May 2024</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-lg">
              <button className="p-1.5 hover:bg-white rounded transition-all text-[#94A3B8]">
                 <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-black px-2 uppercase text-[#475569]">May</span>
              <button className="p-1.5 hover:bg-white rounded transition-all text-[#94A3B8]">
                 <ChevronRight className="w-3.5 h-3.5" />
              </button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
         {weekdays.map(day => (
           <div key={day} className="text-[9px] font-black text-[#94A3B8] text-center pb-2 uppercase tracking-widest">
              {day}
           </div>
         ))}
         
         {/* Empty cells for calendar start padding if needed */}
         <div className="h-20" />
         <div className="h-20" />
         <div className="h-20" />
         
         {days.map(day => {
            const density = getDensity(day);
            return (
              <div 
                key={day} 
                className={cn(
                  "h-20 rounded-xl border flex flex-col items-center justify-between p-2 transition-all cursor-pointer group",
                  density === 0 ? "bg-[#F8FAFC] border-[#F1F5F9] opacity-40" : 
                  density === 1 ? "bg-red-50 border-red-100" :
                  density === 2 ? "bg-amber-50 border-amber-100" :
                  "bg-emerald-50 border-emerald-100 hover:border-emerald-300"
                )}
              >
                 <span className={cn(
                   "text-[10px] font-black",
                   density === 0 ? "text-[#94A3B8]" : "text-[#0F172A]"
                 )}>
                    {day}
                 </span>
                 
                 {density > 0 && (
                   <div className="w-full flex items-center justify-center">
                      <div className={cn(
                        "w-full h-1 rounded-full",
                        density === 1 ? "bg-red-400" :
                        density === 2 ? "bg-amber-400" :
                        "bg-emerald-400"
                      )} />
                   </div>
                 )}
                 
                 <span className="text-[8px] font-bold text-[#94A3B8] opacity-0 group-hover:opacity-100 transition-opacity">
                    {density === 0 ? 'OFF' : `${90 + density * 2}%`}
                 </span>
              </div>
            );
         })}
      </div>

      <div className="mt-8 pt-8 border-t border-[#F8FAFC] flex items-center justify-between">
         <div className="flex items-center gap-4">
            <LegendItem label="95%+ Presence" color="bg-emerald-400" />
            <LegendItem label="85-95%" color="bg-amber-400" />
            <LegendItem label="< 85%" color="bg-red-400" />
            <LegendItem label="Weekends/Off" color="bg-[#E2E8F0]" />
         </div>
         <button className="flex items-center gap-1.5 text-[10px] font-black text-blue-600 hover:underline uppercase tracking-widest">
            Detailed Analytics
            <ChevronRight className="w-3 h-3" />
         </button>
      </div>
    </div>
  );
}

function LegendItem({ label, color }: { label: string, color: string }) {
  return (
    <div className="flex items-center gap-2">
       <div className={cn("w-2.5 h-2.5 rounded-sm", color)} />
       <span className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-tighter">{label}</span>
    </div>
  );
}
