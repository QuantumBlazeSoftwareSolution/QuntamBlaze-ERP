"use client";

import { motion } from "framer-motion";

interface ProjectProgressBarProps {
  progress: number;
  showLabel?: boolean;
}

export function ProjectProgressBar({ progress, showLabel = true }: ProjectProgressBarProps) {
  return (
    <div className="flex items-center gap-3 w-full min-w-[120px]">
      {/* Track */}
      <div className="flex-1 h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#00E5FF] to-[#0099AA]"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: progress / 100 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          style={{ transformOrigin: "left" }}
        />
      </div>
      {/* Label */}
      {showLabel && (
        <span className="text-[11px] font-mono text-text-secondary w-8 text-right">
          {progress}%
        </span>
      )}
    </div>
  );
}
