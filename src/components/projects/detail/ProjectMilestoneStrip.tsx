"use client";

import { motion } from "framer-motion";
import { Milestone } from "@/types/project";
import { Check } from "lucide-react";

export function ProjectMilestoneStrip({ milestones }: { milestones: Milestone[] }) {
  return (
    <div className="flex items-start justify-between gap-2 overflow-x-auto hide-scrollbar py-4">
      {milestones.map((milestone, index) => (
        <div key={milestone.id} className="flex flex-col items-center gap-2 flex-1 min-w-0">
          {/* Connector line left */}
          <div className="flex items-center w-full">
            {/* Left line */}
            <div
              className={`flex-1 h-px ${index === 0 ? "opacity-0" : milestone.state === "completed" ? "bg-success" : "bg-[#1A1A1A]"}`}
            />

            {/* Dot/Icon */}
            {milestone.state === "completed" ? (
              <div className="w-8 h-8 rounded-full border-2 border-success bg-success/10 flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-success" />
              </div>
            ) : milestone.state === "current" ? (
              <div className="relative w-8 h-8 flex-shrink-0">
                <motion.div
                  className="absolute inset-0 rounded-full bg-accent/20"
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                />
                <div className="absolute inset-0 rounded-full border-2 border-accent bg-accent/10 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                </div>
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full border border-[#3A3A3A] bg-transparent flex items-center justify-center text-[10px] font-mono text-[#3A3A3A] flex-shrink-0">
                {String(index + 1).padStart(2, "0")}
              </div>
            )}

            {/* Right line */}
            <div
              className={`flex-1 h-px ${index === milestones.length - 1 ? "opacity-0" : "bg-[#1A1A1A]"}`}
            />
          </div>

          {/* Labels */}
          <div className="text-center px-1 min-w-0">
            <div
              className={`text-[11px] font-medium truncate ${
                milestone.state === "completed"
                  ? "text-success"
                  : milestone.state === "current"
                  ? "text-accent"
                  : "text-[#3A3A3A]"
              }`}
            >
              {milestone.label}
            </div>
            <div className="text-[10px] text-text-secondary/50 mt-0.5 truncate">{milestone.subLabel}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
