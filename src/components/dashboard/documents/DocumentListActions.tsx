"use client";

import { Plus, Upload, Search, Filter } from "lucide-react";
import { motion } from "framer-motion";

export function DocumentListActions() {
  return (
    <div className="w-full flex items-center justify-between p-8 bg-bg-primary border-b border-border">
      <div className="flex items-center gap-6">
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <h1 className="text-xl font-bold text-text-primary tracking-tight">Document Repository</h1>
         </div>
         <div className="relative group min-w-[400px]">
            <input 
              placeholder="Search Repository..."
              className="w-full bg-bg-card border border-border rounded-xl pl-12 pr-4 py-3 text-[14px] text-text-primary focus:outline-none focus:border-accent/50 transition-all shadow-inner"
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-accent transition-colors" />
         </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-border text-text-primary font-bold text-[13px] rounded-xl hover:bg-white/10 transition-all">
          <Upload className="w-4 h-4 text-text-muted" />
          UPLOAD
        </button>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-8 py-3 bg-accent text-[#050505] font-bold text-[13px] rounded-xl shadow-[0_0_20px_rgba(0,229,255,0.2)] hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all"
        >
          <Plus className="w-4 h-4" />
          NEW DOCUMENT
        </motion.button>
      </div>
    </div>
  );
}
