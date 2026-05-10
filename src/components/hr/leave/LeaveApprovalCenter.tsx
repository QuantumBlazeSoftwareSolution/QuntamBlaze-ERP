"use client";

import React from "react";
import {
  Check,
  X,
  Clock,
  User,
  Filter,
  Search,
  ChevronRight,
  MoreVertical,
  Paperclip,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { IDChip } from "@/components/ui/IDChip";

const MOCK_REQUESTS = [
  {
    id: "LEV-014",
    name: "James Wilson",
    type: "Annual",
    days: 5,
    range: "May 20 - May 24",
    status: "Pending",
    dept: "ENG",
  },
  {
    id: "LEV-015",
    name: "Elena Vance",
    type: "Sick",
    days: 2,
    range: "May 15 - May 16",
    status: "Pending",
    dept: "FIN",
  },
];

export function LeaveApprovalCenter() {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-3xl p-8 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-[#0F172A] font-bold">Leave Approval Inbox</h3>
          <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-widest mt-1">
            Review & Process Workforce Requests
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-xl border border-[#F1F5F9] text-[#94A3B8] hover:bg-[#F8FAFC]">
            <Filter className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest border border-blue-100">
            Bulk Approve
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-auto scrollbar-hide">
        {MOCK_REQUESTS.map((req) => (
          <div
            key={req.id}
            className="p-5 rounded-2xl border border-[#F1F5F9] bg-[#F8FAFC] hover:border-blue-200 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#F1F5F9] flex items-center justify-center text-[#94A3B8] font-bold text-xs shadow-sm">
                  {req.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-black text-[#0F172A]">{req.name}</p>
                    <IDChip id={req.id} size="xs" />
                  </div>
                  <p className="text-[9px] font-bold text-[#94A3B8] uppercase">
                    {req.dept} • {req.type} Leave
                  </p>
                </div>
              </div>
              <button className="p-1 text-[#CBD5E1] hover:text-[#0F172A]">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between py-4 border-y border-white">
              <div>
                <p className="text-[9px] font-black text-[#94A3B8] uppercase tracking-widest mb-0.5">
                  Requested Duration
                </p>
                <p className="text-xs font-bold text-[#0F172A]">{req.range}</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-black text-[#94A3B8] uppercase tracking-widest mb-0.5">
                  Total Days
                </p>
                <p className="text-xs font-black text-blue-600">{req.days} Days</p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <button className="flex-1 py-2 rounded-xl bg-[#10B981] text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#10B981]/10 hover:scale-[1.02] transition-all flex items-center justify-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                Approve
              </button>
              <button className="flex-1 py-2 rounded-xl bg-white border border-red-100 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-all flex items-center justify-center gap-1.5">
                <X className="w-3.5 h-3.5" />
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
