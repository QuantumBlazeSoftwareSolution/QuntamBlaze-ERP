"use client";

import { motion } from "framer-motion";
import { SystemHealthMonitor } from "@/components/dashboard/operations/SystemHealthMonitor";
import { ResourceBandwidthChart } from "@/components/dashboard/operations/ResourceBandwidthChart";
import { OperationsAlerts } from "@/components/dashboard/operations/OperationsAlerts";
import { StatTile } from "@/components/dashboard/StatTile";
import { Activity, Server, ShieldAlert, Cpu } from "lucide-react";

const statsData = [
  { label: "System Uptime", value: "99.99%", trend: 0.01, isPositive: true, sparkline: [{ value: 99.9 }, { value: 99.95 }, { value: 99.98 }, { value: 99.99 }] },
  { label: "Server Load", value: "42%", trend: -5.2, isPositive: true, sparkline: [{ value: 65 }, { value: 50 }, { value: 45 }, { value: 42 }] },
  { label: "Active Incidents", value: "2", trend: 50, isPositive: false, sparkline: [{ value: 0 }, { value: 1 }, { value: 2 }, { value: 2 }] },
  { label: "Deploy Velocity", value: "14/wk", trend: 12.5, isPositive: true, sparkline: [{ value: 10 }, { value: 12 }, { value: 13 }, { value: 14 }] },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export default function OperationsDashboard() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col h-[calc(100vh-140px)] min-h-[500px]"
    >
      <div className="flex items-center justify-between shrink-0 mb-6">
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">Operations Command Center</h1>
          <p className="text-text-secondary mt-1">Real-time system health and resource allocation.</p>
        </motion.div>
        
        <motion.div variants={itemVariants} className="flex gap-3">
          <button className="px-4 py-2 border border-divider text-text-secondary hover:text-text-primary font-bold tracking-widest text-[11px] uppercase rounded-lg hover:bg-page-bg transition-colors flex items-center gap-2">
            <Activity className="w-3.5 h-3.5" />
            Live Logs
          </button>
          <button className="px-4 py-2 bg-accent hover:bg-accent-hover text-white font-bold tracking-widest text-[11px] uppercase rounded-lg transition-colors flex items-center gap-2">
            <Server className="w-3.5 h-3.5" />
            Manage Nodes
          </button>
        </motion.div>
      </div>

      {/* Top Stats Row (Fixed) */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 shrink-0 mb-6">
        {statsData.map((stat) => (
          <motion.div key={stat.label} variants={itemVariants}>
            <StatTile {...stat} />
          </motion.div>
        ))}
      </section>

      {/* Bento Grid Content (Scrollable Columns) */}
      <section className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        
        {/* Left Column (2-span): Charts & Health */}
        <div className="lg:col-span-2 overflow-y-auto pr-4 custom-scrollbar">
          <div className="pb-6 space-y-6">
            <motion.div variants={itemVariants}>
              <SystemHealthMonitor />
            </motion.div>
            
            <motion.div variants={itemVariants} className="h-[400px]">
              <ResourceBandwidthChart />
            </motion.div>
          </div>
        </div>

        {/* Right Column (1-span): Alerts */}
        <div className="overflow-y-auto pr-2 custom-scrollbar">
          <div className="pb-6 h-full min-h-[500px]">
            <motion.div variants={itemVariants} className="h-full">
              <OperationsAlerts />
            </motion.div>
          </div>
        </div>

      </section>
    </motion.div>
  );
}
