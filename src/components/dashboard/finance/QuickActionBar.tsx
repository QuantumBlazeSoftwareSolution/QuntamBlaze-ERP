"use client";

import { FilePlus, Receipt, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

export function QuickActionBar() {
  const ACTIONS = [
    { 
      label: "New Quotation (QTO)", 
      icon: FilePlus, 
      nextId: "QTO-2605-012", 
      color: "hover:border-accent/40 hover:bg-accent/5 hover:text-accent" 
    },
    { 
      label: "Generate Invoice (INV)", 
      icon: Receipt, 
      nextId: "INV-2605-0043", 
      color: "hover:border-accent/40 hover:bg-accent/5 hover:text-accent" 
    },
    { 
      label: "Log Receipt (RCT)", 
      icon: DollarSign, 
      nextId: "RCT-2605-088", 
      color: "hover:border-accent/40 hover:bg-accent/5 hover:text-accent" 
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {ACTIONS.map((action, index) => {
        const Icon = action.icon;
        return (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`flex flex-col items-start p-6 bg-white border border-border rounded-xl shadow-sm transition-all text-left group ${action.color}`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-page-bg border border-border flex items-center justify-center group-hover:bg-accent/10 transition-all">
                <Icon className="w-5 h-5 text-text-secondary group-hover:text-accent" />
              </div>
              <span className="text-[13px] font-bold text-text-primary tracking-tight">
                {action.label}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-1">
                Next Auto-ID
              </span>
              <span className="text-[12px] font-mono text-text-muted group-hover:text-accent/80 transition-colors">
                {action.nextId}
              </span>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
