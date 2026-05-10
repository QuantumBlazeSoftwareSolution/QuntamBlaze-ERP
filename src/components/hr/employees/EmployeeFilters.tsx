"use client";

import React from "react";
import { Search, Filter, ChevronDown, LayoutGrid, List, Network, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmployeeFiltersProps {
  view: "grid" | "list" | "chart";
  setView: (view: "grid" | "list" | "chart") => void;
}

export function EmployeeFilters({ view, setView }: EmployeeFiltersProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative flex-1 max-w-md group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] group-focus-within:text-[#10B981] transition-colors" />
          <input
            type="text"
            placeholder="Search by name, EMP-ID, or role..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all shadow-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-sm font-bold text-[#64748B] hover:bg-[#F8FAFC] transition-all shadow-sm">
          <Filter className="w-4 h-4" />
          <span>Filters</span>
          <div className="ml-1 w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-black">
            2
          </div>
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-xl border border-[#E2E8F0] shadow-sm">
          <ViewButton
            active={view === "grid"}
            onClick={() => setView("grid")}
            icon={LayoutGrid}
            label="Grid"
          />
          <ViewButton
            active={view === "list"}
            onClick={() => setView("list")}
            icon={List}
            label="List"
          />
          <ViewButton
            active={view === "chart"}
            onClick={() => setView("chart")}
            icon={Network}
            label="Org Chart"
          />
        </div>

        <div className="h-8 w-px bg-[#E2E8F0] mx-2 hidden lg:block" />

        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F172A] text-white text-xs font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-[#0F172A]/20">
          Export CSV
        </button>
      </div>
    </div>
  );
}

function ViewButton({ active, onClick, icon: Icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
        active ? "bg-white text-[#10B981] shadow-sm" : "text-[#94A3B8] hover:text-[#475569]"
      )}
    >
      <Icon className="w-4 h-4" />
      <span className="hidden md:inline">{label}</span>
    </button>
  );
}
