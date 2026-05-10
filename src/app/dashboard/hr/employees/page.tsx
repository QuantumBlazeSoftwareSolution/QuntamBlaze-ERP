"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Download, PlusCircle, Users, Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { HRNavbar } from "@/components/hr/HRNavbar";
import { EmployeeFilters } from "@/components/hr/employees/EmployeeFilters";
import { EmployeeGrid } from "@/components/hr/employees/EmployeeGrid";
import { EmployeeListTable } from "@/components/hr/employees/EmployeeListTable";
import { OrgChart } from "@/components/hr/employees/OrgChart";
import { MOCK_EMPLOYEES } from "@/lib/mockData/hr";

export default function EmployeeDirectoryPage() {
  const [view, setView] = useState<"grid" | "list" | "chart">("grid");

  return (
    <div className="flex-1 bg-[#F8FAFC] min-h-screen flex flex-col">
      <HRNavbar />

      <div className="p-8 max-w-[1600px] mx-auto w-full flex-1">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-[#0F172A] text-2xl font-bold">Employee Directory</h1>
              <div className="bg-[#10B981]/10 text-[#10B981] text-[10px] font-bold px-2 py-0.5 rounded border border-[#10B981]/20 uppercase tracking-widest flex items-center gap-1.5">
                <Users className="w-3 h-3" />
                {MOCK_EMPLOYEES.length} Active
              </div>
            </div>
            <p className="text-[#475569] text-sm mt-1">
              Search, filter and manage your global workforce.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm font-bold text-[#475569] hover:bg-[#F1F5F9] transition-all bg-white shadow-sm">
              <Download className="w-4 h-4 text-[#94A3B8]" />
              <span>Export Directory</span>
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#10B981] text-white text-sm font-bold shadow-lg shadow-[#10B981]/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
              <UserPlus className="w-4 h-4" />
              <span>Add New Employee</span>
            </button>
          </div>
        </div>

        {/* Filters & View Switcher */}
        <EmployeeFilters view={view} setView={setView} />

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1"
          >
            {view === "grid" && <EmployeeGrid employees={MOCK_EMPLOYEES} />}
            {view === "list" && <EmployeeListTable employees={MOCK_EMPLOYEES} />}
            {view === "chart" && <OrgChart />}
          </motion.div>
        </AnimatePresence>

        {/* Stats Summary Footer */}
        {view !== "chart" && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
            <QuickStat label="Engineering" value="45" color="border-blue-500" />
            <QuickStat label="Design" value="18" color="border-violet-500" />
            <QuickStat label="Marketing" value="12" color="border-pink-500" />
            <QuickStat label="Operations" value="22" color="border-emerald-500" />
          </div>
        )}
      </div>
    </div>
  );
}

function QuickStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className={cn("bg-white p-4 rounded-2xl border-l-4 shadow-sm", color)}>
      <p className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">{label}</p>
      <p className="text-xl font-black text-[#0F172A] mt-1">{value}</p>
    </div>
  );
}
