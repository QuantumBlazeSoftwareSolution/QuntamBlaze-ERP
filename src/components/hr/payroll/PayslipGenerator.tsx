"use client";

import React from 'react';
import { 
  Printer, 
  Download, 
  Share2, 
  ShieldCheck, 
  Calendar,
  Building,
  CreditCard,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { IDChip } from '@/components/ui/IDChip';

export function PayslipGenerator() {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-3xl p-10 shadow-sm flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-10 border-b border-[#F1F5F9] pb-6">
         <div>
            <h3 className="text-[#0F172A] font-black text-xl flex items-center gap-2">
               <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-sm rotate-45" />
               </div>
               Quantum Blaze
            </h3>
            <p className="text-[10px] text-[#94A3B8] font-black uppercase tracking-[0.2em] mt-1 ml-10">Operations Control ERP</p>
         </div>
         <div className="flex gap-3 no-print">
            <button className="p-2.5 rounded-xl border border-[#F1F5F9] text-[#64748B] hover:bg-[#F8FAFC] transition-all">
               <Printer className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:scale-[1.02] transition-all">
               <Download className="w-4 h-4" />
               Download PDF
            </button>
         </div>
      </div>

      <div className="w-full max-w-4xl border border-[#F1F5F9] rounded-3xl p-10 bg-[#F8FAFC] print:border-none print:bg-white print:p-0">
         <div className="flex flex-col md:flex-row justify-between gap-10 mb-10">
            <div className="space-y-4">
               <div>
                  <p className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest mb-1">Employee Details</p>
                  <h4 className="text-base font-black text-[#0F172A]">James Wilson</h4>
                  <p className="text-xs font-bold text-[#64748B]">Engineering Lead • EMP-ENG-26-001</p>
               </div>
               <div>
                  <p className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest mb-1">Payment Method</p>
                  <p className="text-xs font-black text-[#0F172A]">HNB Bank • **** 0492</p>
               </div>
            </div>
            <div className="text-right space-y-4">
               <div>
                  <p className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest mb-1">Payslip Period</p>
                  <h4 className="text-base font-black text-[#0F172A]">May 2024 Cycle</h4>
                  <p className="text-xs font-bold text-[#64748B]">Run ID: PAY-RUN-202405</p>
               </div>
               <IDChip id="LEV-VERIFIED-MAY24" size="xs" />
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
            <section className="space-y-4">
               <h5 className="text-[10px] font-black text-blue-600 uppercase tracking-widest border-b border-blue-100 pb-2">Earnings & Allowances</h5>
               <ItemRow label="Basic Salary" value="250,000.00" />
               <ItemRow label="Transport Allowance" value="45,000.00" />
               <ItemRow label="Housing Allowance" value="30,000.00" />
               <ItemRow label="Meal Allowance" value="10,000.00" />
               <div className="pt-2 border-t border-dashed border-[#CBD5E1] flex justify-between">
                  <span className="text-xs font-black text-[#0F172A]">Total Gross Pay</span>
                  <span className="text-xs font-black text-[#0F172A]">335,000.00</span>
               </div>
            </section>

            <section className="space-y-4">
               <h5 className="text-[10px] font-black text-red-500 uppercase tracking-widest border-b border-red-100 pb-2">Deductions & Statutory</h5>
               <ItemRow label="EPF Employee (8%)" value="20,000.00" isRed />
               <ItemRow label="PAYE Tax (Estimated)" value="12,500.00" isRed />
               <ItemRow label="Unpaid Leave Adjustment" value="0.00" isRed />
               <div className="pt-2 border-t border-dashed border-[#CBD5E1] flex justify-between">
                  <span className="text-xs font-black text-red-500">Total Deductions</span>
                  <span className="text-xs font-black text-red-500">32,500.00</span>
               </div>
            </section>
         </div>

         <div className="bg-[#0F172A] rounded-2xl p-6 flex items-center justify-between text-white shadow-xl shadow-[#0F172A]/10">
            <div>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Net Payable Amount</p>
               <h2 className="text-3xl font-black tracking-tighter">LKR 302,500.00</h2>
            </div>
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
               <CreditCard className="w-6 h-6 text-blue-400" />
            </div>
         </div>

         <div className="mt-10 pt-10 border-t border-[#CBD5E1] flex items-center justify-between">
            <div className="flex items-center gap-3">
               <ShieldCheck className="w-8 h-8 text-emerald-500" />
               <div>
                  <p className="text-[10px] font-black text-[#0F172A] uppercase">Digital Verification</p>
                  <p className="text-[9px] font-bold text-[#94A3B8]">Generated by QB-ERP Finance Module on 2024-05-30</p>
               </div>
            </div>
            <div className="w-24 h-24 bg-white border border-[#F1F5F9] rounded-xl flex items-center justify-center">
               <div className="text-[8px] font-bold text-[#CBD5E1] text-center px-4">QR Verification Placeholder</div>
            </div>
         </div>
      </div>
    </div>
  );
}

function ItemRow({ label, value, isRed }: { label: string, value: string, isRed?: boolean }) {
  return (
    <div className="flex justify-between items-center py-1">
       <span className="text-xs font-medium text-[#64748B]">{label}</span>
       <span className={cn("text-xs font-bold", isRed ? "text-red-500" : "text-[#0F172A]")}>
          {isRed && "-"}{value}
       </span>
    </div>
  );
}
