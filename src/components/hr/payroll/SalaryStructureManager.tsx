"use client";

import React from "react";
import {
  Plus,
  Settings2,
  Briefcase,
  CreditCard,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  Calculator,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { IDChip } from "@/components/ui/IDChip";

const MOCK_STRUCTURES = [
  {
    id: "PAY-STR-ENG-01",
    name: "Engineering Lead Structure",
    grade: "Lead (G4)",
    base: "250,000",
    net: "315,500",
    currency: "LKR",
    status: "Active",
  },
  {
    id: "PAY-STR-ENG-02",
    name: "Senior Engineer Structure",
    grade: "Senior (G3)",
    base: "180,000",
    net: "224,200",
    currency: "LKR",
    status: "Active",
  },
  {
    id: "PAY-STR-HR-01",
    name: "Executive HR Structure",
    grade: "Executive (G2)",
    base: "95,000",
    net: "112,000",
    currency: "LKR",
    status: "Active",
  },
];

export function SalaryStructureManager() {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-3xl p-8 shadow-sm flex flex-col h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h3 className="text-[#0F172A] font-bold">Salary Structure Config</h3>
          <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-widest mt-1">
            Grade-based Compensation Templates
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search templates..."
              className="pl-10 pr-4 py-2 rounded-xl border border-[#F1F5F9] bg-[#F8FAFC] text-xs font-bold w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#0F172A] text-white text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-lg shadow-[#0F172A]/20">
            <Plus className="w-4 h-4" />
            New Structure
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto scrollbar-hide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {MOCK_STRUCTURES.map((structure) => (
            <div
              key={structure.id}
              className="p-6 rounded-3xl border border-[#F1F5F9] bg-[#F8FAFC] hover:border-blue-200 hover:shadow-md transition-all group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <IDChip id={structure.id} size="xs" />
                  <h4 className="text-base font-black text-[#0F172A] mt-2">{structure.name}</h4>
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">
                    {structure.grade}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-white border border-[#F1F5F9] flex items-center justify-center text-blue-600 shadow-sm">
                  <Briefcase className="w-5 h-5" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 rounded-2xl bg-white border border-[#F1F5F9]">
                  <p className="text-[9px] font-black text-[#94A3B8] uppercase tracking-widest mb-1">
                    Base Salary
                  </p>
                  <p className="text-sm font-black text-[#0F172A]">
                    {structure.base}{" "}
                    <span className="text-[10px] text-[#94A3B8]">{structure.currency}</span>
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-[#F1F5F9]">
                  <p className="text-[9px] font-black text-[#94A3B8] uppercase tracking-widest mb-1">
                    Estimated Net
                  </p>
                  <p className="text-sm font-black text-[#10B981]">
                    {structure.net}{" "}
                    <span className="text-[10px] text-[#94A3B8]">{structure.currency}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white">
                <div className="flex items-center gap-2 text-[10px] font-bold text-[#64748B]">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Compliance Verified
                </div>
                <button className="text-[10px] font-black text-blue-600 hover:underline uppercase tracking-widest flex items-center gap-1">
                  View Breakdown
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 p-5 rounded-2xl bg-blue-50 border border-blue-100 flex items-center gap-4">
        <Calculator className="w-5 h-5 text-blue-600" />
        <p className="text-[11px] text-blue-800 font-medium leading-relaxed flex-1">
          Structures are currently using the <span className="font-bold">STAT-SL-24</span> statutory
          rule set. Any changes to EPF/ETF will reflect in next month's payroll preview.
        </p>
      </div>
    </div>
  );
}
