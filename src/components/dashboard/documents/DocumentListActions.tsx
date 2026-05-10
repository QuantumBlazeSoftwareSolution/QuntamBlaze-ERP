"use client";

import { Plus, Upload, Search, Filter } from "lucide-react";
import { motion } from "framer-motion";

export function DocumentListActions() {
  return (
    <div className="w-full flex items-center justify-between p-6 bg-white border-b border-divider">
      <div className="flex items-center gap-6">
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <h1 className="text-xl font-bold text-text-primary tracking-tight">Document Repository</h1>
         </div>
         <div className="relative group min-w-[400px]">
            <input 
              placeholder="Search Repository..."
              className="w-full bg-page-bg border border-border rounded-xl pl-12 pr-4 py-2.5 text-[14px] text-text-primary focus:outline-none focus:border-accent/50 transition-all"
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-accent transition-colors" />
         </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 px-5 py-2.5 bg-page-bg border border-border text-text-primary font-bold text-[13px] rounded-xl hover:bg-white transition-all shadow-sm">
          <Upload className="w-4 h-4 text-text-muted" />
          UPLOAD
        </button>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-6 py-2.5 bg-accent text-white font-bold text-[13px] rounded-xl shadow-sm shadow-accent/20 hover:bg-accent/90 transition-all"
        >
          <Plus className="w-4 h-4" />
          NEW DOCUMENT
        </motion.button>
      </div>
    </div>
  );
}
