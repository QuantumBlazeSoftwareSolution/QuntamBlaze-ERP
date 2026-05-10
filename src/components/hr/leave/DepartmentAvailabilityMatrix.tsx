"use client";

import React from 'react';
import { 
  Users, 
  MapPin, 
  TrendingDown, 
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const DEPTS = [
  { name: 'Engineering', total: 42, out: 3, critical: true },
  { name: 'HR & Admin', total: 12, out: 1, critical: false },
  { name: 'Finance', total: 15, out: 2, critical: false },
  { name: 'Sales & Mktg', total: 28, out: 0, critical: false },
];

export function DepartmentAvailabilityMatrix() {
  return (
    <div className="bg-[#0F172A] rounded-3xl p-8 text-white h-full flex flex-col shadow-xl">
      <div className="flex items-center justify-between mb-10">
        <div>
           <h3 className="text-white font-bold flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              Availability Matrix
           </h3>
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Real-time Capacity Analysis</p>
        </div>
        <div className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-400">
           Last Sync: 14:00
        </div>
      </div>

      <div className="flex-1 space-y-6">
         {DEPTS.map((dept) => (
           <div key={dept.name} className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group">
              <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shadow-sm",
                      dept.critical ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400"
                    )}>
                       {dept.name[0]}
                    </div>
                    <div>
                       <h4 className="text-xs font-black uppercase tracking-widest">{dept.name}</h4>
                       <p className="text-[10px] text-slate-400 font-medium">{dept.total} Total Strength</p>
                    </div>
                 </div>
                 {dept.critical && (
                   <div className="flex items-center gap-1.5 text-[9px] font-black text-red-400 uppercase tracking-tighter bg-red-400/10 px-2 py-0.5 rounded-full">
                      <AlertCircle className="w-3 h-3" />
                      Critical
                   </div>
                 )}
              </div>

              <div className="flex items-center justify-between">
                 <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Attendance Status</span>
                       <span className="text-[10px] font-black text-white">{Math.round(((dept.total - dept.out) / dept.total) * 100)}%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                       <div 
                         className={cn(
                           "h-full rounded-full transition-all duration-1000",
                           dept.critical ? "bg-red-500" : "bg-[#10B981]"
                         )} 
                         style={{ width: `${((dept.total - dept.out) / dept.total) * 100}%` }}
                       />
                    </div>
                 </div>
                 <div className="pl-6 flex flex-col items-end">
                    <span className="text-xl font-black text-white">{dept.out}</span>
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">OUT</span>
                 </div>
              </div>
           </div>
         ))}
      </div>

      <button className="w-full mt-10 py-3 rounded-2xl bg-white/5 border border-white/10 text-slate-300 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2">
         Full Capacity Report
         <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
