"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Building2,
  Mail,
  Phone,
  User,
  Globe,
  Zap,
  FileText,
  Archive,
  TrendingUp,
  Tag,
} from "lucide-react";
import { Lead, LeadStatus } from "@/lib/mockData/leads";
import { IDChip } from "@/components/ui/IDChip";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<LeadStatus, { label: string; color: string }> = {
  New: { label: "New", color: "bg-blue-50 text-blue-600 border-blue-200" },
  Contacted: { label: "Contacted", color: "bg-purple-50 text-purple-600 border-purple-200" },
  Qualified: { label: "Qualified", color: "bg-accent/10 text-accent border-accent/20" },
  Proposal: { label: "Proposal", color: "bg-amber-50 text-amber-600 border-amber-200" },
  Won: { label: "Won", color: "bg-success/10 text-success border-success/20" },
  Lost: { label: "Lost", color: "bg-red-50 text-red-500 border-red-200" },
};

const PIPELINE_STAGES: LeadStatus[] = ["New", "Contacted", "Qualified", "Proposal", "Won"];

function ScoreBar({ score }: { score: number }) {
  const color = score >= 70 ? "bg-success" : score >= 40 ? "bg-warning" : "bg-red-400";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-page-bg rounded-full overflow-hidden border border-divider">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
      <span
        className={`text-[11px] font-bold w-6 ${
          score >= 70 ? "text-success" : score >= 40 ? "text-warning" : "text-red-500"
        }`}
      >
        {score}
      </span>
    </div>
  );
}

interface LeadDetailsSheetProps {
  lead: Lead | null;
  onClose: () => void;
}

