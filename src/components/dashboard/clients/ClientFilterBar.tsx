"use client";

import { Search, ChevronDown } from "lucide-react";
import { AddClientButton } from "./AddClientButton";

export function ClientFilterBar() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-4 w-full md:w-auto">
        {/* Industry Filter */}
        <button className="flex items-center gap-3 px-4 py-2.5 bg-white border border-border rounded-lg text-[13px] text-text-secondary hover:border-border-hover transition-colors min-w-[160px]">
          <span>Industry: All</span>
          <ChevronDown className="w-4 h-4 ml-auto" />
        </button>

        {/* Status Filter */}
        <button className="flex items-center gap-3 px-4 py-2.5 bg-white border border-border rounded-lg text-[13px] text-text-secondary hover:border-border-hover transition-colors min-w-[160px]">
          <span>Status: Active</span>
          <ChevronDown className="w-4 h-4 ml-auto" />
        </button>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="relative flex-1 md:flex-none md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search Client Directory..."
            className="w-full bg-white border border-border rounded-lg py-2.5 pl-10 pr-4 text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 transition-colors"
          />
        </div>
        
        <AddClientButton />
      </div>
    </div>
  );
}
