"use client";

import React from "react";
import {
  Clock,
  Video,
  MapPin,
  User,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Calendar,
} from "lucide-react";
import { IDChip } from "@/components/ui/IDChip";
import { cn } from "@/lib/utils";

const UPCOMING = [
  {
    id: "INT-26-047",
    candidate: "Alex Mercer",
    role: "Senior Software Engineer",
    time: "10:00 AM",
    duration: "60m",
    type: "Technical",
    mode: "Video",
    interviewer: "Sarah Jenkins",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop",
  },
  {
    id: "INT-26-048",
    candidate: "Marcus Thorne",
    role: "UI Designer",
    time: "02:30 PM",
    duration: "45m",
    type: "Culture Fit",
    mode: "Video",
    interviewer: "Alex Mercer",
  },
];

export function UpcomingInterviewsList() {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 h-full shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-[#10B981]">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="text-[#0F172A] font-bold">Today's Sessions</h3>
        </div>
        <span className="text-[10px] font-bold text-[#10B981] bg-[#ECFDF5] px-2 py-0.5 rounded-full border border-[#A7F3D0] uppercase tracking-wider">
          {UPCOMING.length} Active
        </span>
      </div>

      <div className="space-y-4 flex-1">
        {UPCOMING.map((int) => (
          <div
            key={int.id}
            className="p-4 rounded-xl border border-[#F1F5F9] bg-[#F8FAFC]/50 hover:bg-white hover:border-[#E2E8F0] hover:shadow-md transition-all group cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden shrink-0">
                  {int.avatar ? (
                    <img src={int.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-[#94A3B8]">
                      {int.candidate[0]}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0F172A] group-hover:text-[#10B981] transition-colors">
                    {int.candidate}
                  </h4>
                  <p className="text-[10px] text-[#94A3B8] font-medium truncate max-w-[120px]">
                    {int.role}
                  </p>
                </div>
              </div>
              <IDChip id={int.id} size="xs" />
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#475569]">
                <Clock className="w-3 h-3 text-[#94A3B8]" />
                {int.time} ({int.duration})
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#475569]">
                <Video className="w-3 h-3 text-[#94A3B8]" />
                Remote
              </div>
              <span
                className={cn(
                  "px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border",
                  int.type === "Technical"
                    ? "bg-violet-50 text-violet-600 border-violet-100"
                    : "bg-emerald-50 text-emerald-600 border-emerald-100"
                )}
              >
                {int.type}
              </span>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#F1F5F9]">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
                  <User className="w-2.5 h-2.5 text-[#94A3B8]" />
                </div>
                <span className="text-[10px] font-semibold text-[#64748B]">{int.interviewer}</span>
              </div>
              <button className="flex items-center gap-1 text-[#10B981] text-[10px] font-bold hover:gap-2 transition-all">
                Join Room
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-[#F1F5F9]">
        <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-[#E2E8F0] text-[#64748B] text-xs font-bold hover:bg-[#F8FAFC] transition-all">
          <Calendar className="w-4 h-4" />
          View Full Schedule
        </button>
      </div>
    </div>
  );
}
