"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, FileDown, History, Search, Filter, ChevronDown } from "lucide-react";
import { Virtuoso } from "react-virtuoso";
import { useAuditStore } from "@/store/useAuditStore";
import { MOCK_AUDIT_LOGS } from "@/lib/mockData/auditLogs";
import { AuditEntryExpandable } from "./AuditEntryExpandable";
import { exportAuditLogCSV } from "@/lib/audit/csvExport";

export function AuditLogDrawer() {
  const { isOpen, closeAuditLog, entityId } = useAuditStore();

  const handleExport = () => {
    const blob = exportAuditLogCSV(MOCK_AUDIT_LOGS);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-log-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAuditLog}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: 480 }}
            animate={{ x: 0 }}
            exit={{ x: 480 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-screen w-[480px] bg-[#0A0A0A] border-l border-border z-[101] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-border flex items-center justify-between bg-white/[0.02]">
               <div className="flex items-center gap-3">
                  <History className="w-5 h-5 text-accent" />
                  <div>
                    <h3 className="text-xl font-bold text-text-primary">System Audit Log</h3>
                    {entityId && <p className="text-[11px] text-accent font-bold uppercase tracking-widest mt-0.5">Focus: {entityId}</p>}
                  </div>
               </div>
               <div className="flex items-center gap-2">
                  <button 
                    onClick={handleExport}
                    className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-[12px] font-bold text-text-muted hover:text-text-primary hover:border-accent transition-all"
                  >
                     <FileDown className="w-4 h-4" />
                     EXPORT CSV
                  </button>
                  <button onClick={closeAuditLog} className="p-2 text-text-muted hover:text-text-primary transition-colors">
                     <X className="w-6 h-6" />
                  </button>
               </div>
            </div>

            {/* Filters */}
            <div className="p-6 border-b border-border bg-[#050505] flex gap-3">
               <div className="flex-1 relative">
                  <select className="w-full bg-[#0A0A0A] border border-border rounded-lg pl-4 pr-10 py-2 text-[12px] text-text-secondary appearance-none">
                     <option>All Users</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
               </div>
               <div className="flex-1 relative">
                  <select className="w-full bg-[#0A0A0A] border border-border rounded-lg pl-4 pr-10 py-2 text-[12px] text-text-secondary appearance-none">
                     <option>All Actions</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
               </div>
               <div className="flex-1 relative">
                  <select className="w-full bg-[#0A0A0A] border border-border rounded-lg pl-4 pr-10 py-2 text-[12px] text-text-secondary appearance-none">
                     <option>Last 24 Hours</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
               </div>
            </div>

            {/* Virtualized List */}
            <div className="flex-1 overflow-hidden relative">
               {/* Timeline Line */}
               <div className="absolute left-[31px] top-0 bottom-0 w-[1px] bg-[#1A1A1A] z-0" />
               
               <Virtuoso
                 data={MOCK_AUDIT_LOGS}
                 itemContent={(index, entry) => (
                   <AuditEntryExpandable key={entry.id} entry={entry} />
                 )}
                 className="custom-scrollbar"
               />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
