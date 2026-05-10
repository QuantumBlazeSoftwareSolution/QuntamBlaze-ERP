"use client";

import React, { useState } from "react";
import {
  CreditCard,
  Wallet,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  FileText,
} from "lucide-react";
import { Employee } from "@/types/hr";
import { cn } from "@/lib/utils";

interface BankPayrollTabProps {
  employee: Employee;
}

export function BankPayrollTab({ employee }: BankPayrollTabProps) {
  const [showFullAccount, setShowFullAccount] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left: Bank Details */}
      <div className="space-y-8">
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-[#10B981]">
              <CreditCard className="w-4 h-4" />
            </div>
            <h3 className="text-[#0F172A] font-bold">Salary Payment Method</h3>
          </div>

          <div className="bg-white border border-[#F1F5F9] rounded-2xl p-8 space-y-8 relative overflow-hidden">
            {/* Decorative pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F8FAFC] rounded-bl-full opacity-50" />

            <div className="relative z-10 flex items-center gap-4">
              <div className="w-16 h-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center text-white shadow-lg">
                <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
                  <span className="text-[8px] font-black italic tracking-tighter">BANK</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-black text-[#0F172A] uppercase tracking-tight">
                  {employee.bankDetails?.bank || "Bank Name Not Set"}
                </p>
                <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-widest">
                  {employee.bankDetails?.branch || "Branch Not Set"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 pt-6 border-t border-[#F1F5F9]">
              <div>
                <p className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest mb-1.5">
                  Account Number
                </p>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] border border-[#F1F5F9]">
                  <span className="text-sm font-mono font-bold tracking-widest text-[#475569]">
                    {showFullAccount
                      ? "800123456789"
                      : employee.bankDetails?.accountNumber || "XXXXXXXXXX"}
                  </span>
                  <button
                    onClick={() => setShowFullAccount(!showFullAccount)}
                    className="p-1.5 hover:bg-white rounded-lg transition-all text-[#94A3B8] hover:text-[#10B981]"
                  >
                    {showFullAccount ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest mb-1.5">
                  Account Name
                </p>
                <p className="text-sm font-bold text-[#475569]">
                  {employee.bankDetails?.accountName || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-violet-50 border border-violet-100 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="w-5 h-5 text-violet-500" />
            <p className="text-xs font-bold text-violet-900">Security & Compliance</p>
          </div>
          <p className="text-[11px] text-violet-700 leading-relaxed">
            This employee's financial data is encrypted and only accessible to authorized HR and
            Payroll administrators. Any access is logged in the system audit trail.
          </p>
        </section>
      </div>

      {/* Right: Salary Overview */}
      <div className="space-y-8">
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <Wallet className="w-4 h-4" />
            </div>
            <h3 className="text-[#0F172A] font-bold">Salary Components</h3>
          </div>

          <div className="bg-white border border-[#F1F5F9] rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#F8FAFC]">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-sm font-bold text-[#475569]">Monthly Gross Salary</span>
              </div>
              <span className="text-sm font-black text-[#0F172A]">$ 4,500.00</span>
            </div>

            <div className="space-y-4">
              <SalaryRow label="Basic Salary" value="$ 3,000.00" />
              <SalaryRow label="Housing Allowance" value="$ 800.00" />
              <SalaryRow label="Conveyance" value="$ 400.00" />
              <SalaryRow label="Special Allowance" value="$ 300.00" />
            </div>

            <div className="pt-6 border-t border-[#F1F5F9]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-[#94A3B8]">Deductions (EPF/Tax)</span>
                <span className="text-sm font-bold text-red-500">- $ 675.00</span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-dashed border-[#F1F5F9]">
                <span className="text-lg font-black text-[#0F172A]">Net Payable</span>
                <span className="text-lg font-black text-[#10B981]">$ 3,825.00</span>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-[#0F172A] font-bold mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#94A3B8]" />
            Recent Payslips
          </h3>
          <div className="space-y-2">
            <PayslipItem month="April 2024" id="PAY-EMP-ENG-26-001-2404" />
            <PayslipItem month="March 2024" id="PAY-EMP-ENG-26-001-2403" />
          </div>
        </section>
      </div>
    </div>
  );
}

function SalaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center px-2">
      <span className="text-xs font-medium text-[#64748B]">{label}</span>
      <span className="text-xs font-bold text-[#475569]">{value}</span>
    </div>
  );
}

function PayslipItem({ month, id }: { month: string; id: string }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl border border-[#F1F5F9] bg-white hover:border-blue-200 hover:bg-blue-50 transition-all cursor-pointer group">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#F8FAFC] flex items-center justify-center text-[#94A3B8] group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
          <FileText className="w-4 h-4" />
        </div>
        <div>
          <p className="text-xs font-bold text-[#475569]">{month}</p>
          <p className="text-[9px] font-bold text-[#94A3B8] tracking-widest uppercase">{id}</p>
        </div>
      </div>
      <ArrowRight className="w-4 h-4 text-[#CBD5E1] group-hover:text-blue-500 transition-all" />
    </div>
  );
}
