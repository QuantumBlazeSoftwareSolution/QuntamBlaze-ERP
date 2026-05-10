"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  User,
  Briefcase,
  CreditCard,
  ShieldCheck,
  FileText,
  Box,
  Target,
  Clock,
  Sparkles,
  History,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { HRNavbar } from "@/components/hr/HRNavbar";
import { EmployeeProfileHeader } from "@/components/hr/employees/EmployeeProfileHeader";
import { PersonalInfoTab } from "@/components/hr/employees/PersonalInfoTab";
import { EmploymentDetailsTab } from "@/components/hr/employees/EmploymentDetailsTab";
import { BankPayrollTab } from "@/components/hr/employees/BankPayrollTab";
import { AssetsTab } from "@/components/hr/employees/AssetsTab";
import { PerformanceTab } from "@/components/hr/employees/PerformanceTab";
import { EmployeePayHistory } from "@/components/hr/payroll/EmployeePayHistory";
import { OKRWorkspace } from "@/components/hr/performance/OKRWorkspace";
import { KpiMetricTracker } from "@/components/hr/performance/KpiMetricTracker";
import { MOCK_EMPLOYEES } from "@/lib/mockData/hr";

const TABS = [
  { id: "personal", label: "Personal", icon: User },
  { id: "employment", label: "Employment", icon: Briefcase },
  { id: "payroll", label: "Compensation", icon: CreditCard },
  { id: "financials", label: "Financials", icon: History },
  { id: "assets", label: "Assets", icon: Box },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "performance", label: "Performance", icon: Target },
  { id: "attendance", label: "Attendance", icon: Clock },
  { id: "timeline", label: "Timeline", icon: Sparkles },
];

export default function EmployeeProfilePage() {
  const { empId } = useParams();
  const [activeTab, setActiveTab] = useState("personal");

  const employee = MOCK_EMPLOYEES.find((e) => e.id === empId) || MOCK_EMPLOYEES[0];

  return (
    <div className="flex-1 bg-[#F8FAFC] min-h-screen flex flex-col">
      <HRNavbar />

      <div className="p-8 max-w-[1600px] mx-auto w-full flex-1">
        {/* Back Link */}
        <Link
          href="/dashboard/hr/employees"
          className="flex items-center gap-2 text-[#94A3B8] hover:text-[#475569] text-sm font-bold mb-6 transition-colors w-fit"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Directory
        </Link>

        {/* Profile Header */}
        <EmployeeProfileHeader employee={employee} />

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-8 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex items-center gap-1 bg-white p-1.5 rounded-2xl border border-[#E2E8F0] shadow-sm">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
                    isActive
                      ? "bg-[#0F172A] text-white shadow-lg shadow-[#0F172A]/20"
                      : "text-[#64748B] hover:bg-[#F8FAFC]"
                  )}
                >
                  <Icon
                    className={cn("w-3.5 h-3.5", isActive ? "text-[#10B981]" : "text-[#94A3B8]")}
                  />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "personal" && <PersonalInfoTab employee={employee} />}
              {activeTab === "employment" && <EmploymentDetailsTab employee={employee} />}
              {activeTab === "payroll" && <BankPayrollTab employee={employee} />}
              {activeTab === "financials" && <EmployeePayHistory />}
              {activeTab === "assets" && <AssetsTab employee={employee} />}
              {activeTab === "performance" && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  <div className="xl:col-span-2">
                    <OKRWorkspace />
                  </div>
                  <div className="xl:col-span-1">
                    <KpiMetricTracker />
                  </div>
                </div>
              )}

              {/* Placeholder for other tabs */}
              {![
                "personal",
                "employment",
                "payroll",
                "assets",
                "performance",
                "financials",
              ].includes(activeTab) && (
                <div className="bg-white border border-[#E2E8F0] border-dashed rounded-3xl p-20 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-[#F8FAFC] flex items-center justify-center text-[#94A3B8] mb-4">
                    <FileText className="w-8 h-8" />
                  </div>
                  <h3 className="text-[#0F172A] font-bold text-lg">
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Module Coming Soon
                  </h3>
                  <p className="text-[#94A3B8] text-sm mt-2 max-w-sm">
                    We are currently orchestrating the {activeTab} analytics for {employee.name}.
                    This module will be live in the next sprint.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