export function LeadDetailsSheet({ lead, onClose }: LeadDetailsSheetProps) {
  const [tab, setTab] = useState<"overview" | "notes">("overview");

  if (!lead) return null;

  const statusConfig = STATUS_CONFIG[lead.status];
  const pipelineIndex = PIPELINE_STAGES.indexOf(lead.status as any);
  const isLost = lead.status === "Lost";
  const isWon = lead.status === "Won";

  return (
    <AnimatePresence>
      {lead && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-[#0F172A]/80 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-[500px] bg-white flex flex-col border-l border-divider shadow-2xl"
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-divider bg-page-bg shrink-0">
              <div className="flex items-start justify-between mb-3">
                <IDChip id={lead.id} />
                <button
                  onClick={onClose}
                  className="p-2 -mr-2 text-text-muted hover:text-text-primary hover:bg-divider rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-text-primary">{lead.company}</h2>
                  <p className="text-sm text-text-muted mt-0.5">{lead.industry}</p>
                </div>
                <span
                  className={cn(
                    "text-[11px] font-bold px-2.5 py-1 rounded-full border",
                    statusConfig.color
                  )}
                >
                  {statusConfig.label}
                </span>
              </div>

              {/* Score */}
              <div className="mt-4">
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1.5">
                  Lead Score
                </p>
                <ScoreBar score={lead.score} />
              </div>
            </div>

            {/* Pipeline Progress */}
            {!isLost && (
              <div className="px-6 py-4 border-b border-divider bg-white shrink-0">
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">
                  Pipeline Stage
                </p>
                <div className="flex items-center gap-0">
                  {PIPELINE_STAGES.map((stage, i) => {
                    const isActive = i === pipelineIndex;
                    const isPassed = i < pipelineIndex || isWon;
                    return (
                      <div key={stage} className="flex items-center flex-1">
                        <div
                          className={cn(
                            "w-full h-1.5 rounded-full",
                            isPassed || isActive ? "bg-accent" : "bg-page-bg border border-divider"
                          )}
                        />
                        {i < PIPELINE_STAGES.length - 1 && (
                          <div
                            className={cn(
                              "w-1.5 h-1.5 rounded-full mx-0.5 shrink-0",
                              isPassed ? "bg-accent" : "bg-divider"
                            )}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between mt-1.5">
                  {PIPELINE_STAGES.map((stage, i) => (
                    <span
                      key={stage}
                      className={cn(
                        "text-[9px] font-bold capitalize",
                        i === pipelineIndex ? "text-accent" : "text-text-muted"
                      )}
                    >
                      {stage}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="flex border-b border-divider bg-white shrink-0">
              {(["overview", "notes"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={cn(
                    "flex-1 py-3 text-sm font-semibold transition-all relative capitalize",
                    tab === t ? "text-text-primary" : "text-text-secondary hover:text-text-primary"
                  )}
                >
                  {t}
                  {tab === t && (
                    <motion.div
                      layoutId="lead-sheet-tab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
              {tab === "overview" && (
                <>
                  {/* Contact */}
                  <div className="space-y-3">
                    <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                      Contact Information
                    </h3>
                    <div className="bg-page-bg border border-divider rounded-xl divide-y divide-divider">
                      {[
                        { icon: User, value: lead.contactName, label: "Name" },
                        { icon: Mail, value: lead.contactEmail, label: "Email" },
                        { icon: Phone, value: lead.contactPhone, label: "Phone" },
                      ].map(({ icon: Icon, value, label }) => (
                        <div key={label} className="flex items-center gap-3 px-4 py-3">
                          <Icon className="w-4 h-4 text-text-muted shrink-0" />
                          <div>
                            <p className="text-[10px] text-text-muted">{label}</p>
                            <p className="text-[13px] font-medium text-text-primary">{value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Deal Info */}
                  <div className="space-y-3">
                    <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                      Deal Details
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 bg-page-bg border border-divider rounded-xl">
                        <p className="text-[10px] text-text-muted mb-1">Est. Value</p>
                        <p className="text-base font-bold text-text-primary">
                          ${(lead.estimatedValue / 1000000).toFixed(1)}M
                        </p>
                      </div>
                      <div className="p-4 bg-page-bg border border-divider rounded-xl">
                        <p className="text-[10px] text-text-muted mb-1">Source</p>
                        <div className="flex items-center gap-1.5">
                          <Globe className="w-3 h-3 text-accent" />
                          <p className="text-sm font-bold text-text-primary">{lead.source}</p>
                        </div>
                      </div>
                      <div className="p-4 bg-page-bg border border-divider rounded-xl">
                        <p className="text-[10px] text-text-muted mb-1">Assigned To</p>
                        <p className="text-sm font-bold text-text-primary">{lead.assignedTo}</p>
                      </div>
                      <div className="p-4 bg-page-bg border border-divider rounded-xl">
                        <p className="text-[10px] text-text-muted mb-1">Last Contact</p>
                        <p className="text-sm font-bold text-text-primary">
                          {lead.lastContactedAt}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {tab === "notes" && (
                <div className="space-y-3">
                  <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                    Internal Notes
                  </h3>
                  <div className="p-4 bg-page-bg border border-divider rounded-xl">
                    <p className="text-[13px] text-text-secondary leading-relaxed">{lead.notes}</p>
                  </div>
                  <textarea
                    className="w-full bg-white border border-border rounded-xl p-4 text-[13px] text-text-primary resize-none h-28 focus:border-accent focus:ring-1 focus:ring-accent outline-none placeholder:text-text-muted"
                    placeholder="Add a new note..."
                  />
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-divider bg-page-bg shrink-0 space-y-3">
              {!isWon && !isLost && (
                <button className="w-full flex items-center justify-center gap-2 py-3 bg-accent text-white font-bold text-sm rounded-xl hover:bg-accent/90 transition-all shadow-sm shadow-accent/20">
                  <Zap className="w-4 h-4" />
                  Convert to Client
                </button>
              )}
              {isWon && (
                <div className="w-full flex items-center justify-center gap-2 py-3 bg-success/10 text-success font-bold text-sm rounded-xl border border-success/20">
                  <TrendingUp className="w-4 h-4" />
                  Converted — Client Created
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 py-2.5 bg-white border border-border text-text-primary font-bold text-sm rounded-xl hover:bg-page-bg transition-all">
                  <FileText className="w-4 h-4" />
                  Send Proposal
                </button>
                <button className="flex items-center justify-center gap-2 py-2.5 bg-white border border-border text-text-muted font-bold text-sm rounded-xl hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all">
                  <Archive className="w-4 h-4" />
                  Archive Lead
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
