"use client";

import React from "react";
import { ArrowRightLeft, Check, X, Clock, User, ArrowRight, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { IDChip } from "@/components/ui/IDChip";

const MOCK_SWAPS = [
  {
    id: "SWP-001",
    requestor: { id: "EMP-001", name: "Alex Mercer", shift: "Morning" },
    target: { id: "EMP-042", name: "James Wilson", shift: "Night" },
    date: "May 15, 2024",
    reason: "Family emergency, need to switch for one night.",
    status: "Pending",
  },
  {
    id: "SWP-002",
    requestor: { id: "EMP-015", name: "Elena Vance", shift: "Evening" },
    target: { id: "EMP-008", name: "Marcus Thorne", shift: "Morning" },
    date: "May 16, 2024",
    reason: "Medical appointment.",
    status: "Pending",
  },
];

export function SwapRequestPortal() {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-[#0F172A] font-bold">Shift Swap Portal</h3>
          <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-widest mt-1">
            Pending Peer-to-Peer Requests
          </p>
        </div>
        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-black">
          {MOCK_SWAPS.length}
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-auto scrollbar-hide">
        {MOCK_SWAPS.map((swap) => (
          <div
            key={swap.id}
            className="p-5 rounded-2xl border border-[#F1F5F9] bg-[#F8FAFC] hover:border-blue-200 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <IDChip id={swap.id} size="xs" />
                <span className="text-[9px] font-black text-[#94A3B8] uppercase">{swap.date}</span>
              </div>
              <div className="flex items-center gap-1 text-[9px] font-black text-blue-600 bg-white px-2 py-0.5 rounded-full border border-blue-100 uppercase tracking-tighter">
                <Clock className="w-3 h-3" />
                Waiting for HR
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="flex-1">
                <p className="text-[9px] font-black text-[#94A3B8] uppercase tracking-widest mb-1">
                  Requestor
                </p>
                <p className="text-xs font-bold text-[#0F172A]">{swap.requestor.name}</p>
                <p className="text-[9px] font-bold text-blue-600 uppercase">
                  {swap.requestor.shift} Shift
                </p>
              </div>
              <div className="px-4">
                <ArrowRightLeft className="w-5 h-5 text-[#CBD5E1]" />
              </div>
              <div className="flex-1 text-right">
                <p className="text-[9px] font-black text-[#94A3B8] uppercase tracking-widest mb-1">
                  Target Partner
                </p>
                <p className="text-xs font-bold text-[#0F172A]">{swap.target.name}</p>
                <p className="text-[9px] font-bold text-slate-800 uppercase">
                  {swap.target.shift} Shift
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#F1F5F9] mb-6">
              <p className="text-[9px] font-black text-[#94A3B8] uppercase tracking-widest mb-1 flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" />
                Reason for Swap
              </p>
              <p className="text-[11px] text-[#475569] leading-relaxed font-medium">
                {swap.reason}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button className="flex-1 py-2 rounded-xl bg-[#10B981] text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#10B981]/10 hover:scale-[1.02] transition-all">
                Approve Swap
              </button>
              <button className="flex-1 py-2 rounded-xl bg-white border border-red-100 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-all">
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-6 py-2.5 rounded-xl border border-[#E2E8F0] text-[10px] font-black text-[#94A3B8] hover:bg-[#F8FAFC] transition-all uppercase tracking-widest">
        View Swap History
      </button>
    </div>
  );
}
