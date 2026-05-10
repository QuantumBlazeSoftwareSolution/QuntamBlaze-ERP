"use client";

import React from 'react';
import { 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  ArrowUpDown,
  Download
} from 'lucide-react';

export function KanbanFilterBar() {
  return (
    <div className="flex items-center justify-between mb-6 gap-4">
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] group-focus-within:text-[#10B981] transition-colors" />
          <input 
            type="text" 
            placeholder="Search tasks, IDs, or assignees..."
            className="w-full bg-white border border-[#E2E8F0] rounded-xl h-10 pl-10 pr-4 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#10B981]/10 focus:border-[#10B981] transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-3 h-10 rounded-xl border border-[#E2E8F0] bg-white text-[#475569] text-xs font-bold uppercase tracking-widest hover:bg-[#F8FAFC] transition-all">
          <Filter className="w-3.5 h-3.5" />
          Filter
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center p-1 bg-[#F1F5F9] rounded-xl border border-[#E2E8F0]">
           <button className="p-1.5 rounded-lg bg-white shadow-sm text-[#10B981]">
              <LayoutGrid className="w-4 h-4" />
           </button>
           <button className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#475569]">
              <List className="w-4 h-4" />
           </button>
        </div>
        
        <button className="flex items-center gap-2 px-4 h-10 rounded-xl border border-[#E2E8F0] bg-white text-[#475569] text-xs font-bold uppercase tracking-widest hover:bg-[#F8FAFC] transition-all">
          <ArrowUpDown className="w-3.5 h-3.5" />
          Sort
        </button>

        <button className="p-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#94A3B8] hover:text-[#10B981] transition-all">
          <Download className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
