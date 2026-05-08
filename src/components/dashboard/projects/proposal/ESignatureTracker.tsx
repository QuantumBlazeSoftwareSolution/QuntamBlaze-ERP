"use client";

import { motion } from "framer-motion";
import { Check, User, Clock, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepProps {
  label: string;
  status: "complete" | "current" | "upcoming";
  timestamp?: string;
  user?: string;
  isLast?: boolean;
}

function Step({ label, status, timestamp, user, isLast }: StepProps) {
  return (
    <div className="flex items-center gap-4 flex-1">
      <div className="relative">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500",
          status === "complete" ? "bg-success border-success text-[#050505]" : 
          status === "current" ? "bg-accent/10 border-accent text-accent shadow-[0_0_15px_rgba(0,229,255,0.3)]" :
          "bg-white/5 border-border text-text-muted"
        )}>
          {status === "complete" ? <Check className="w-5 h-5" /> : <User className="w-4 h-4" />}
        </div>
        {!isLast && (
          <div className={cn(
            "absolute top-1/2 left-full w-24 h-0.5 -translate-y-1/2 mx-2",
            status === "complete" ? "bg-success" : "bg-border"
          )} />
        )}
      </div>

      <div className="flex flex-col">
        <span className={cn(
          "text-[12px] font-bold tracking-tight",
          status === "upcoming" ? "text-text-muted" : "text-text-primary"
        )}>{label}</span>
        {status === "complete" && (
          <div className="flex items-center gap-2 text-[10px] text-text-muted mt-0.5">
             <Clock className="w-3 h-3" />
             <span>{timestamp}</span>
             <span>•</span>
             <span>{user}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function ESignatureTracker() {
  const steps = [
    { label: "Internal Review", status: "complete" as const, timestamp: "2024-05-15 09:30", user: "Admin" },
    { label: "Client Review", status: "current" as const },
    { label: "E-Signature", status: "upcoming" as const },
  ];

  return (
    <div className="w-full bg-bg-card border-t border-border p-6 px-12">
      <div className="max-w-[1000px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-12 flex-1">
          {steps.map((step, i) => (
            <Step 
              key={step.label} 
              {...step} 
              isLast={i === steps.length - 1} 
            />
          ))}
        </div>
        
        <div className="flex items-center gap-2 text-text-muted text-[11px] font-bold uppercase tracking-widest">
           Workflow History
           <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
