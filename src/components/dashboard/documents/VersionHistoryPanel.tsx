"use client";

import { motion, AnimatePresence } from "framer-motion";
import { History, RotateCcw, Eye, User, Clock } from "lucide-react";
import { Document } from "@/types/documents";
import { useDocumentStore } from "@/store/useDocumentStore";
import { cn } from "@/lib/utils";

export function VersionHistoryPanel({ document }: { document?: Document }) {
  const { selectedDocumentId } = useDocumentStore();

  return (
    <AnimatePresence>
      {selectedDocumentId && document && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          className="w-[340px] bg-white border-l border-divider h-full flex flex-col overflow-hidden shadow-2xl"
        >
          <div className="p-6 border-b border-divider bg-page-bg">
            <div className="flex items-center gap-3 mb-2">
              <History className="w-4 h-4 text-accent" />
              <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-[0.2em]">Version History</h3>
            </div>
            <p className="text-[13px] font-bold text-text-primary truncate">{document.id}: {document.name}</p>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {document.versions.map((v, i) => (
              <div 
                key={v.id} 
                className={cn(
                  "relative pl-8 pb-8 last:pb-0 border-l border-divider",
                  i === 0 && "border-l-2 border-accent"
                )}
              >
                {/* Timeline Dot */}
                <div className={cn(
                  "absolute left-[-9px] top-0 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center",
                  i === 0 ? "bg-accent shadow-sm" : "bg-page-bg border-divider"
                )}>
                   <span className={cn("text-[7px] font-bold", i === 0 ? "text-white" : "text-text-muted")}>V{v.version}</span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-widest",
                      i === 0 ? "text-accent" : "text-text-muted"
                    )}>
                      {i === 0 ? "Current Draft" : "Revision Draft"}
                    </span>
                    <span className="text-[10px] text-text-muted font-mono">{v.timestamp}</span>
                  </div>

                  <p className="text-[13px] text-text-secondary leading-relaxed bg-page-bg p-3 rounded-lg border border-divider">
                    {v.summary}
                  </p>

                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-page-bg border border-divider flex items-center justify-center overflow-hidden">
                           <User className="w-3 h-3 text-text-muted" />
                        </div>
                        <span className="text-[11px] text-text-muted">{v.authorName}</span>
                     </div>
                     <div className="flex gap-2">
                        {i !== 0 && (
                          <button className="flex items-center gap-1.5 px-3 py-1 border border-border rounded text-[10px] font-bold text-warning hover:bg-red-50 transition-all">
                            <RotateCcw className="w-3 h-3" />
                            RESTORE
                          </button>
                        )}
                        <button className="flex items-center gap-1.5 px-3 py-1 bg-page-bg border border-border rounded text-[10px] font-bold text-text-primary hover:bg-white transition-all">
                          <Eye className="w-3 h-3" />
                          VIEW
                        </button>
                     </div>
                  </div>

                  {/* Diff Summary indicator */}
                  <div className="flex gap-4 text-[10px] font-bold">
                    <span className="text-success">+12</span>
                    <span className="text-danger">-3</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
