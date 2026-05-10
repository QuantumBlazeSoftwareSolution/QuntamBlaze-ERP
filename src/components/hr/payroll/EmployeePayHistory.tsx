"use client";

import React from 'react';
import { 
  History, 
  TrendingUp, 
  Download, 
  ArrowUpRight,
  Filter,
  Search,
  Eye,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { IDChip } from '@/components/ui/IDChip';

const MOCK_HISTORY = [
  { id: 'PAY-RUN-202405', month: 'May 2024', gross: '335,000', net: '302,500', status: 'Paid', date: '2024-05-30' },
  { id: 'PAY-RUN-202404', month: 'April 2024', gross: '335,000', net: '302,500', status: 'Paid', date: '2024-04-30' },
  { id: 'PAY-RUN-202403', month: 'March 2024', gross: '315,000', net: '284,200', status: 'Paid', date: '2024-03-30' },
  { id: 'PAY-RUN-202402', month: 'February 2024', gross: '315,000', net: '284,200', status: 'Paid', date: '2024-02-29' },
];

export function EmployeePayHistory() {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-3xl p-8 shadow-sm h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
           <h3 className="text-[#0F172A] font-bold">Historical Compensation</h3>
           <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-widest mt-1">Earnings Archive & Tax Summaries</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8]" />
              <input 
                type="text" 
                placeholder="Search run ID..."
                className="pl-9 pr-4 py-2 rounded-xl border border-[#F1F5F9] bg-[#F8FAFC] text-[10px] font-bold w-48 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
              />
           </div>
           <button className="p-2 rounded-xl border border-[#F1F5F9] text-[#64748B] hover:bg-[#F8FAFC]">
              <Filter className="w-3.5 h-3.5" />
           </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto scrollbar-hide">
         <div className="space-y-4">
            {MOCK_HISTORY.map((run) => (
              <div 
                key={run.id} 
                className="p-5 rounded-2xl border border-[#F1F5F9] bg-[#F8FAFC] hover:border-blue-200 transition-all group flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white border border-[#F1F5F9] flex items-center justify-center text-blue-600 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                       <FileText className="w-5 h-5" />
                    </div>
                    <div>
                       <h4 className="text-sm font-black text-[#0F172A]">{run.month}</h4>
                       <IDChip id={run.id} size="xs" />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-8 text-right flex-1 md:max-w-xs">
                    <div>
                       <p className="text-[9px] font-black text-[#94A3B8] uppercase tracking-widest mb-1">Gross Salary</p>
                       <p className="text-xs font-black text-[#475569]">{run.gross} LKR</p>
                    </div>
                    <div>
                       <p className="text-[9px] font-black text-[#94A3B8] uppercase tracking-widest mb-1">Net Pay</p>
                       <p className="text-xs font-black text-[#10B981]">{run.net} LKR</p>
                    </div>
                 </div>

                 <div className="flex items-center gap-3 border-t md:border-t-0 pt-4 md:pt-0 border-white">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#F1F5F9] text-[10px] font-black uppercase tracking-widest text-[#64748B] hover:text-blue-600 hover:border-blue-200 transition-all">
                       <Eye className="w-3.5 h-3.5" />
                       Preview
                    </button>
                    <button className="p-2 rounded-xl bg-[#0F172A] text-white hover:scale-105 transition-all">
                       <Download className="w-3.5 h-3.5" />
                    </button>
                 </div>
              </div>
            ))}
         </div>
      </div>

      <div className="mt-8 p-6 rounded-2xl bg-[#0F172A] text-white flex items-center justify-between shadow-xl">
         <div className="flex items-center gap-4">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Net Paid (YTD)</p>
               <h4 className="text-base font-black">LKR 1,173,400.00</h4>
            </div>
         </div>
         <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all">
            Full Tax Report
            <ArrowUpRight className="w-3.5 h-3.5" />
         </button>
      </div>
    </div>
  );
}
