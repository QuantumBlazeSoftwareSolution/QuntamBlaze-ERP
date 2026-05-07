"use client";

import { motion } from "framer-motion";
import { ProjectData } from "@/lib/mockData/dashboard";
import { IDChip } from "@/components/ui/IDChip";

export function ProjectHealthCard({ project }: { project: ProjectData }) {
  const isReview = project.status === "REVIEW";
  const isOnHold = project.status === "ON-HOLD";
  
  const statusColor = isOnHold ? "bg-warning" : isReview ? "bg-text-secondary" : "bg-accent shadow-[0_0_12px_rgba(0,229,255,0.5)]";
  const progressColor = isReview ? "bg-text-secondary" : isOnHold ? "bg-warning" : "bg-accent shadow-[0_0_12px_rgba(0,229,255,0.5)]";

  const burnRatePercentage = Math.min((project.burnRateSpent / project.burnRateTotal) * 100, 100);
  // Dual-bar gauge: The background bar is the total budget, the foreground bar is the spent budget.
  // We will stack them visually.

  return (
    <div className="bg-bg-card border border-border rounded-xl p-5 hover:border-accent/50 transition-colors group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <IDChip id={project.id} className="mb-1 bg-transparent border-none text-accent px-0" />
          <div className="text-sm font-medium text-text-primary">{project.name}</div>
        </div>
        <span className="px-2 py-1 bg-bg-surface rounded text-[10px] font-bold tracking-widest text-text-secondary flex items-center gap-1.5 uppercase border border-border">
          <div className={`w-1.5 h-1.5 rounded-full ${statusColor}`} />
          {project.status}
        </span>
      </div>

      <div className="space-y-5">
        <div>
          <div className="flex justify-between text-[11px] font-bold tracking-[0.1em] text-text-secondary uppercase mb-1.5">
            <span>Progress</span>
            <span>{project.progress}%</span>
          </div>
          <div className="w-full bg-border rounded-full h-1 overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${progressColor}`}
              initial={{ width: 0 }}
              animate={{ width: `${project.progress}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-border/50">
          <div className="flex justify-between items-center text-[13px] font-mono mb-2">
            <span className="text-text-secondary">Burn Rate</span>
            <span className="text-text-primary">
              ${(project.burnRateSpent / 1000).toFixed(0)}k / ${(project.burnRateTotal / 1000).toFixed(0)}k
            </span>
          </div>
          {/* Dual-bar Gauge for Burn Rate */}
          <div className="w-full bg-border rounded-full h-1.5 relative overflow-hidden">
            <motion.div
              className={`absolute left-0 top-0 bottom-0 rounded-full ${burnRatePercentage > 90 ? "bg-danger shadow-[0_0_8px_rgba(255,68,68,0.5)]" : "bg-text-secondary"}`}
              initial={{ width: 0 }}
              animate={{ width: `${burnRatePercentage}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
