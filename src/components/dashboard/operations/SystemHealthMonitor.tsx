"use client";

import { motion } from "framer-motion";
import { Server, Activity, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { MOCK_SYSTEM_HEALTH, SystemHealth } from "@/lib/mockData/operations";
import { cn } from "@/lib/utils";

const statusConfig = {
  operational: {
    color: "text-success",
    bg: "bg-success/10",
    border: "border-success/20",
    icon: CheckCircle2,
    pulse: "bg-success",
  },
  degraded: {
    color: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/20",
    icon: AlertTriangle,
    pulse: "bg-warning",
  },
  outage: {
    color: "text-danger",
    bg: "bg-danger/10",
    border: "border-danger/20",
    icon: XCircle,
    pulse: "bg-danger",
  },
};

export function SystemHealthMonitor() {
  return (
    <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
      <div className="px-5 py-4 border-b border-divider bg-page-bg flex items-center justify-between">
        <h3 className="text-text-primary font-bold text-sm uppercase tracking-wider flex items-center gap-2">
          <Server className="w-4 h-4 text-accent" />
          System Health
        </h3>
        <span className="text-[10px] text-text-muted font-bold tracking-widest uppercase">
          Live Status
        </span>
      </div>

      <div className="p-5 space-y-4">
        {MOCK_SYSTEM_HEALTH.map((system, index) => {
          const config = statusConfig[system.status];
          const Icon = config.icon;

          return (
            <motion.div
              key={system.service}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 rounded-lg border border-divider hover:border-accent/30 hover:bg-page-bg transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center w-8 h-8">
                  <div
                    className={cn(
                      "absolute inset-0 rounded-full opacity-20",
                      config.pulse,
                      system.status !== "operational" && "animate-ping"
                    )}
                  />
                  <Icon className={cn("w-4 h-4 relative z-10", config.color)} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-primary group-hover:text-accent transition-colors">
                    {system.service}
                  </h4>
                  <p className="text-[11px] text-text-secondary mt-0.5">
                    Uptime: {system.uptime}% • {system.latency}ms latency
                  </p>
                </div>
              </div>

              <div
                className={cn(
                  "px-2.5 py-1 rounded-full border text-[9px] font-bold uppercase tracking-widest",
                  config.bg,
                  config.color,
                  config.border
                )}
              >
                {system.status}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="px-5 py-3 border-t border-divider bg-page-bg/50 flex justify-between items-center text-[11px] font-semibold text-text-secondary">
        <span className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5" /> All systems monitored
        </span>
        <button className="text-accent hover:text-accent-hover transition-colors uppercase tracking-widest font-bold">
          View Details
        </button>
      </div>
    </div>
  );
}
