"use client";

import React, { useState } from "react";
import { Search, Filter, LayoutGrid, List, Network, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface EmployeeFiltersProps {
  view: "grid" | "list" | "chart";
  setView: (view: "grid" | "list" | "chart") => void;
  onExportCsv?: () => void;
  isExportingCsv?: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedDepartment: string;
  setSelectedDepartment: (dept: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
}

export function EmployeeFilters({
  view,
  setView,
  onExportCsv,
  isExportingCsv,
  searchQuery,
  setSearchQuery,
  selectedDepartment,
  setSelectedDepartment,
  selectedStatus,
  setSelectedStatus,
}: EmployeeFiltersProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const activeFilterCount = (selectedDepartment ? 1 : 0) + (selectedStatus ? 1 : 0);

  return (
    <div className="flex flex-col mb-8">
      {/* Search & Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] group-focus-within:text-[#10B981] transition-colors" />
            <input
              type="text"
              placeholder="Search by name, EMP-ID, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all shadow-sm"
            />
          </div>
          <button
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold transition-all shadow-sm cursor-pointer",
              isPanelOpen
                ? "border-[#10B981] bg-[#10B981]/5 text-[#10B981]"
                : "border-[#E2E8F0] bg-white text-[#64748B] hover:bg-[#F8FAFC]"
            )}
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <div className="ml-1 w-5 h-5 rounded-full bg-[#10B981] text-white flex items-center justify-center text-[10px] font-black">
                {activeFilterCount}
              </div>
            )}
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

          <button
            onClick={onExportCsv}
            disabled={isExportingCsv}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F172A] text-white text-xs font-bold transition-all shadow-lg shadow-[#0F172A]/20 cursor-pointer",
              isExportingCsv ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.02] active:scale-[0.98]"
            )}
          >
            {isExportingCsv && <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-300" />}
            <span>{isExportingCsv ? "Exporting..." : "Export CSV"}</span>
          </button>
        </div>
      </div>

      {/* Collapsible Filter Panel */}
      <AnimatePresence>
        {isPanelOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-4 p-5 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              {/* Department Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Department</label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="">All Departments</option>
                  <option value="ENGINEERING">Engineering</option>
                  <option value="DESIGN">Design</option>
                  <option value="PRODUCT">Product</option>
                  <option value="MARKETING">Marketing</option>
                  <option value="SALES">Sales</option>
                  <option value="HR">HR</option>
                  <option value="FINANCE">Finance</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Clear Filters */}
              <div>
                {activeFilterCount > 0 ? (
                  <button
                    onClick={() => {
                      setSelectedDepartment("");
                      setSelectedStatus("");
                    }}
                    className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-xl border border-rose-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                    Clear Filters
                  </button>
                ) : (
                  <div className="text-xs text-[#94A3B8] italic pb-2 text-center">
                    Select values above to filter the directory
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ViewButton({ active, onClick, icon: Icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer",
        active ? "bg-white text-[#10B981] shadow-sm" : "text-[#94A3B8] hover:text-[#475569]"
      )}
    >
      <Icon className="w-4 h-4" />
      <span className="hidden md:inline">{label}</span>
    </button>
  );
}
