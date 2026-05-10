"use client";

import React from "react";
import { Calendar, ArrowRight, Clock, CheckCircle2, AlertCircle, PieChart } from "lucide-react";
import { cn } from "@/lib/utils";

const MOCK_BALANCES = [
  {
    type: "Annual Leave",
    total: 21,
    taken: 5,
    remaining: 16,
    color: "bg-blue-500",
    bg: "bg-blue-50",
  },
  { type: "Sick Leave", total: 14, taken: 2, remaining: 12, color: "bg-red-500", bg: "bg-red-50" },
  {
    type: "Casual Leave",
    total: 7,
    taken: 3,
    remaining: 4,
    color: "bg-amber-500",
    bg: "bg-amber-50",
  },
];

export function LeaveBalanceTracker() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {MOCK_BALANCES.map((item) => {
        const percentage = (item.taken / item.total) * 100;
        return (
          <div
            key={item.type}
            className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", item.bg)}>
                <Calendar className={cn("w-5 h-5", item.color.replace("bg-", "text-"))} />
              </div>
              <span className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">
                Balance 2024
              </span>
            </div>

            <h4 className="text-sm font-black text-[#0F172A] mb-1">{item.type}</h4>
            <div className="flex items-end gap-2 mb-4">
              <span className="text-2xl font-black text-[#0F172A]">{item.remaining}</span>
              <span className="text-xs font-bold text-[#94A3B8] mb-1">
                / {item.total} Days Left
              </span>
            </div>

            <div className="space-y-2">
              <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all duration-1000", item.color)}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="flex justify-between text-[9px] font-black uppercase tracking-tighter">
                <span className="text-[#94A3B8]">Consumed: {item.taken}d</span>
                <span className="text-[#64748B]">{Math.round(100 - percentage)}% Avail</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
