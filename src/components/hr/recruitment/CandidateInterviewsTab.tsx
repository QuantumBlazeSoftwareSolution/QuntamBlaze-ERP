"use client";

import React from "react";
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  User,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  PlusCircle,
  FileSearch,
  Star,
} from "lucide-react";
import { IDChip } from "@/components/ui/IDChip";
import { cn } from "@/lib/utils";

export function CandidateInterviewsTab() {
  const interviews = [
    {
      id: "INT-26-047",
      type: "Technical Interview",
      status: "completed",
      date: "May 10, 2024",
      time: "10:00 AM - 11:30 AM",
      mode: "Video Call (Zoom)",
      interviewers: ["Alex Mercer", "Marcus Thorne"],
      rating: 4.5,
      hasScorecard: true,
    },
    {
      id: "INT-26-042",
      type: "Phone Screen",
      status: "completed",
      date: "May 02, 2024",
      time: "02:00 PM - 02:30 PM",
      mode: "Phone Call",
      interviewers: ["Sarah Jenkins"],
      rating: 4.0,
      hasScorecard: true,
    },
    {
      id: "INT-26-051",
      type: "Culture Fit",
      status: "scheduled",
      date: "May 15, 2024",
      time: "11:00 AM - 12:00 PM",
      mode: "In-Person (Room 302)",
      interviewers: ["James Wilson", "Elena Vance"],
      rating: null,
      hasScorecard: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[#0F172A] font-bold flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#10B981]" />
          Interview Timeline
        </h3>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#10B981] text-white text-xs font-bold shadow-md shadow-[#10B981]/10 hover:scale-[1.02] transition-all">
          <PlusCircle className="w-4 h-4" />
          Schedule Next Round
        </button>
      </div>

      <div className="space-y-4">
        {interviews.map((int, idx) => (
          <div
            key={int.id}
            className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden group hover:shadow-md transition-all"
          >
            <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-5">
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border",
                    int.status === "completed"
                      ? "bg-green-50 text-[#10B981] border-green-100"
                      : "bg-blue-50 text-blue-600 border-blue-100"
                  )}
                >
                  {int.status === "completed" ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <Calendar className="w-6 h-6" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-1.5">
                    <h4 className="font-bold text-[#0F172A]">{int.type}</h4>
                    <IDChip id={int.id} size="xs" />
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                        int.status === "completed"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : "bg-blue-50 text-blue-600 border-blue-100"
                      )}
                    >
                      {int.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-[11px] text-[#64748B] font-medium">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {int.date}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {int.time}
                    </div>
                    <div className="flex items-center gap-1.5">
                      {int.mode.includes("Video") ? (
                        <Video className="w-3.5 h-3.5" />
                      ) : (
                        <MapPin className="w-3.5 h-3.5" />
                      )}
                      {int.mode}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:items-end gap-3">
                <div className="flex -space-x-2">
                  {int.interviewers.map((name, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-[#64748B] shadow-sm"
                      title={name}
                    >
                      {name[0]}
                    </div>
                  ))}
                  <div
                    className="w-8 h-8 rounded-full bg-slate-50 border-2 border-white border-dashed flex items-center justify-center text-[10px] text-[#94A3B8]"
                    title="Add Interviewer"
                  >
                    <PlusCircle className="w-3 h-3" />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {int.rating && (
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-amber-50 border border-amber-100">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span className="text-xs font-bold text-amber-700">{int.rating}</span>
                    </div>
                  )}
                  <button
                    className={cn(
                      "flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                      int.hasScorecard
                        ? "bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0] hover:bg-[#F1F5F9]"
                        : "bg-[#10B981] text-white shadow-md shadow-[#10B981]/10 hover:scale-[1.02]"
                    )}
                  >
                    {int.hasScorecard ? (
                      <FileSearch className="w-3.5 h-3.5" />
                    ) : (
                      <PlusCircle className="w-3.5 h-3.5" />
                    )}
                    {int.hasScorecard ? "View Scorecard" : "Fill Scorecard"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
