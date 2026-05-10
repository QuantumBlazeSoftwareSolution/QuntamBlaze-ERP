"use client";

import React from "react";
import { motion } from "framer-motion";
import { Rocket, ArrowUpRight, CheckCircle2, Circle, Flag, Target, Users, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const MILESTONES = [
  {
    id: 1,
    title: "Senior Software Engineer",
    status: "completed",
    date: "Jan 2024",
    current: false,
  },
  {
    id: 2,
    title: "Lead Engineer Track",
    status: "in_progress",
    date: "Estimated Q3 2024",
    current: true,
  },
  {
    id: 3,
    title: "Staff Engineer / Architect",
    status: "upcoming",
    date: "Goal 2025",
    current: false,
  },
  {
    id: 4,
    title: "Engineering Director",
    status: "upcoming",
    date: "Long-term Goal",
    current: false,
  },
];

export function GrowthRoadmap() {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-3xl p-8 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h3 className="text-[#0F172A] font-bold">Career Growth Roadmap</h3>
          <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-widest mt-1">
            Strategic Path to Leadership
          </p>
        </div>
        <div className="bg-[#10B981]/10 text-[#10B981] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-[#10B981]/20">
          90-Day Plan Active
        </div>
      </div>

      <div className="flex-1 space-y-0 relative">
        {/* Vertical Path Line */}
        <div className="absolute left-[1.125rem] top-2 bottom-2 w-0.5 bg-[#F1F5F9]" />

        {MILESTONES.map((ms, idx) => (
          <div key={ms.id} className="relative pl-12 pb-10 last:pb-0">
            <div
              className={cn(
                "absolute left-0 top-1 w-9 h-9 rounded-full flex items-center justify-center border-4 border-white transition-all z-10",
                ms.status === "completed"
                  ? "bg-[#10B981] shadow-lg shadow-[#10B981]/20"
                  : ms.status === "in_progress"
                    ? "bg-blue-500 shadow-lg shadow-blue-500/20"
                    : "bg-[#CBD5E1]"
              )}
            >
              {ms.status === "completed" ? (
                <CheckCircle2 className="w-4 h-4 text-white" />
              ) : ms.status === "in_progress" ? (
                <Zap className="w-4 h-4 text-white animate-pulse" />
              ) : (
                <Circle className="w-4 h-4 text-white" />
              )}
            </div>

            <div
              className={cn(
                "p-4 rounded-2xl border transition-all",
                ms.current
                  ? "bg-[#F8FAFC] border-blue-100 shadow-sm"
                  : "bg-white border-transparent"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <h4
                  className={cn(
                    "text-sm font-bold",
                    ms.status === "completed" ? "text-[#94A3B8]" : "text-[#0F172A]"
                  )}
                >
                  {ms.title}
                </h4>
                <span className="text-[10px] font-bold text-[#94A3B8]">{ms.date}</span>
              </div>

              {ms.current && (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden flex-1">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "65%" }}
                        className="h-full bg-blue-500 rounded-full"
                      />
                    </div>
                    <span className="text-[10px] font-black text-blue-600">65%</span>
                  </div>
                  <p className="text-[11px] text-[#64748B] leading-relaxed">
                    Completing "Lead by Influence" certification and mentoring 2 junior developers.
                  </p>
                  <button className="flex items-center gap-1.5 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline pt-1">
                    View Goals Context
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
