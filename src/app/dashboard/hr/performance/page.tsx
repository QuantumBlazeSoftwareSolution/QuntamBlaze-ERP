"use client";

import React from "react";
import { HRNavbar } from "@/components/hr/HRNavbar";
import { OKRWorkspace } from "@/components/hr/performance/OKRWorkspace";
import { KpiMetricTracker } from "@/components/hr/performance/KpiMetricTracker";
import {
  Target,
  TrendingUp,
  Zap,
  ShieldCheck,
  Calendar,
  Users,
  Award,
  BarChart3,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function PerformanceManagementPage() {
  const [activeTab, setActiveTab] = React.useState<"goals" | "reviews" | "kpis">("goals");

  return (
    <div className="flex-1 bg-[#F8FAFC] min-h-screen flex flex-col">
      <HRNavbar />

      <div className="p-8 max-w-[1600px] mx-auto w-full flex-1 flex flex-col">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-[#0F172A] text-2xl font-bold">Performance Management</h1>
            <p className="text-[#475569] text-sm mt-1">
              Track strategic OKRs, KPIs, and structured appraisal cycles.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm font-bold text-[#475569] hover:bg-[#F1F5F9] transition-all bg-white">
              <Calendar className="w-4 h-4 text-[#94A3B8]" />
              Review Timeline
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F172A] text-white text-sm font-bold shadow-lg shadow-[#0F172A]/20 hover:scale-[1.02] transition-all">
              <Target className="w-4 h-4" />
              Strategic Objectives
            </button>
          </div>
        </div>

        {/* Workspace Navigation */}
        <div className="flex items-center gap-1 bg-[#F1F5F9] p-1.5 rounded-2xl border border-[#E2E8F0] w-fit mb-8 shadow-sm">
          <TabButton
            active={activeTab === "goals"}
            onClick={() => setActiveTab("goals")}
            label="OKR Tracking"
          />
          <TabButton
            active={activeTab === "reviews"}
            onClick={() => setActiveTab("reviews")}
            label="Appraisal Cycles"
          />
          <TabButton
            active={activeTab === "kpis"}
            onClick={() => setActiveTab("kpis")}
            label="KPI Scorecard"
          />
        </div>

        <div className="flex-1 grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Workspace */}
          <div className="xl:col-span-2">
            {activeTab === "goals" && <OKRWorkspace />}
            {(activeTab === "reviews" || activeTab === "kpis") && (
              <div className="bg-white border border-[#E2E8F0] border-dashed rounded-3xl p-20 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#F8FAFC] flex items-center justify-center text-[#94A3B8] mb-4">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-[#0F172A]">Appraisal Workspace</h3>
                <p className="text-sm text-[#64748B] max-w-xs mt-2">
                  Structured review cycles for FY2024 are currently being calibrated. Check back
                  soon for the calibration phase.
                </p>
              </div>
            )}
          </div>

          {/* Stats & Intelligence Sidebar */}
          <div className="xl:col-span-1 space-y-8">
            <KpiMetricTracker />

            <div className="bg-white border border-[#E2E8F0] rounded-3xl p-8 shadow-sm">
              <h4 className="text-sm font-black text-[#0F172A] uppercase tracking-widest mb-8 flex items-center justify-between">
                Team Completion
                <TrendingUp className="w-4 h-4 text-[#10B981]" />
              </h4>
              <div className="space-y-6">
                <ProgressStat label="Engineering" percentage={78} color="bg-blue-600" />
                <ProgressStat label="Finance & Admin" percentage={92} color="bg-[#10B981]" />
                <ProgressStat label="Sales & Mktg" percentage={45} color="bg-amber-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
        active
          ? "bg-[#0F172A] text-white shadow-lg shadow-[#0F172A]/20"
          : "text-[#64748B] hover:text-[#0F172A]"
      )}
    >
      {label}
    </button>
  );
}

function ProgressStat({
  label,
  percentage,
  color,
}: {
  label: string;
  percentage: number;
  color: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black text-[#64748B] uppercase tracking-widest">
          {label}
        </span>
        <span className="text-[10px] font-black text-[#0F172A]">{percentage}%</span>
      </div>
      <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden border border-[#F1F5F9]">
        <div
          className={cn("h-full rounded-full transition-all duration-1000", color)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
