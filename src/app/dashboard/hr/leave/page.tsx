"use client";

import React from "react";
import { HRNavbar } from "@/components/hr/HRNavbar";
import { LeavePolicyManager } from "@/components/hr/leave/LeavePolicyManager";
import { AccrualLogicBuilder } from "@/components/hr/leave/AccrualLogicBuilder";
import { LeaveBalanceTracker } from "@/components/hr/leave/LeaveBalanceTracker";
import { LeaveRequestPortal } from "@/components/hr/leave/LeaveRequestPortal";
import { LeaveApprovalCenter } from "@/components/hr/leave/LeaveApprovalCenter";
import { LeaveTeamCalendar } from "@/components/hr/leave/LeaveTeamCalendar";
import { DepartmentAvailabilityMatrix } from "@/components/hr/leave/DepartmentAvailabilityMatrix";
import {
  FileText,
  Settings,
  ChevronRight,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Inbox,
  Send,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function LeaveManagementPage() {
  const [activeTab, setActiveTab] = React.useState<
    "policies" | "accruals" | "inbox" | "apply" | "availability"
  >("policies");

  return (
    <div className="flex-1 bg-[#F8FAFC] min-h-screen flex flex-col">
      <HRNavbar />

      <div className="p-8 max-w-[1600px] mx-auto w-full flex-1 flex flex-col">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-[#0F172A] text-2xl font-bold">Leave Management</h1>
            <p className="text-[#475569] text-sm mt-1">
              Define entitlements, accrual rules, and global leave policies.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm font-bold text-[#475569] hover:bg-[#F1F5F9] transition-all bg-white">
              <Calendar className="w-4 h-4 text-[#94A3B8]" />
              Leave Calendar
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-600/20 hover:scale-[1.02] transition-all">
              <Settings className="w-4 h-4" />
              Global Settings
            </button>
          </div>
        </div>

        {/* Workspace Navigation */}
        <div className="flex items-center gap-1 bg-[#F1F5F9] p-1.5 rounded-2xl border border-[#E2E8F0] w-fit mb-8">
          <TabButton
            active={activeTab === "policies"}
            onClick={() => setActiveTab("policies")}
            label="Policy Manager"
          />
          <TabButton
            active={activeTab === "accruals"}
            onClick={() => setActiveTab("accruals")}
            label="Accrual Logic"
          />
          <TabButton
            active={activeTab === "inbox"}
            onClick={() => setActiveTab("inbox")}
            label="Approval Inbox"
          />
          <TabButton
            active={activeTab === "apply"}
            onClick={() => setActiveTab("apply")}
            label="My Requests"
          />
          <TabButton
            active={activeTab === "availability"}
            onClick={() => setActiveTab("availability")}
            label="Team Availability"
          />
        </div>

        {/* Global Balance Tracker (Visible in Apply/Inbox mostly) */}
        {(activeTab === "apply" || activeTab === "inbox") && <LeaveBalanceTracker />}

        <div className="flex-1 grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Workspace */}
          <div className="xl:col-span-2">
            {activeTab === "policies" && <LeavePolicyManager />}
            {activeTab === "accruals" && <AccrualLogicBuilder />}
            {activeTab === "inbox" && <LeaveApprovalCenter />}
            {activeTab === "apply" && <LeaveRequestPortal />}
            {activeTab === "availability" && <LeaveTeamCalendar />}
          </div>

          {/* Side Stats & Information */}
          <div className="xl:col-span-1 space-y-8">
            {activeTab === "availability" ? (
              <DepartmentAvailabilityMatrix />
            ) : (
              <>
                <div className="bg-white border border-[#E2E8F0] rounded-3xl p-8 shadow-sm">
                  <h4 className="text-sm font-black text-[#0F172A] uppercase tracking-widest mb-6">
                    Leave Distribution
                  </h4>
                  <div className="space-y-6">
                    <ProgressStat label="Annual Leave" percentage={45} color="bg-blue-500" />
                    <ProgressStat label="Sick Leave" percentage={12} color="bg-red-500" />
                    <ProgressStat label="Casual Leave" percentage={28} color="bg-amber-500" />
                    <ProgressStat label="Others" percentage={15} color="bg-emerald-500" />
                  </div>
                </div>

                <div className="bg-[#0F172A] rounded-3xl p-8 text-white relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-all">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full group-hover:scale-110 transition-transform" />
                  <h4 className="text-base font-black mb-2 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#10B981]" />
                    Compliance Audit
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-6">
                    Last audit completed on May 05, 2024. All leave policies are compliant with
                    SL-Labour regulations.
                  </p>
                  <button className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-1 hover:underline">
                    View Audit Log
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
        active
          ? "bg-[#0F172A] text-white shadow-lg shadow-[#0F172A]/20"
          : "text-[#64748B] hover:text-[#0F172A]"
      )}
    >
      {label}
    </button>
  );
}

function ProgressStat({
  label,
  percentage,
  color,
}: {
  label: string;
  percentage: number;
  color: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black text-[#64748B] uppercase tracking-widest">
          {label}
        </span>
        <span className="text-[10px] font-black text-[#0F172A]">{percentage}%</span>
      </div>
      <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-1000", color)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
