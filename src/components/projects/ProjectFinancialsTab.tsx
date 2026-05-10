"use client";

import React from "react";
import { DollarSign, ArrowUpRight, ArrowDownRight, TrendingUp, CreditCard, Download, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface Transaction {
  id: string;
  label: string;
  amount: number;
  date: string;
  status: "Paid" | "Pending" | "Overdue";
  type: "Invoice" | "Expense";
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "INV-26-089", label: "Initial Milestone Payment", amount: 45000, date: "2026-02-15", status: "Paid", type: "Invoice" },
  { id: "EXP-26-012", label: "Cloud Infrastructure Setup", amount: 12400, date: "2026-03-01", status: "Paid", type: "Expense" },
  { id: "INV-26-112", label: "Phase 2 Completion", amount: 35000, date: "2026-05-01", status: "Pending", type: "Invoice" },
  { id: "EXP-26-045", label: "External Security Audit", amount: 8500, date: "2026-05-05", status: "Overdue", type: "Expense" },
];

export function ProjectFinancialsTab() {
  const totalBudget = 250000;
  const consumed = 145000;
  const percentage = (consumed / totalBudget) * 100;

  return (
    <div className="space-y-8">
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FinanceCard 
          label="Total Allocation" 
          value={`$${(totalBudget / 1000).toFixed(0)}k`} 
          trend="+15% vs baseline" 
          icon={DollarSign} 
          color="bg-[#10B981]" 
        />
        <FinanceCard 
          label="Consumed Budget" 
          value={`$${(consumed / 1000).toFixed(0)}k`} 
          trend="Within threshold" 
          icon={TrendingUp} 
          color="bg-[#3B82F6]" 
        />
        <FinanceCard 
          label="Pending Payouts" 
          value="$42,500" 
          trend="2 Unpaid Invoices" 
          icon={CreditCard} 
          color="bg-[#F59E0B]" 
        />
        <FinanceCard 
          label="Projected Finish" 
          value="$238k" 
          trend="On track" 
          icon={TrendingUp} 
          color="bg-[#8B5CF6]" 
        />
      </div>

      {/* Burn Rate Chart & Budget Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-[#E2E8F0] rounded-3xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
               <h3 className="text-lg font-black text-[#0F172A] tracking-tight uppercase">Budget Utilization</h3>
               <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest mt-1">Resource burn vs. timeline progress</p>
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[10px] font-black text-[#475569] uppercase tracking-widest hover:bg-[#F1F5F9] transition-all">
              <Download className="w-3.5 h-3.5" />
              Detailed Report
            </button>
          </div>

          <div className="space-y-6">
             <div className="flex justify-between items-end">
                <div>
                   <p className="text-[10px] font-black text-[#94A3B8] uppercase tracking-[0.2em]">Current Burn Rate</p>
                   <p className="text-4xl font-black text-[#0F172A] mt-1">58.0<span className="text-xl">%</span></p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-[#94A3B8] uppercase tracking-[0.2em]">Remaining Runway</p>
                   <p className="text-lg font-black text-[#0F172A]">$105,000</p>
                </div>
             </div>

             <div className="relative h-4 w-full bg-[#F1F5F9] rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="absolute h-full bg-[#10B981] rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                />
             </div>

             <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#F1F5F9]">
                <MiniMetric label="Resource Cost" value="$84k" color="bg-[#3B82F6]" />
                <MiniMetric label="Infra Spend" value="$28k" color="bg-[#8B5CF6]" />
                <MiniMetric label="Contingency" value="$12k" color="bg-[#F59E0B]" />
             </div>
          </div>
        </div>

        <div className="bg-[#111827] rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 w-32 h-32 bg-[#10B981]/10 rounded-full -mr-16 -mt-16 blur-3xl" />
           <div className="relative z-10">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#94A3B8] mb-6">Financial Status</h4>
              <div className="space-y-6">
                 <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                       <ShieldCheck className="w-5 h-5 text-[#10B981]" />
                    </div>
                    <div>
                       <p className="text-sm font-bold">Compliant Audit</p>
                       <p className="text-[10px] text-[#94A3B8]">Passed on May 01, 2026</p>
                    </div>
                 </div>
                 <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] mb-2">Internal Margin</p>
                    <div className="flex items-center gap-3">
                       <div className="text-2xl font-black text-[#10B981]">24.5%</div>
                       <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981] text-[9px] font-bold uppercase">
                          <ArrowUpRight className="w-3 h-3" />
                          Optimal
                       </div>
                    </div>
                 </div>
                 <button className="w-full py-4 bg-white text-[#0F172A] rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#F1F5F9] transition-all">
                    Generate Fiscal Audit
                 </button>
              </div>
           </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-3xl overflow-hidden shadow-sm">
        <div className="px-8 py-6 border-b border-[#F1F5F9] flex items-center justify-between">
           <h3 className="text-sm font-black text-[#0F172A] uppercase tracking-widest">Transaction Ledger</h3>
           <div className="flex items-center gap-4">
              <span className="text-[11px] font-bold text-[#94A3B8] uppercase">Show: All Activities</span>
              <div className="w-px h-4 bg-[#E2E8F0]" />
              <button className="text-[#94A3B8] hover:text-[#0F172A] transition-colors"><Download className="w-4 h-4" /></button>
           </div>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#F1F5F9] text-[10px] font-black text-[#94A3B8] uppercase tracking-[0.15em]">
              <th className="px-8 py-4">Transaction ID</th>
              <th className="px-8 py-4">Description</th>
              <th className="px-8 py-4">Amount</th>
              <th className="px-8 py-4">Execution Date</th>
              <th className="px-8 py-4">Settlement</th>
              <th className="px-8 py-4 text-right">Reference</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {MOCK_TRANSACTIONS.map((tx) => (
              <tr key={tx.id} className="hover:bg-[#F8FAFC] transition-colors">
                <td className="px-8 py-5">
                   <span className="text-[11px] font-mono font-bold text-[#64748B] bg-[#F1F5F9] px-2 py-1 rounded">
                      {tx.id}
                   </span>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center",
                      tx.type === "Invoice" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                    )}>
                      {tx.type === "Invoice" ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    </div>
                    <span className="text-sm font-bold text-[#0F172A]">{tx.label}</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className="text-sm font-black text-[#0F172A]">${tx.amount.toLocaleString()}</span>
                </td>
                <td className="px-8 py-5 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                  {tx.date}
                </td>
                <td className="px-8 py-5">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                    tx.status === "Paid" && "bg-emerald-50 text-emerald-600 border-emerald-100",
                    tx.status === "Pending" && "bg-amber-50 text-amber-600 border-amber-100",
                    tx.status === "Overdue" && "bg-red-50 text-red-600 border-red-100",
                  )}>
                    {tx.status}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                   <button className="text-[#94A3B8] hover:text-[#3B82F6] transition-colors">
                      <ExternalLink className="w-4 h-4" />
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FinanceCard({ label, value, trend, icon: Icon, color }: { label: string; value: string; trend: string; icon: any; color: string }) {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm group hover:border-[#10B981]/20 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg", color)}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex items-center gap-1 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">
           {trend}
        </div>
      </div>
      <p className="text-[10px] font-black text-[#94A3B8] uppercase tracking-[0.2em] mb-1">{label}</p>
      <p className="text-3xl font-black text-[#0F172A]">{value}</p>
    </div>
  );
}

function MiniMetric({ label, value, color }: { label: string; value: string; color: string }) {
   return (
      <div className="flex items-center gap-3">
         <div className={cn("w-1.5 h-1.5 rounded-full", color)} />
         <div>
            <p className="text-[9px] font-black text-[#94A3B8] uppercase tracking-widest leading-none">{label}</p>
            <p className="text-sm font-bold text-[#0F172A] mt-1">{value}</p>
         </div>
      </div>
   );
}

function ShieldCheck({ className }: { className?: string }) {
   return (
     <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
       <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
       <path d="m9 12 2 2 4-4" />
     </svg>
   );
}
