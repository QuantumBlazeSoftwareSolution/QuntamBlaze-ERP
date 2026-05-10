"use client";

import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  User,
  Info,
  Gift,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const HOLIDAYS = [
  { day: 1, name: "May Day", type: "Public" },
  { day: 22, name: "Vesak Poya Day", type: "Religious" },
];

const MOCK_LEAVES = [
  { day: 5, duration: 3, name: "Alex Mercer", type: "Annual" },
  { day: 10, duration: 1, name: "Sarah Jenkins", type: "Sick" },
  { day: 12, duration: 4, name: "James Wilson", type: "Annual" },
  { day: 25, duration: 2, name: "Elena Vance", type: "Casual" },
];

export function LeaveTeamCalendar() {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-3xl p-8 shadow-sm flex flex-col h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h3 className="text-[#0F172A] font-bold">Team Leave Calendar</h3>
          <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-widest mt-1">
            Workforce Availability — May 2024
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-xl">
            <button className="p-1.5 hover:bg-white rounded transition-all text-[#94A3B8]">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[10px] font-black px-4 uppercase text-[#475569]">May 2024</span>
            <button className="p-1.5 hover:bg-white rounded transition-all text-[#94A3B8]">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto scrollbar-hide">
        <div className="grid grid-cols-7 gap-px bg-[#F1F5F9] border border-[#F1F5F9] rounded-2xl overflow-hidden">
          {WEEKDAYS.map((day) => (
            <div key={day} className="bg-[#F8FAFC] py-3 text-center">
              <span className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">
                {day}
              </span>
            </div>
          ))}

          {/* Empty cells for padding */}
          <div className="bg-white h-32" />
          <div className="bg-white h-32" />

          {DAYS.map((day) => {
            const holiday = HOLIDAYS.find((h) => h.day === day);
            const leaves = MOCK_LEAVES.filter((l) => day >= l.day && day < l.day + l.duration);
            const isWeekend = [4, 5, 11, 12, 18, 19, 25, 26].includes(day); // Mock weekend

            return (
              <div
                key={day}
                className={cn(
                  "bg-white h-32 p-2 flex flex-col gap-1 relative group cursor-pointer hover:z-10 transition-all",
                  isWeekend ? "bg-[#F8FAFC]/50" : "hover:bg-blue-50/30"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={cn(
                      "text-[11px] font-black w-6 h-6 flex items-center justify-center rounded-lg transition-colors",
                      holiday
                        ? "bg-red-500 text-white shadow-sm"
                        : isWeekend
                          ? "text-[#94A3B8]"
                          : "text-[#0F172A]"
                    )}
                  >
                    {day}
                  </span>
                  {holiday && (
                    <div className="flex items-center gap-1 text-[8px] font-black text-red-500 uppercase tracking-tighter">
                      <Gift className="w-3 h-3" />
                      {holiday.name}
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-1 overflow-hidden">
                  {leaves.map((l, i) => (
                    <div
                      key={i}
                      className={cn(
                        "px-2 py-1 rounded-md text-[9px] font-bold border truncate flex items-center gap-1.5",
                        l.type === "Annual"
                          ? "bg-blue-50 border-blue-100 text-blue-600"
                          : l.type === "Sick"
                            ? "bg-red-50 border-red-100 text-red-600"
                            : "bg-amber-50 border-amber-100 text-amber-600"
                      )}
                    >
                      <div
                        className={cn(
                          "w-1 h-1 rounded-full",
                          l.type === "Annual"
                            ? "bg-blue-500"
                            : l.type === "Sick"
                              ? "bg-red-500"
                              : "bg-amber-500"
                        )}
                      />
                      {l.name}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-[#F8FAFC] flex items-center justify-between">
        <div className="flex items-center gap-6">
          <LegendItem label="Annual" color="bg-blue-500" />
          <LegendItem label="Sick" color="bg-red-500" />
          <LegendItem label="Casual" color="bg-amber-500" />
          <LegendItem
            label="Public Holiday"
            color="bg-red-500"
            isIcon={<Gift className="w-2.5 h-2.5 text-white" />}
          />
        </div>
        <p className="text-[10px] font-bold text-[#94A3B8]">Total 8 Team Members Out in May</p>
      </div>
    </div>
  );
}

function LegendItem({
  label,
  color,
  isIcon,
}: {
  label: string;
  color: string;
  isIcon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn("w-3 h-3 rounded flex items-center justify-center shadow-sm", color)}>
        {isIcon}
      </div>
      <span className="text-[9px] font-black text-[#94A3B8] uppercase tracking-tighter">
        {label}
      </span>
    </div>
  );
}
