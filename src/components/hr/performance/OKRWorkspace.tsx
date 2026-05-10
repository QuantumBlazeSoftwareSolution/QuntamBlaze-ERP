"use client";

import React from "react";
import {
  Target,
  TrendingUp,
  Plus,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  MoreVertical,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { IDChip } from "@/components/ui/IDChip";

const MOCK_GOALS = [
  {
    id: "PERF-GOAL-2024-001",
    title: "Lead Q2 Backend Architecture Upgrade",
    weight: 0.4,
    status: "In Progress",
    progress: 65,
    results: [
      {
        title: "Migrate 100% Core Tables to Drizzle",
        current: 85,
        target: 100,
        unit: "%",
      },
      {
        title: "Reduce API Latency by 200ms",
        current: 120,
        target: 200,
        unit: "ms",
      },
    ],
  },
  {
    id: "PERF-GOAL-2024-002",
    title: "Mentor 3 Junior Engineers",
    weight: 0.3,
    status: "In Progress",
    progress: 40,
    results: [
      {
        title: "Weekly 1-on-1 Sessions",
        current: 12,
        target: 24,
        unit: "sessions",
      },
      {
        title: "Skills Mastery Checklist Completion",
        current: 1,
        target: 3,
        unit: "mentees",
      },
    ],
  },
];

export function OKRWorkspace() {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-3xl p-8 shadow-sm h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h3 className="text-[#0F172A] font-bold">
            Objectives & Key Results (OKRs)
          </h3>
          <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-widest mt-1">
            Strategic Alignment — FY 2024
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F172A] text-white text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-lg shadow-[#0F172A]/20">
            <Plus className="w-4 h-4" />
            New Objective
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-8 overflow-auto scrollbar-hide">
        {MOCK_GOALS.map((goal) => (
          <div
            key={goal.id}
            className="p-8 rounded-3xl border border-[#F1F5F9] bg-[#F8FAFC] hover:border-blue-200 transition-all group"
          >
            <div className="flex items-start justify-between mb-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <IDChip id={goal.id} size="xs" />
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 text-[8px] font-black uppercase tracking-widest">
                    Weight: {Math.round(goal.weight * 100)}%
                  </span>
                </div>
                <h4 className="text-lg font-black text-[#0F172A] tracking-tight">
                  {goal.title}
                </h4>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-2xl font-black text-[#0F172A]">
                  {goal.progress}%
                </span>
                <span className="text-[9px] font-black text-[#94A3B8] uppercase tracking-widest">
                  Total Progress
                </span>
              </div>
            </div>

            <div className="h-1.5 bg-white rounded-full overflow-hidden mb-10 border border-[#F1F5F9]">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(37,99,235,0.2)]"
                style={{ width: `${goal.progress}%` }}
              />
            </div>

            <div className="space-y-4">
              <h5 className="text-[10px] font-black text-[#64748B] uppercase tracking-[0.2em] mb-4">
                Key Results
              </h5>
              {goal.results.map((kr, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white border border-[#F1F5F9] group-hover:border-blue-100 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[#475569]">
                      {kr.title}
                    </span>
                    <span className="text-[10px] font-black text-[#0F172A]">
                      {kr.current} / {kr.target}{" "}
                      <span className="text-[#94A3B8] ml-1">{kr.unit}</span>
                    </span>
                  </div>
                  <div className="h-1 bg-[#F1F5F9] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${(kr.current / kr.target) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-white flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] font-bold text-[#94A3B8]">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                Last update: 2 days ago
              </div>
              <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1 hover:underline">
                Goal Analytics
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
