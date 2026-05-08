"use client";

import { motion } from "framer-motion";
import { Link, Globe, Users, Mail, Clock } from "lucide-react";
import { Lead, LeadSource, LeadTemperature } from "@/types/lead";
import { cn } from "@/lib/utils";

interface LeadCardProps {
  lead: Lead;
  isSelected: boolean;
  onClick: () => void;
}

const SOURCE_ICONS: Record<LeadSource, React.ReactNode> = {
  LinkedIn: <Link className="w-3.5 h-3.5" />,
  Website: <Globe className="w-3.5 h-3.5" />,
  Referral: <Users className="w-3.5 h-3.5" />,
  "Cold Outreach": <Mail className="w-3.5 h-3.5" />,
};

const TEMP_CONFIG: Record<LeadTemperature, { color: string; bg: string; dot: string }> = {
  Hot: { color: "text-danger", bg: "bg-danger/10", dot: "bg-danger" },
  Warm: { color: "text-warning", bg: "bg-warning/10", dot: "bg-warning" },
  Cold: { color: "text-accent", bg: "bg-accent/10", dot: "bg-accent" },
};

export function LeadCard({ lead, isSelected, onClick }: LeadCardProps) {
  const temp = TEMP_CONFIG[lead.temperature];

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "p-4 rounded-[10px] border transition-all cursor-pointer group mb-3",
        isSelected
          ? "bg-accent/5 border-accent/30 shadow-[0_0_15px_rgba(0,229,255,0.05)]"
          : "bg-bg-card border-border hover:border-border-hover"
      )}
    >
      <div className="flex justify-between items-start mb-3">
        <span className="text-[10px] font-bold tracking-widest text-text-secondary uppercase">
          {lead.id}
        </span>
        <div className={cn("flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-current/20", temp.color, temp.bg)}>
          <div className={cn("w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]", temp.dot)} />
          <span className="text-[9px] font-bold uppercase tracking-wider">{lead.temperature}</span>
        </div>
      </div>

      <h3 className="text-[15px] font-semibold text-text-primary mb-1 group-hover:text-accent transition-colors">
        {lead.companyName}
      </h3>
      <p className="text-[13px] text-text-secondary mb-4">
        {lead.contactName}, {lead.contactTitle}
      </p>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2 text-text-muted">
          {SOURCE_ICONS[lead.source]}
          <span className="text-[11px] font-medium">{lead.source}</span>
        </div>
        <div className="flex items-center gap-1.5 text-text-muted">
          <Clock className="w-3.5 h-3.5" />
          <span className="text-[11px] font-medium tracking-tight">T-24H</span>
        </div>
      </div>
    </motion.div>
  );
}
