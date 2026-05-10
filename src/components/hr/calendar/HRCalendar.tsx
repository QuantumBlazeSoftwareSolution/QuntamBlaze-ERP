"use client";

import React, { useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addDays,
  eachDayOfInterval,
  isToday,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Video,
  MapPin,
  Clock,
  MoreVertical,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const MOCK_EVENTS = [
  {
    id: "INT-26-047",
    title: "Tech Interview: Alex Mercer",
    type: "technical",
    date: new Date(2026, 4, 10, 10, 0),
    candidate: "Alex Mercer",
  },
  {
    id: "INT-26-048",
    title: "HR Round: Sarah Jenkins",
    type: "hr_round",
    date: new Date(2026, 4, 12, 14, 0),
    candidate: "Sarah Jenkins",
  },
  {
    id: "INT-26-049",
    title: "Final Presentation: James Wilson",
    type: "final",
    date: new Date(2026, 4, 15, 11, 30),
    candidate: "James Wilson",
  },
  {
    id: "INT-26-050",
    title: "Culture Fit: Elena Vance",
    type: "culture_fit",
    date: new Date(2026, 4, 15, 16, 0),
    candidate: "Elena Vance",
  },
  {
    id: "INT-26-051",
    title: "Phone Screen: Marcus Thorne",
    type: "phone_screen",
    date: new Date(2026, 4, 18, 0, 0),
    candidate: "Marcus Thorne",
  },
];

const EVENT_TYPE_COLORS: Record<string, string> = {
  technical: "bg-violet-50 text-violet-600 border-violet-100",
  hr_round: "bg-blue-50 text-blue-600 border-blue-100",
  final: "bg-amber-50 text-amber-600 border-amber-100",
  culture_fit: "bg-emerald-50 text-emerald-600 border-emerald-100",
  phone_screen: "bg-slate-50 text-slate-600 border-slate-100",
};

export function HRCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 4)); // May 2026
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 4, 10));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-sm flex flex-col h-full">
      {/* Calendar Header */}
      <div className="p-6 border-b border-[#F1F5F9] flex items-center justify-between bg-[#F8FAFC]">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-[#0F172A] min-w-[150px]">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
          <div className="flex items-center gap-1 bg-white border border-[#E2E8F0] rounded-lg p-1">
            <button
              onClick={prevMonth}
              className="p-1.5 hover:bg-[#F1F5F9] rounded-md transition-all text-[#64748B]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentMonth(new Date(2026, 4))}
              className="px-3 py-1 text-[11px] font-bold text-[#475569] uppercase tracking-wider hover:bg-[#F1F5F9] rounded-md transition-all"
            >
              Today
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 hover:bg-[#F1F5F9] rounded-md transition-all text-[#64748B]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-xl border border-[#E2E8F0]">
            <button className="px-4 py-1.5 text-xs font-bold rounded-lg bg-white text-[#10B981] shadow-sm">
              Month
            </button>
            <button className="px-4 py-1.5 text-xs font-bold rounded-lg text-[#64748B] hover:text-[#475569]">
              Week
            </button>
            <button className="px-4 py-1.5 text-xs font-bold rounded-lg text-[#64748B] hover:text-[#475569]">
              Day
            </button>
          </div>
        </div>
      </div>

      {/* Weekday Names */}
      <div className="grid grid-cols-7 border-b border-[#F1F5F9] bg-[#F8FAFC]">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="py-3 text-center text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 flex-1">
        {days.map((day, idx) => {
          const dayEvents = MOCK_EVENTS.filter((e) => isSameDay(e.date, day));
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isSelected = isSameDay(day, selectedDate);
          const isTodayDate = isToday(day);

          return (
            <div
              key={day.toString()}
              onClick={() => setSelectedDate(day)}
              className={cn(
                "min-h-[120px] border-r border-b border-[#F1F5F9] p-2 transition-all cursor-pointer group hover:bg-[#F8FAFC]/50",
                !isCurrentMonth && "bg-[#F8FAFC]/30 opacity-40",
                isSelected && "bg-[#F0FDF4]/30 ring-1 ring-inset ring-[#10B981]/10",
                idx % 7 === 6 && "border-r-0"
              )}
            >
              <div className="flex items-center justify-between mb-2 px-1">
                <span
                  className={cn(
                    "text-xs font-bold w-7 h-7 flex items-center justify-center rounded-full transition-all",
                    isTodayDate
                      ? "bg-[#10B981] text-white"
                      : isSelected
                        ? "text-[#10B981]"
                        : "text-[#64748B] group-hover:text-[#0F172A]"
                  )}
                >
                  {format(day, "d")}
                </span>
                {dayEvents.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />}
              </div>

              <div className="space-y-1 overflow-hidden">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className={cn(
                      "px-2 py-1 rounded text-[10px] font-bold border truncate transition-all hover:scale-[1.02]",
                      EVENT_TYPE_COLORS[event.type] || "bg-gray-50 text-gray-600"
                    )}
                  >
                    {event.title.split(":")[1].trim()}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-[9px] font-bold text-[#94A3B8] px-1.5">
                    + {dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
