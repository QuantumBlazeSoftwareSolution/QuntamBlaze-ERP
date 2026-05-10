"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuditEntry } from "@/types/audit";
import { IDChip } from "@/components/ui/IDChip";
import { ChevronDown, ChevronUp, User } from "lucide-react";
import { cn } from "@/lib/utils";

const ACTION_COLORS: Record<string, string> = {
  Created: "bg-[#00C896]",
  Updated: "bg-[#00E5FF]",
  Deleted: "bg-[#FF4444]",
  "Status Change": "bg-[#FFB800]",
  Comment: "bg-[#8A8A8A]",
};

export function AuditEntryExpandable({ entry }: { entry: AuditEntry }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative group border-b border-[#0F0F0F] last:border-none">
      <div
        className={cn(
          "flex gap-6 p-5 cursor-pointer transition-colors",
          isExpanded ? "bg-white/[0.03]" : "hover:bg-white/[0.01]"
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Timeline Dot */}
        <div className="relative flex flex-col items-center">
          <div
            className={cn(
              "w-2.5 h-2.5 rounded-full z-10 shrink-0 mt-1.5",
              ACTION_COLORS[entry.action]
            )}
          />
        </div>

        <div className="flex-1 space-y-3 overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center overflow-hidden border border-border">
                {entry.userAvatar ? (
                  <img src={entry.userAvatar} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-3 h-3 text-text-muted" />
                )}
              </div>
              <span className="text-[13px] font-bold text-text-primary">{entry.userName}</span>
              <span className="text-text-muted text-[12px]">•</span>
              <span className="text-[11px] font-bold text-text-muted uppercase tracking-widest">
                {entry.action}
              </span>
            </div>
            <span className="text-[10px] text-text-muted font-mono">{entry.timestamp}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <IDChip id={entry.userId} size="xs" className="text-accent/80" />
            <span className="text-[13px] text-text-secondary">referenced</span>
            <IDChip id={entry.entityId} size="xs" className="text-[#00E5FF]/80" />
          </div>

          <p className="text-[12px] text-text-muted italic truncate">{entry.description}</p>
        </div>

        <div className="shrink-0 flex items-center justify-center w-8">
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-text-muted" />
          ) : (
            <ChevronDown className="w-4 h-4 text-text-muted" />
          )}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && entry.diffs && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 bg-[#050505] space-y-4">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/20">
                    <th className="pb-3 text-[10px] font-bold text-text-muted uppercase tracking-widest">
                      Field
                    </th>
                    <th className="pb-3 text-[10px] font-bold text-text-muted uppercase tracking-widest">
                      Old Value
                    </th>
                    <th className="pb-3 text-[10px] font-bold text-text-muted uppercase tracking-widest">
                      New Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {entry.diffs.map((diff, i) => (
                    <tr key={i} className="border-b border-border/10 last:border-none">
                      <td className="py-3 text-[12px] font-mono text-text-secondary">
                        {diff.field}
                      </td>
                      <td className="py-3 text-[12px] font-mono text-[#FF444499] line-through">
                        {diff.oldValue}
                      </td>
                      <td className="py-3 text-[12px] font-mono text-[#00C896]">{diff.newValue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
