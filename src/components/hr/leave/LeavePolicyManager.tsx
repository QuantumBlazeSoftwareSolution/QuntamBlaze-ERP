"use client";

import React from "react";
import {
  Plus,
  Settings2,
  ShieldCheck,
  Clock,
  Calendar,
  AlertCircle,
  ChevronRight,
  Filter,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { IDChip } from "@/components/ui/IDChip";

const MOCK_POLICIES = [
  {
    id: "POL-ANN-24",
    type: "Annual Leave",
    entitlement: "21 Days",
    carryForward: "5 Days",
    appliesTo: "All Staff",
    status: "Active",
  },
  {
    id: "POL-SCK-24",
    type: "Sick Leave",
    entitlement: "14 Days",
    carryForward: "None",
    appliesTo: "All Staff",
    status: "Active",
  },
  {
    id: "POL-CSL-24",
    type: "Casual Leave",
    entitlement: "7 Days",
    carryForward: "None",
    appliesTo: "Conf. Only",
    status: "Active",
  },
  {
    id: "POL-MAT-24",
    type: "Maternity",
    entitlement: "90 Days",
    carryForward: "None",
    appliesTo: "Female",
    status: "Special",
  },
];

export function LeavePolicyManager() {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-3xl p-8 shadow-sm h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h3 className="text-[#0F172A] font-bold">Leave Policy Engine</h3>
          <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-widest mt-1">
            Configure Entitlements & Accruals
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search policies..."
              className="pl-10 pr-4 py-2 rounded-xl border border-[#F1F5F9] bg-[#F8FAFC] text-xs font-bold w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#0F172A] text-white text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-lg shadow-[#0F172A]/20">
            <Plus className="w-4 h-4" />
            New Policy
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto scrollbar-hide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {MOCK_POLICIES.map((policy) => (
            <div
              key={policy.id}
              className="p-6 rounded-3xl border border-[#F1F5F9] bg-[#F8FAFC] hover:border-blue-200 hover:shadow-md transition-all group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <IDChip id={policy.id} size="xs" />
                  <h4 className="text-base font-black text-[#0F172A] mt-2">{policy.type}</h4>
                </div>
                <div
                  className={cn(
                    "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
                    policy.status === "Active"
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                      : "bg-blue-50 text-blue-600 border-blue-100"
                  )}
                >
                  {policy.status}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 rounded-2xl bg-white border border-[#F1F5F9]">
                  <p className="text-[9px] font-black text-[#94A3B8] uppercase tracking-widest mb-1">
                    Entitlement
                  </p>
                  <p className="text-sm font-black text-[#0F172A]">{policy.entitlement}</p>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-[#F1F5F9]">
                  <p className="text-[9px] font-black text-[#94A3B8] uppercase tracking-widest mb-1">
                    Carry-Forward
                  </p>
                  <p className="text-sm font-black text-[#0F172A]">{policy.carryForward}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-500" />
                  <span className="text-[10px] font-bold text-[#64748B]">
                    Applies to: <span className="text-[#0F172A]">{policy.appliesTo}</span>
                  </span>
                </div>
                <Settings2 className="w-4 h-4 text-[#CBD5E1] group-hover:text-blue-500 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 p-6 rounded-3xl bg-blue-50 border border-blue-100 flex items-center gap-6">
        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-sm shrink-0">
          <Clock className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h5 className="text-sm font-black text-blue-900 uppercase tracking-widest">
            Proration Engine Active
          </h5>
          <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
            New policies will automatically be prorated based on joining date (EMP-JOIN-YYYY) unless
            explicitly disabled in global settings.
          </p>
        </div>
        <button className="px-4 py-2 rounded-xl bg-white text-blue-600 text-[10px] font-black uppercase tracking-widest border border-blue-200 hover:bg-blue-100 transition-all">
          Global Config
        </button>
      </div>
    </div>
  );
}
