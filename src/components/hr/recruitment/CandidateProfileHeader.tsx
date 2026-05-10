"use client";

import React from "react";
import { Candidate, PipelineStage } from "@/types/hr";
import { IDChip } from "@/components/ui/IDChip";
import { motion } from "framer-motion";
import {
  Calendar,
  CheckCircle2,
  XCircle,
  ChevronRight,
  MoreHorizontal,
  Mail,
  Phone,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CandidateProfileHeaderProps {
  candidate: Candidate;
}

const STAGES: PipelineStage[] = [
  "Applied",
  "Screening",
  "Technical",
  "Final",
  "Offer",
  "Hired",
  "Rejected",
];

export function CandidateProfileHeader({ candidate }: CandidateProfileHeaderProps) {
  const currentStageIndex = STAGES.indexOf(candidate.currentStage);
  const isRejected = candidate.currentStage === "Rejected";

  return (
    <div className="bg-white border-b border-[#E2E8F0]">
      <div className="px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 border border-[#E2E8F0] flex items-center justify-center text-slate-400 font-bold text-2xl shadow-inner">
              {candidate.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>

            <div>
              <div className="flex items-center gap-3 mb-1.5">
                <h1 className="text-2xl font-bold text-[#0F172A]">{candidate.name}</h1>
                <div className="flex gap-2">
                  <IDChip id={candidate.id} variant="accent" />
                  <IDChip id={candidate.jobId} size="xs" />
                </div>
              </div>

              <div className="flex items-center gap-4 text-[#64748B] text-sm">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{candidate.email}</span>
                </div>
                {candidate.phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{candidate.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-bold uppercase">
                    {candidate.source}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-sm font-bold text-[#64748B] hover:bg-[#F8FAFC] transition-all">
              <Calendar className="w-4 h-4" />
              <span>Schedule Interview</span>
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#10B981] text-white text-sm font-bold shadow-lg shadow-[#10B981]/20 hover:scale-[1.02] transition-all">
              <CheckCircle2 className="w-4 h-4" />
              <span>Move to Hired</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#EF4444]/20 bg-white text-sm font-bold text-[#EF4444] hover:bg-red-50 transition-all">
              <XCircle className="w-4 h-4" />
              <span>Reject</span>
            </button>
            <button className="p-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#94A3B8] hover:text-[#475569] hover:bg-[#F8FAFC] transition-all">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Pipeline Progress Track */}
        <div className="mt-10 relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-[#F1F5F9] -translate-y-1/2 rounded-full" />

          <div className="relative flex justify-between">
            {STAGES.filter((s) => s !== "Rejected" || isRejected).map((stage, idx) => {
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              const isRejectedStage = stage === "Rejected" && isRejected;

              return (
                <div key={stage} className="flex flex-col items-center z-10">
                  <motion.div
                    initial={false}
                    animate={{
                      backgroundColor: isCurrent
                        ? isRejectedStage
                          ? "#EF4444"
                          : "#10B981"
                        : isPast
                          ? "#10B981"
                          : "#FFFFFF",
                      borderColor:
                        isPast || isCurrent ? (isRejectedStage ? "#EF4444" : "#10B981") : "#E2E8F0",
                    }}
                    className={cn(
                      "w-4 h-4 rounded-full border-2 transition-colors flex items-center justify-center",
                      isCurrent && "ring-4 ring-[#10B981]/10"
                    )}
                  >
                    {isPast && <CheckCircle2 className="w-3 h-3 text-white fill-[#10B981]" />}
                  </motion.div>
                  <span
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-wider mt-2 transition-colors",
                      isCurrent
                        ? isRejectedStage
                          ? "text-[#EF4444]"
                          : "text-[#10B981]"
                        : isPast
                          ? "text-[#475569]"
                          : "text-[#94A3B8]"
                    )}
                  >
                    {stage}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
