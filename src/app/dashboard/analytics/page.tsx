"use client";

import { motion, Variants } from "framer-motion";
import {
  TrendingUp,
  Users,
  Clock,
  DollarSign,
  BarChart2,
  Percent,
} from "lucide-react";
import { RevenueAreaChart } from "@/components/dashboard/analytics/RevenueAreaChart";
import { TopClientsBar } from "@/components/dashboard/analytics/TopClientsBar";
import { ProjectStatusDonut } from "@/components/dashboard/ProjectStatusDonut";
import { monthlyRevenue, topClients, kpiMetrics } from "@/lib/mockData/analytics";
import { statusDistribution } from "@/lib/mockData/dashboard";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } },
};

const KPI_TILES = [
  {
    label: "YoY Revenue Growth",
    value: `+${kpiMetrics.yoyGrowth}%`,
    sub: "vs same period last year",
    icon: TrendingUp,
    accent: true,
  },
  {
    label: "Collection Rate",
    value: `${kpiMetrics.collectionRate}%`,
    sub: "invoices collected on time",
    icon: Percent,
    accent: false,
  },
  {
    label: "Active Clients",
    value: String(kpiMetrics.activeClientCount),
    sub: "across all engagements",
    icon: Users,
    accent: false,
  },
  {
    label: "Avg Project Duration",
    value: `${kpiMetrics.avgProjectDuration}d`,
    sub: "from kick-off to delivery",
    icon: Clock,
    accent: false,
  },
  {
    label: "Avg Invoice Value",
    value: `$${(kpiMetrics.avgInvoiceValue / 1000).toFixed(1)}K`,
    sub: "per invoice issued",
    icon: DollarSign,
    accent: false,
  },
  {
    label: "Budget Utilization",
    value: `${kpiMetrics.budgetUtilization}%`,
    sub: "of total allocated budget",
    icon: BarChart2,
    accent: false,
  },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">
            Analytics Command Center
          </h1>
          <p className="text-text-secondary mt-1">
            Real-time fiscal intelligence and operational telemetry.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="text-[10px] font-bold text-accent uppercase tracking-widest">
            Live Data
          </span>
        </div>
      </motion.div>

      {/* KPI Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
      >
        {KPI_TILES.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              variants={itemVariants}
              className={`rounded-2xl p-5 border shadow-sm flex flex-col gap-3 ${
                kpi.accent
                  ? "bg-accent text-white border-accent"
                  : "bg-white border-border text-text-primary"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  kpi.accent ? "bg-white/20" : "bg-page-bg"
                }`}
              >
                <Icon className={`w-4 h-4 ${kpi.accent ? "text-white" : "text-accent"}`} />
              </div>
              <div>
                <p
                  className={`text-2xl font-bold tracking-tight ${
                    kpi.accent ? "text-white" : "text-text-primary"
                  }`}
                >
                  {kpi.value}
                </p>
                <p
                  className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${
                    kpi.accent ? "text-white/70" : "text-text-muted"
                  }`}
                >
                  {kpi.label}
                </p>
                <p
                  className={`text-[10px] mt-1 leading-relaxed ${
                    kpi.accent ? "text-white/60" : "text-text-muted"
                  }`}
                >
                  {kpi.sub}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Main Chart Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Revenue Area Chart — spans 2 cols */}
        <div className="lg:col-span-2">
          <RevenueAreaChart data={monthlyRevenue} />
        </div>

        {/* Project Status Donut */}
        <div>
          <ProjectStatusDonut data={statusDistribution} />
        </div>
      </motion.div>

      {/* Second Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Top Clients Bar — spans 2 cols */}
        <div className="lg:col-span-2">
          <TopClientsBar data={topClients} />
        </div>

        {/* Budget Utilization Summary Card */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-text-primary mb-1">Budget Health</h3>
          <p className="text-[12px] text-text-muted mb-6">
            Utilization across all active projects
          </p>
          <div className="flex-1 flex flex-col justify-center space-y-5">
            {[
              { label: "Alpha Core Migration", burn: 78, color: "bg-accent" },
              { label: "Logistics Node Omega", burn: 92, color: "bg-warning" },
              { label: "Data Lake Infra", burn: 45, color: "bg-accent" },
              { label: "ML Pipeline Auto.", burn: 22, color: "bg-info" },
              { label: "Fulfillment Eng. v3", burn: 63, color: "bg-accent" },
            ].map((p) => (
              <div key={p.label}>
                <div className="flex justify-between text-[11px] mb-1.5">
                  <span className="font-medium text-text-secondary truncate max-w-[160px]">
                    {p.label}
                  </span>
                  <span
                    className={`font-bold ${
                      p.burn >= 90
                        ? "text-warning"
                        : p.burn >= 75
                        ? "text-accent"
                        : "text-text-primary"
                    }`}
                  >
                    {p.burn}%
                  </span>
                </div>
                <div className="h-1.5 bg-page-bg rounded-full overflow-hidden border border-divider">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${p.burn}%` }}
                    transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                    className={`h-full rounded-full ${p.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
