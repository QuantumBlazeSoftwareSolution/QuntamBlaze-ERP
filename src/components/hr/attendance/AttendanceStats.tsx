"use client";

import React from 'react';
import { 
  Users, 
  Clock, 
  UserCheck, 
  UserMinus,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function AttendanceStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard 
        label="Total Headcount" 
        value="124" 
        subtext="Active today" 
        icon={Users} 
        color="text-blue-600" 
        bg="bg-blue-50" 
      />
      <StatCard 
        label="Checked In" 
        value="118" 
        subtext="95% Presence" 
        icon={UserCheck} 
        color="text-emerald-600" 
        bg="bg-emerald-50" 
        trend="+3% vs yesterday"
        trendType="up"
      />
      <StatCard 
        label="Late Comers" 
        value="5" 
        subtext="ATT-LATE-ID generated" 
        icon={Clock} 
        color="text-amber-600" 
        bg="bg-amber-50" 
        trend="-12% improved"
        trendType="up"
      />
      <StatCard 
        label="On Leave" 
        value="6" 
        subtext="LEV-ID approved" 
        icon={UserMinus} 
        color="text-red-600" 
        bg="bg-red-50" 
      />
    </div>
  );
}

function StatCard({ label, value, subtext, icon: Icon, color, bg, trend, trendType }: any) {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
       <div className="flex items-start justify-between mb-4">
          <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", bg, color)}>
             <Icon className="w-6 h-6" />
          </div>
          {trend && (
            <div className={cn(
              "flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full border uppercase tracking-tighter",
              trendType === 'up' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"
            )}>
               {trendType === 'up' ? <TrendingUp className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
               {trend}
            </div>
          )}
       </div>
       <p className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">{label}</p>
       <h3 className="text-2xl font-black text-[#0F172A] mt-1">{value}</h3>
       <p className="text-[11px] text-[#64748B] font-medium mt-1">{subtext}</p>
    </div>
  );
}
