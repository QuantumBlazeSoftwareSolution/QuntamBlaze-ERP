"use client";

import { motion } from "framer-motion";
import { RevenueAreaChart as RevenueChart } from "@/components/dashboard/analytics/RevenueAreaChart";
import { TopClientsBar as TopClientsTable } from "@/components/dashboard/analytics/TopClientsBar";
import { StatTile } from "@/components/dashboard/StatTile";
import { ProjectStatusDonut as StatusBreakdownChart } from "@/components/dashboard/ProjectStatusDonut";

interface AnalyticsPageClientProps {
  kpiMetrics: any[];
  monthlyRevenue: any[];
  topClients: any[];
  statusDistribution: any[];
}

export default function AnalyticsPageClient({
  kpiMetrics,
  monthlyRevenue,
  topClients,
  statusDistribution,
}: AnalyticsPageClientProps) {
  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-text-primary tracking-tight">Enterprise Analytics</h1>
        <p className="text-text-secondary text-lg">
          Intelligence-driven insights and performance metrics.
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiMetrics.map((metric) => (
          <StatTile
            key={metric.label}
            label={metric.label}
            value={metric.value}
            trend={parseFloat(metric.change)}
            sparkline={[{ value: 40 }, { value: 60 }]}
          />
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RevenueChart data={monthlyRevenue} />
        </div>
        <div>
          <StatusBreakdownChart data={statusDistribution} />
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 gap-8">
        <TopClientsTable data={topClients} />
      </div>
    </div>
  );
}
