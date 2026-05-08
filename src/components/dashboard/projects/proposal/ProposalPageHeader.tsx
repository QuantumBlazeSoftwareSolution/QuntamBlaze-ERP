"use client";

import { motion } from "framer-motion";
import { Send, FileDown, Link as LinkIcon, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { ProposalStatus } from "@/types/proposal";
import { IDChip } from "@/components/ui/IDChip";
import { cn } from "@/lib/utils";

interface ProposalPageHeaderProps {
  proposalId: string;
  projectId: string;
  clientId: string;
  title: string;
  status: ProposalStatus;
  onTitleChange: (title: string) => void;
}

const STATUS_CONFIG = {
  Pending: { color: "text-warning", bg: "bg-warning/10", border: "border-warning/30", icon: Clock },
  Signed: { color: "text-success", bg: "bg-success/10", border: "border-success/30", icon: CheckCircle2 },
  Rejected: { color: "text-danger", bg: "bg-danger/10", border: "border-danger/30", icon: AlertCircle },
};

export function ProposalPageHeader({ 
  proposalId, 
  projectId, 
  clientId, 
  title, 
  status,
  onTitleChange 
}: ProposalPageHeaderProps) {
  const StatusIcon = STATUS_CONFIG[status.state].icon;

  return (
    <div className="w-full bg-bg-primary border-b border-border p-8 pb-12">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="space-y-6 flex-1">
          <div className="flex flex-wrap items-center gap-3">
             <IDChip id={proposalId} className="bg-accent/10 border-accent/30 text-accent text-[12px] px-3 py-1.5" />
             <div className="flex items-center gap-4 text-text-muted">
                <div className="flex items-center gap-2">
                   <LinkIcon className="w-3.5 h-3.5" />
                   <IDChip id={projectId} className="bg-white/5 border-border text-[11px]" />
                </div>
                <div className="flex items-center gap-2">
                   <LinkIcon className="w-3.5 h-3.5" />
                   <IDChip id={clientId} className="bg-white/5 border-border text-[11px]" />
                </div>
             </div>
          </div>

          <div className="relative group">
            <input 
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              className="bg-transparent text-4xl font-black text-text-primary tracking-tighter w-full focus:outline-none focus:text-accent transition-colors"
              placeholder="Proposal Title..."
            />
            <div className="absolute -bottom-1 left-0 w-24 h-1 bg-accent/30 group-focus-within:w-full group-focus-within:bg-accent transition-all duration-500" />
          </div>

          <div className="flex items-center gap-6 pt-2">
             <div className={cn(
               "flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-bold uppercase tracking-widest",
               STATUS_CONFIG[status.state].color,
               STATUS_CONFIG[status.state].bg,
               STATUS_CONFIG[status.state].border
             )}>
                <StatusIcon className="w-3.5 h-3.5" />
                {status.state}
             </div>
             <div className="text-[11px] font-mono text-text-muted">
                Ref: {status.reference}
             </div>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4 md:pt-0">
          <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-border text-text-primary font-bold text-[13px] rounded-lg hover:bg-white/10 transition-all">
            <FileDown className="w-4 h-4 text-text-muted" />
            Export PDF
          </button>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-8 py-3 bg-accent text-[#050505] font-bold text-[13px] rounded-lg shadow-[0_0_20px_rgba(0,229,255,0.2)] hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all"
          >
            <Send className="w-4 h-4" />
            Send for Review
          </motion.button>
        </div>
      </div>
    </div>
  );
}
