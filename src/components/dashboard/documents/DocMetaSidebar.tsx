"use client";

import { motion } from "framer-motion";
import { IDChip } from "@/components/ui/IDChip";
import { Clock, CheckCircle2, XCircle, User, Calendar, FileText, Hash } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocMetaSidebarProps {
  docId: string;
  prjId: string;
  author: { name: string; avatar: string; role: string };
  stats: { words: number; chars: number };
}

export function DocMetaSidebar({ docId, prjId, author, stats }: DocMetaSidebarProps) {
  const workflow = [
    { label: "Draft", status: "complete", date: "2 days ago", user: author.name },
    { label: "Internal Review", status: "complete", date: "Yesterday", user: "Lead Architect" },
    { label: "Client Review", status: "current", date: "Awaiting feedback", user: "Nexus Corp" },
    { label: "Signed", status: "upcoming", date: "Pending e-signature", user: "" },
  ];

  return (
    <div className="w-[300px] bg-white border-l border-divider h-full overflow-y-auto p-8 space-y-10 shadow-sm">
      {/* Meta Card */}
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
            Document Identity
          </p>
          <IDChip
            id={docId}
            className="bg-accent/10 border-accent/30 text-accent text-[13px] px-4 py-2 w-full justify-center"
          />
          <div className="flex items-center justify-center gap-2 text-text-muted pt-2">
            <span className="text-[11px] font-mono">{prjId}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 bg-page-bg rounded-xl border border-divider">
          <img src={author.avatar} className="w-10 h-10 rounded-lg object-cover" />
          <div>
            <p className="text-[13px] font-bold text-text-primary">{author.name}</p>
            <p className="text-[11px] text-text-muted">{author.role}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-page-bg border border-divider rounded-xl p-4 space-y-1">
            <div className="flex items-center gap-2 text-text-muted">
              <Calendar className="w-3 h-3" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Created</span>
            </div>
            <p className="text-[13px] font-bold text-text-primary font-mono">2024.10.24</p>
          </div>
          <div className="bg-page-bg border border-divider rounded-xl p-4 space-y-1">
            <div className="flex items-center gap-2 text-text-muted">
              <Hash className="w-3 h-3" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Words</span>
            </div>
            <p className="text-[13px] font-bold text-text-primary font-mono">{stats.words}</p>
          </div>
        </div>
      </div>

      {/* Approval Workflow */}
      <div className="space-y-6">
        <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
          Approval Workflow
        </p>
        <div className="space-y-8 relative">
          {/* Timeline Line */}
          <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-divider" />

          {workflow.map((step, i) => (
            <div key={step.label} className="flex gap-4 relative group">
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center border-2 z-10 transition-all",
                  step.status === "complete"
                    ? "bg-success border-success text-white"
                    : step.status === "current"
                      ? "bg-accent/10 border-accent text-accent shadow-sm"
                      : "bg-white border-divider text-text-muted"
                )}
              >
                {step.status === "complete" ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : step.status === "current" ? (
                  <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                ) : (
                  <Clock className="w-3.5 h-3.5" />
                )}
              </div>
              <div className="flex flex-col">
                <span
                  className={cn(
                    "text-[12px] font-bold tracking-tight",
                    step.status === "upcoming" ? "text-text-muted" : "text-text-primary"
                  )}
                >
                  {step.label}
                </span>
                <p className="text-[10px] text-text-muted mt-0.5">{step.date}</p>
                {step.user && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-5 h-5 rounded-full bg-page-bg border border-divider flex items-center justify-center overflow-hidden">
                      <User className="w-3 h-3 text-text-muted" />
                    </div>
                    <span className="text-[10px] text-text-muted">{step.user}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <button className="w-full py-3 mt-4 border border-divider hover:border-accent hover:text-accent rounded-xl text-[12px] font-bold transition-all uppercase tracking-widest bg-white shadow-sm">
          Advance to next step
        </button>
      </div>
    </div>
  );
}
