"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Users,
  MoreVertical,
  Plus,
  ArrowRightLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DAYS = ["Mon 06", "Tue 07", "Wed 08", "Thu 09", "Fri 10", "Sat 11", "Sun 12"];
const STAFF = [
  { id: "EMP-001", name: "Alex Mercer", role: "Senior Dev", dept: "ENG" },
  { id: "EMP-004", name: "Sarah Jenkins", role: "Manager", dept: "HR" },
  { id: "EMP-042", name: "James Wilson", role: "Dev", dept: "ENG" },
  { id: "EMP-015", name: "Elena Vance", role: "Analyst", dept: "FIN" },
];

const SHIFTS = {
  "EMP-001": ["Morning", "Morning", "Off", "Night", "Night", "Off", "Off"],
  "EMP-004": ["Morning", "Morning", "Morning", "Morning", "Morning", "Off", "Off"],
  "EMP-042": ["Evening", "Evening", "Evening", "Off", "Off", "Morning", "Morning"],
  "EMP-015": ["Off", "Off", "Night", "Night", "Night", "Evening", "Evening"],
};

export function ShiftRotationMatrix() {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-3xl overflow-hidden shadow-sm flex flex-col h-full">
      <div className="p-6 border-b border-[#F1F5F9] flex items-center justify-between bg-[#FBFCFD]">
        <div className="flex items-center gap-4">
          <h3 className="text-[#0F172A] font-bold">Shift Rotation Matrix</h3>
          <div className="flex items-center gap-1 bg-white border border-[#E2E8F0] rounded-lg p-1">
            <button className="p-1 hover:bg-[#F8FAFC] rounded transition-all text-[#94A3B8]">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[10px] font-black px-2 uppercase text-[#475569]">
              Week 19, 2024
            </span>
            <button className="p-1 hover:bg-[#F8FAFC] rounded transition-all text-[#94A3B8]">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#E2E8F0] bg-white text-[10px] font-bold text-[#64748B] hover:bg-[#F8FAFC] transition-all">
            <ArrowRightLeft className="w-3.5 h-3.5" />
            Swap Tool
          </button>
          <button className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-[#0F172A] text-white text-[10px] font-bold hover:scale-[1.02] transition-all uppercase tracking-widest">
            <Plus className="w-3.5 h-3.5" />
            Assign
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto scrollbar-hide">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[9px] text-[#94A3B8] font-black uppercase tracking-widest">
              <th className="px-6 py-4 sticky left-0 bg-[#F8FAFC] z-20 w-64 border-r border-[#E2E8F0]">
                Staff Member
              </th>
              {DAYS.map((day) => (
                <th key={day} className="px-4 py-4 text-center min-w-[120px]">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {STAFF.map((member) => (
              <tr key={member.id} className="hover:bg-[#FBFCFD] transition-colors group">
                <td className="px-6 py-4 sticky left-0 bg-white group-hover:bg-[#FBFCFD] z-10 border-r border-[#F1F5F9]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#F8FAFC] flex items-center justify-center text-[#94A3B8] font-bold text-[10px] border border-[#E2E8F0]">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="text-xs font-black text-[#0F172A]">{member.name}</p>
                      <p className="text-[9px] font-bold text-[#94A3B8] uppercase">
                        {member.dept} • {member.role}
                      </p>
                    </div>
                  </div>
                </td>
                {(SHIFTS as any)[member.id].map((shift: string, idx: number) => (
                  <td key={idx} className="px-3 py-4">
                    <ShiftBadge type={shift} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between">
        <div className="flex items-center gap-6">
          <LegendItem label="Morning" color="bg-blue-500" />
          <LegendItem label="Evening" color="bg-violet-500" />
          <LegendItem label="Night" color="bg-slate-800" />
          <LegendItem label="Off-Duty" color="bg-[#E2E8F0]" />
        </div>
        <p className="text-[10px] font-bold text-[#94A3B8]">4 Staff Assigned • 28 Total Shifts</p>
      </div>
    </div>
  );
}

function ShiftBadge({ type }: { type: string }) {
  const styles = {
    Morning: "bg-blue-50 text-blue-600 border-blue-100",
    Evening: "bg-violet-50 text-violet-600 border-violet-100",
    Night: "bg-slate-900 text-white border-slate-800",
    Off: "bg-[#F8FAFC] text-[#94A3B8] border-transparent opacity-50",
  };

  const iconColor = {
    Morning: "bg-blue-400",
    Evening: "bg-violet-400",
    Night: "bg-slate-400",
    Off: "bg-transparent",
  };

  return (
    <div
      className={cn(
        "px-3 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest text-center transition-all cursor-pointer hover:scale-[1.05] flex flex-col items-center gap-1",
        (styles as any)[type]
      )}
    >
      <div className={cn("w-1 h-1 rounded-full", (iconColor as any)[type])} />
      {type}
    </div>
  );
}

function LegendItem({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn("w-2 h-2 rounded-full", color)} />
      <span className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-tighter">
        {label}
      </span>
    </div>
  );
}
