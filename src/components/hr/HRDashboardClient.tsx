"use client";

import { motion } from "framer-motion";
import { HRStatTile } from "@/components/hr/HRStatTile";
import { HeadcountByDepartment } from "@/components/hr/HeadcountByDepartment";
import { HiringFunnelChart } from "@/components/hr/HiringFunnelChart";
import { AttendanceTrendLine } from "@/components/hr/AttendanceTrendLine";
import { PayrollTrendLine } from "@/components/hr/PayrollTrendLine";
import { HRActivityFeed } from "@/components/hr/HRActivityFeed";
import { HRAlerts } from "@/components/hr/HRAlerts";
import { HRNavbar } from "@/components/hr/HRNavbar";
import { cn } from "@/lib/utils";

interface HRDashboardClientProps {
  hrStats: any[];
  deptHeadcountData: any[];
  activities: any[];
}

export default function HRDashboardClient({ hrStats, deptHeadcountData, activities }: HRDashboardClientProps) {
  return (
    <div className="flex-1 bg-[#F8FAFC] min-h-screen">
      <HRNavbar />

      <div className="p-8 max-w-[1600px] mx-auto">
        <header className="mb-8">
          <h1 className="text-[#0F172A] text-2xl font-bold">HR Command Center</h1>
          <div className="flex items-center justify-between mt-1">
            <p className="text-[#475569] text-sm">
              Strategic workforce intelligence and talent orchestration.
            </p>
            <span className="text-[#94A3B8] text-sm font-medium">May 2026</span>
          </div>
        </header>

        {/* KPI Tiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {hrStats.map((stat, idx) => (
            <HRStatTile key={stat.label} {...stat} index={idx} />
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Analytics Column */}
          <div className="xl:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <HeadcountByDepartment data={deptHeadcountData} />
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
              <span className="text-[#94A3B8] text-[11px] font-semibold uppercase tracking-widest mb-4 px-2">
                Critical Alerts
              </span>
              <HRAlerts />
            </div>

            <div className="flex flex-col">
              <HRActivityFeed activities={activities} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
