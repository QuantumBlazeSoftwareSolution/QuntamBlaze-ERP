"use client";

import { motion } from "framer-motion";
import { MarketForecastChart } from "@/components/dashboard/intelligence/MarketForecastChart";
import { RiskMatrix } from "@/components/dashboard/intelligence/RiskMatrix";
import { AIAssistantChat } from "@/components/dashboard/intelligence/AIAssistantChat";
import { StatTile } from "@/components/dashboard/StatTile";
import { Sparkles, Download, RefreshCcw } from "lucide-react";

const statsData = [
  {
    label: "AI Confidence Score",
    value: "94%",
    trend: 2.1,
    isPositive: true,
    sparkline: [{ value: 90 }, { value: 91 }, { value: 92 }, { value: 94 }],
  },
  {
    label: "Projected Growth",
    value: "+25%",
    trend: 15.3,
    isPositive: true,
    sparkline: [{ value: 10 }, { value: 15 }, { value: 20 }, { value: 25 }],
  },
  {
    label: "Overall Threat Level",
    value: "Low",
    trend: -12.5,
    isPositive: true,
    sparkline: [{ value: 40 }, { value: 35 }, { value: 25 }, { value: 15 }],
  },
  {
    label: "Anomalies Detected",
    value: "3",
    trend: -50,
    isPositive: true,
    sparkline: [{ value: 6 }, { value: 5 }, { value: 4 }, { value: 3 }],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
};

export default function IntelligenceDashboard() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col h-[calc(100vh-140px)] min-h-[500px]"
    >
      <div className="flex items-center justify-between shrink-0 mb-6">
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">Intelligence Hub</h1>
          <p className="text-text-secondary mt-1">
            AI-driven forecasting, risk assessment, and operational insights.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="flex gap-3">
          <button className="px-4 py-2 border border-divider text-text-secondary hover:text-text-primary font-bold tracking-widest text-[11px] uppercase rounded-lg hover:bg-page-bg transition-colors flex items-center gap-2">
            <RefreshCcw className="w-3.5 h-3.5" />
            Recalculate
          </button>
          <button className="px-4 py-2 bg-accent hover:bg-accent-hover text-white font-bold tracking-widest text-[11px] uppercase rounded-lg transition-colors flex items-center gap-2">
            <Download className="w-3.5 h-3.5" />
            Export Report
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
        {/* Left Column (2-span): Forecasting & Risk */}
        <div className="lg:col-span-2 overflow-y-auto pr-4 custom-scrollbar">
          <div className="pb-6 space-y-6">
            <motion.div variants={itemVariants} className="h-[400px]">
              <MarketForecastChart />
            </motion.div>

            <motion.div variants={itemVariants}>
              <RiskMatrix />
            </motion.div>
          </div>
        </div>

        {/* Right Column (1-span): AI Chat Assistant */}
        <div className="overflow-y-auto pr-2 custom-scrollbar">
          <div className="pb-6 h-full min-h-[500px]">
            <motion.div variants={itemVariants} className="h-full flex flex-col">
              <div className="flex-1">
                <AIAssistantChat />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
