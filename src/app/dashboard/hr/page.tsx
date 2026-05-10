"use client";

import { motion } from "framer-motion";
import { HRStatTile } from "@/components/hr/HRStatTile";
import { HeadcountByDepartment } from "@/components/hr/HeadcountByDepartment";
import { HiringFunnelChart } from "@/components/hr/HiringFunnelChart";
import { AttendanceTrendLine } from "@/components/hr/AttendanceTrendLine";
import { PayrollTrendLine } from "@/components/hr/PayrollTrendLine";
import { HRActivityFeed } from "@/components/hr/HRActivityFeed";
import { HRAlerts } from "@/components/hr/HRAlerts";
import { HR_DASHBOARD_STATS } from "@/lib/mockData/hr";
import { cn } from "@/lib/utils";

const TABS = ["Overview", "Recruitment", "Employees", "Attendance", "Leave", "Payroll"];

export default function HRDashboard() {
  const activeTab = "Overview";

  return (
    <div className="flex-1 bg-[#F8FAFC] min-h-screen">
      {/* Sub-navigation bar */}
      <div className="bg-white border-b border-[#E2E8F0] px-8 flex items-center h-14 sticky top-0 z-30">
        <div className="flex gap-8 h-full">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={cn(
                "h-full px-1 text-sm font-bold transition-all border-b-2 flex items-center",
                activeTab === tab
                  ? "border-[#10B981] text-[#10B981]"
                  : "border-transparent text-[#94A3B8] hover:text-[#475569]"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="p-8 max-w-[1600px] mx-auto">
        <header className="mb-8">
          <h1 className="text-[#0F172A] text-2xl font-bold">HR Command Center</h1>
          <div className="flex items-center justify-between mt-1">
            <p className="text-[#475569] text-sm">Strategic workforce intelligence and talent orchestration.</p>
            <span className="text-[#94A3B8] text-sm font-medium">May 2026</span>
          </div>
        </header>

        {/* KPI Tiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {HR_DASHBOARD_STATS.map((stat, idx) => (
            <HRStatTile key={stat.label} {...stat} index={idx} />
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Analytics Column */}
          <div className="xl:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <HeadcountByDepartment />
              <HiringFunnelChart />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AttendanceTrendLine />
              <PayrollTrendLine />
            </div>
          </div>

          {/* Activity & Alerts Column */}
          <div className="space-y-6">
            <div className="flex flex-col">
              <span className="text-[#94A3B8] text-[11px] font-semibold uppercase tracking-widest mb-4 px-2">Critical Alerts</span>
              <HRAlerts />
            </div>
            
            <div className="flex flex-col">
              <HRActivityFeed />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
