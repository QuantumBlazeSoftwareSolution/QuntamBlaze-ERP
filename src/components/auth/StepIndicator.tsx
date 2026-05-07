"use client";

import { motion } from "framer-motion";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  title: string;
}

export function StepIndicator({ currentStep, totalSteps, title }: StepIndicatorProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/50">
        <span className="text-[11px] font-bold tracking-[0.1em] text-text-secondary uppercase">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm text-accent">
          {title}
        </span>
      </div>
      <div className="w-full h-1 bg-[#1A1A1A] rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-accent"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
