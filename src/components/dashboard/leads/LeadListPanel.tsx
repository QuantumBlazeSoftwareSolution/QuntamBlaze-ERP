"use client";

import { useState } from "react";
import { Search, Filter, Plus } from "lucide-react";
import { Lead } from "@/types/lead";
import { LeadCard } from "./LeadCard";
import { motion, AnimatePresence } from "framer-motion";

interface LeadListPanelProps {
  leads: Lead[];
  selectedLeadId: string | null;
  onSelectLead: (id: string) => void;
}

export function LeadListPanel({ leads, selectedLeadId, onSelectLead }: LeadListPanelProps) {
  const [search, setSearch] = useState("");

  const filteredLeads = leads.filter(lead => 
    lead.companyName.toLowerCase().includes(search.toLowerCase()) ||
    lead.contactName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-bg-surface border-r border-border overflow-hidden">
      {/* Header */}
      <div className="p-6 border-bottom border-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[11px] font-bold tracking-[0.2em] text-text-secondary uppercase">
            Active Leads
          </h2>
          <button className="text-text-secondary hover:text-accent transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search parameters..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-bg-primary border border-border rounded-lg py-2.5 pl-10 pr-4 text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 transition-colors"
          />
        </div>

        <button className="w-full bg-accent/5 border border-accent/20 text-accent font-bold tracking-widest text-[10px] uppercase py-3 rounded hover:bg-accent/10 transition-all flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" />
          New Lead
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-6 pb-6 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {filteredLeads.map((lead, index) => (
            <motion.div
              key={lead.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <LeadCard
                lead={lead}
                isSelected={selectedLeadId === lead.id}
                onClick={() => onSelectLead(lead.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
