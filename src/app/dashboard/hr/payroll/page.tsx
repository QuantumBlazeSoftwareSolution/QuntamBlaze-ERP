"use client";

import React from "react";
import { HRNavbar } from "@/components/hr/HRNavbar";
import { SalaryStructureManager } from "@/components/hr/payroll/SalaryStructureManager";
import { StatutoryRuleEditor } from "@/components/hr/payroll/StatutoryRuleEditor";
import { PayrollBatchProcessor } from "@/components/hr/payroll/PayrollBatchProcessor";
import { PayrollValidationWall } from "@/components/hr/payroll/PayrollValidationWall";
import { PayslipGenerator } from "@/components/hr/payroll/PayslipGenerator";
import { EmployeePayHistory } from "@/components/hr/payroll/EmployeePayHistory";
import { TaxSummaryCard } from "@/components/hr/payroll/TaxSummaryCard";
import {
  CreditCard,
  Settings,
  History,
  Download,
  ShieldCheck,
  TrendingUp,
  FileText,
  Calculator,
  ArrowUpRight,
  Play,
  Archive,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function PayrollManagementPage() {
  const [activeTab, setActiveTab] = React.useState<"structures" | "statutory" | "run" | "archive">(
    "structures"
  );

  return (
    <div className="flex-1 bg-[#F8FAFC] min-h-screen flex flex-col">
      <HRNavbar />

      <div className="p-8 max-w-[1600px] mx-auto w-full flex-1 flex flex-col">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-[#0F172A] text-2xl font-bold">Payroll & Compensation</h1>
            <p className="text-[#475569] text-sm mt-1">
              Manage salary structures, statutory rules, and payroll processing.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm font-bold text-[#475569] hover:bg-[#F1F5F9] transition-all bg-white">
              <History className="w-4 h-4 text-[#94A3B8]" />
              Past Runs
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-600/20 hover:scale-[1.02] transition-all">
              <Calculator className="w-4 h-4" />
              Run Payroll (JUN)
            </button>
          </div>
        </div>

        {/* Workspace Navigation */}
        <div className="flex items-center gap-1 bg-[#F1F5F9] p-1.5 rounded-2xl border border-[#E2E8F0] w-fit mb-8 shadow-sm">
          <TabButton
            active={activeTab === "structures"}
            onClick={() => setActiveTab("structures")}
            label="Salary Structures"
          />
          <TabButton
            active={activeTab === "statutory"}
            onClick={() => setActiveTab("statutory")}
            label="Statutory Rules"
          />
          <TabButton
            active={activeTab === "run"}
            onClick={() => setActiveTab("run")}
            label="Monthly Run"
          />
          <TabButton
            active={activeTab === "archive"}
            onClick={() => setActiveTab("archive")}
            label="Payslip Archive"
          />
        </div>

        <div className="flex-1 grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Workspace */}
          <div className="xl:col-span-2">
            {activeTab === "structures" && <SalaryStructureManager />}
            {activeTab === "statutory" && <StatutoryRuleEditor />}
            {activeTab === "run" && <PayrollBatchProcessor />}
            {activeTab === "archive" && <PayslipGenerator />}
          </div>

          {/* Stats & Compliance Sidebar */}
          <div className="xl:col-span-1 space-y-8">
            {activeTab === "run" && <PayrollValidationWall />}
            {activeTab === "archive" && <TaxSummaryCard />}

            {(activeTab === "structures" || activeTab === "statutory") && (
              <>
                <div className="bg-white border border-[#E2E8F0] rounded-3xl p-8 shadow-sm">
                  <h4 className="text-sm font-black text-[#0F172A] uppercase tracking-widest mb-8 flex items-center justify-between">
                    Payroll Health
                    <TrendingUp className="w-4 h-4 text-[#10B981]" />
                  </h4>
                  <div className="space-y-8">
                    <StatRow label="Total Monthly Outflow" value="4.2M" sub="LKR" trend="+2.4%" />
                    <StatRow label="Statutory Liabilities" value="840K" sub="LKR" trend="Stable" />
                    <StatRow label="Active Pay Structures" value="12" sub="Templates" />
                  </div>
                </div>

                <div className="bg-[#0F172A] rounded-3xl p-8 text-white relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-all shadow-xl">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full group-hover:scale-110 transition-transform" />
                  <h4 className="text-base font-black mb-2 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#10B981]" />
                    Audit Readiness
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-6">
                    Compensation structures are fully audited against EPF/ETF Act No. 15. Last
                    validation: May 08.
                  </p>
                  <button className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-1 hover:underline">
                    View Compliance Report
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

function StatRow({
  label,
  value,
  sub,
  trend,
}: {
  label: string;
  value: string;
  sub: string;
  trend?: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-4 last:border-0 last:pb-0">
      <div>
        <p className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest mb-1">
          {label}
        </p>
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-black text-[#0F172A]">{value}</span>
          <span className="text-[9px] font-bold text-[#94A3B8]">{sub}</span>
        </div>
      </div>
      {trend && (
        <span
          className={cn(
            "text-[9px] font-black px-2 py-0.5 rounded-full",
            trend.startsWith("+") ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-500"
          )}
        >
          {trend}
        </span>
      )}
    </div>
  );
}
