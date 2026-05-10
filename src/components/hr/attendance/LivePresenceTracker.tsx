"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, Wifi, Monitor, Smartphone, ChevronRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { IDChip } from "@/components/ui/IDChip";

const MOCK_PRESENCE = [
  {
    id: "EMP-ENG-26-001",
    name: "Alex Mercer",
    role: "Senior Engineer",
    time: "08:45 AM",
    location: "Remote",
    device: "Desktop",
  },
  {
    id: "EMP-HR-26-004",
    name: "Sarah Jenkins",
    role: "HR Manager",
    time: "09:02 AM",
    location: "Office",
    device: "Mobile",
  },
  {
    id: "EMP-ENG-26-042",
    name: "James Wilson",
    role: "Software Dev",
    time: "08:58 AM",
    location: "Office",
    device: "Desktop",
  },
  {
    id: "EMP-FIN-26-015",
    name: "Elena Vance",
    role: "Finance Analyst",
    time: "09:15 AM",
    location: "Remote",
    device: "Laptop",
  },
];

export function LivePresenceTracker() {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-[#0F172A] font-bold flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            Live Presence
          </h3>
          <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-widest mt-1">
            Currently On Clock
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search active..."
            className="pl-9 pr-4 py-1.5 rounded-lg border border-[#F1F5F9] bg-[#F8FAFC] text-[10px] font-bold w-40 focus:outline-none focus:ring-2 focus:ring-[#10B981]/10 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-auto pr-2 scrollbar-hide">
        {MOCK_PRESENCE.map((person) => (
          <div
            key={person.id}
            className="flex items-center justify-between p-3 rounded-2xl border border-[#F1F5F9] bg-white hover:border-[#10B981]/30 hover:shadow-sm transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] flex items-center justify-center text-[#94A3B8] font-bold text-xs">
                {person.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <p className="text-xs font-black text-[#0F172A] group-hover:text-[#10B981] transition-colors">
                  {person.name}
                </p>
                <p className="text-[10px] font-bold text-[#94A3B8]">{person.role}</p>
              </div>
            </div>

            <div className="text-right flex items-center gap-6">
              <div className="hidden md:block">
                <div className="flex items-center gap-1.5 justify-end">
                  <span className="text-[10px] font-black text-[#475569]">{person.time}</span>
                  <Wifi className="w-3 h-3 text-[#10B981]" />
                </div>
                <div className="flex items-center gap-1.5 justify-end mt-0.5">
                  <MapPin className="w-2.5 h-2.5 text-[#94A3B8]" />
                  <span className="text-[9px] font-bold text-[#94A3B8] uppercase">
                    {person.location}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#CBD5E1] group-hover:text-[#10B981] transition-colors" />
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-6 py-2.5 rounded-xl border-2 border-dashed border-[#F1F5F9] text-[10px] font-black text-[#94A3B8] hover:bg-[#F8FAFC] hover:text-[#475569] transition-all uppercase tracking-widest">
        View All 118 Checked-In
      </button>
    </div>
  );
}
