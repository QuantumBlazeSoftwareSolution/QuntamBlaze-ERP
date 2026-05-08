"use client";

import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, FileText, Globe, Link, ArrowUpRight } from "lucide-react";
import { Lead, LeadSource } from "@/types/lead";
import { LeadTimeline } from "./LeadTimeline";
import { cn } from "@/lib/utils";

interface LeadDetailPanelProps {
  lead: Lead | null;
  onConvert: () => void;
}

const SOURCE_ICONS: Record<LeadSource, React.ReactNode> = {
  LinkedIn: <Link className="w-4 h-4" />,
  Website: <Globe className="w-4 h-4" />,
  Referral: <User className="w-4 h-4" />,
  "Cold Outreach": <Mail className="w-4 h-4" />,
};

export function LeadDetailPanel({ lead, onConvert }: LeadDetailPanelProps) {
  if (!lead) {
    return (
      <div className="h-full flex items-center justify-center bg-bg-primary">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto border border-white/10">
            <User className="w-8 h-8 text-text-muted" />
          </div>
          <p className="text-text-secondary text-[14px]">Select a lead to view intelligence dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-bg-primary overflow-y-auto custom-scrollbar">
      <AnimatePresence mode="wait">
        <motion.div
          key={lead.id}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className="p-10 max-w-5xl mx-auto"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-md bg-accent/10 border border-accent/20 text-accent text-[11px] font-bold tracking-widest uppercase">
                  {lead.status}
                </span>
                <span className="text-text-muted text-[13px] font-mono">{lead.id}</span>
              </div>
              <h1 className="text-4xl font-bold text-text-primary tracking-tight">{lead.companyName}</h1>
              <p className="text-text-secondary text-lg font-medium">{lead.description}</p>
            </div>

            <div className="flex gap-3">
              <button className="px-6 py-3 rounded-lg border border-border text-text-primary font-bold text-[13px] hover:bg-white/5 transition-all flex items-center gap-2">
                Draft Proposal
              </button>
              <button 
                onClick={onConvert}
                className="px-6 py-3 rounded-lg bg-accent text-[#050505] font-bold text-[13px] shadow-[0_0_20px_rgba(0,229,255,0.2)] hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all flex items-center gap-2"
              >
                Convert to Client
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Primary Contact Card */}
            <div className="bg-bg-card border border-border rounded-2xl p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-white/5 border border-border flex items-center justify-center">
                  <User className="w-6 h-6 text-text-secondary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary">{lead.contactName}</h3>
                  <p className="text-[13px] text-text-secondary uppercase tracking-widest">{lead.contactTitle}</p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-border/50">
                <div className="flex items-center gap-4 text-text-secondary hover:text-accent transition-colors cursor-pointer">
                  <Mail className="w-4 h-4" />
                  <span className="text-[14px]">{lead.contactEmail}</span>
                </div>
                <div className="flex items-center gap-4 text-text-secondary hover:text-accent transition-colors cursor-pointer">
                  <Phone className="w-4 h-4" />
                  <span className="text-[14px]">{lead.contactPhone}</span>
                </div>
              </div>
            </div>

            {/* Acquisition Data Card */}
            <div className="bg-bg-card border border-border rounded-2xl p-8 space-y-6">
              <div className="space-y-4">
                <p className="text-[11px] font-bold text-text-muted uppercase tracking-[0.2em]">Acquisition Data</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                    {SOURCE_ICONS[lead.source]}
                  </div>
                  <div>
                    <p className="text-[14px] text-text-primary font-bold">{lead.source}</p>
                    <p className="text-[12px] text-text-secondary">Inbound Landing Page</p>
                  </div>
                </div>
              </div>

              {lead.linkedProposalId && (
                <div className="space-y-4 pt-4 border-t border-border/50">
                   <p className="text-[11px] font-bold text-text-muted uppercase tracking-[0.2em]">Linked Proposal</p>
                   <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-border text-text-primary hover:border-accent/50 transition-all cursor-pointer group">
                     <FileText className="w-4 h-4 text-text-secondary group-hover:text-accent" />
                     <span className="text-[13px] font-mono">{lead.linkedProposalId}</span>
                     <ArrowUpRight className="w-3 h-3 text-text-muted" />
                   </div>
                </div>
              )}
            </div>
          </div>

          {/* Activity Log Section */}
          <div className="mt-16">
            <LeadTimeline events={lead.timeline} />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
