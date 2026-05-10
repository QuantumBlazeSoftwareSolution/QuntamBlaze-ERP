"use client";

import React from 'react';
import { 
  Play, 
  RefreshCw, 
  FileCheck, 
  AlertTriangle, 
  Users, 
  CreditCard,
  ChevronRight,
  ShieldCheck,
  Search,
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { IDChip } from '@/components/ui/IDChip';

const MOCK_ITEMS = [
  { id: 'EMP-ENG-26-001', name: 'James Wilson', structure: 'ENG-LEAD', basic: '250,000', allowances: '85,000', lop: '0', net: '315,500' },
  { id: 'EMP-ENG-26-002', name: 'Sarah Jenkins', structure: 'SNR-ENG', basic: '180,000', allowances: '62,000', lop: '12,000', net: '212,200' },
  { id: 'EMP-FIN-26-005', name: 'Elena Vance', structure: 'FIN-EXEC', basic: '95,000', allowances: '25,000', lop: '0', net: '112,000' },
];

export function PayrollBatchProcessor() {
  const [isProcessing, setIsProcessing] = React.useState(false);

  const startRun = () => {
    setIsProcessing(true);
    setTimeout(() => setIsProcessing(false), 2000);
  };

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-3xl p-8 shadow-sm h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
           <div className="flex items-center gap-2 mb-1">
              <h3 className="text-[#0F172A] font-bold">Payroll Batch Processor</h3>
              <IDChip id="PAY-RUN-202405" size="xs" />
           </div>
           <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-widest">Calculations for May 2024 Cycle</p>
        </div>
        <div className="flex items-center gap-3">
           <button 
             onClick={startRun}
             disabled={isProcessing}
             className={cn(
               "flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-[10px] font-black uppercase tracking-widest shadow-lg transition-all",
               isProcessing ? "bg-[#CBD5E1] cursor-not-allowed" : "bg-blue-600 shadow-blue-600/20 hover:scale-[1.02]"
             )}
           >
              {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              {isProcessing ? "Recalculating..." : "Initiate Payroll Run"}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
         <StatusCard icon={<Users className="w-4 h-4" />} label="Staff Included" value="42 / 42" color="text-blue-600" />
         <StatusCard icon={<AlertTriangle className="w-4 h-4 text-amber-500" />} label="Missing Data" value="0" color="text-[#0F172A]" />
         <StatusCard icon={<FileCheck className="w-4 h-4 text-[#10B981]" />} label="Statutory Validated" value="Yes" color="text-[#10B981]" />
         <StatusCard icon={<CreditCard className="w-4 h-4 text-violet-500" />} label="Estimated Outflow" value="4.25M" sub="LKR" color="text-[#0F172A]" />
      </div>

      <div className="flex-1 overflow-auto scrollbar-hide border border-[#F1F5F9] rounded-2xl bg-[#F8FAFC]">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="border-b border-[#F1F5F9] bg-white">
                  <th className="px-6 py-4 text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">Employee</th>
                  <th className="px-6 py-4 text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">Structure</th>
                  <th className="px-6 py-4 text-[10px] font-black text-[#94A3B8] uppercase tracking-widest text-right">Basic</th>
                  <th className="px-6 py-4 text-[10px] font-black text-[#94A3B8] uppercase tracking-widest text-right">Allowances</th>
                  <th className="px-6 py-4 text-[10px] font-black text-red-400 uppercase tracking-widest text-right">LOP (Unpaid)</th>
                  <th className="px-6 py-4 text-[10px] font-black text-[#0F172A] uppercase tracking-widest text-right">Net Payable</th>
               </tr>
            </thead>
            <tbody>
               {MOCK_ITEMS.map((item) => (
                 <tr key={item.id} className="border-b border-[#F1F5F9] hover:bg-white transition-colors group">
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-[10px]">
                             {item.name[0]}
                          </div>
                          <div>
                             <p className="text-xs font-bold text-[#0F172A]">{item.name}</p>
                             <p className="text-[9px] text-[#94A3B8]">{item.id}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-[#64748B]">{item.structure}</td>
                    <td className="px-6 py-4 text-xs font-bold text-[#475569] text-right">{item.basic}</td>
                    <td className="px-6 py-4 text-xs font-bold text-[#10B981] text-right">+{item.allowances}</td>
                    <td className="px-6 py-4 text-xs font-bold text-red-500 text-right">-{item.lop}</td>
                    <td className="px-6 py-4 text-xs font-black text-[#0F172A] text-right">{item.net}</td>
                 </tr>
               ))}
            </tbody>
         </table>
      </div>

      <div className="mt-8 flex items-center justify-between p-6 rounded-2xl bg-blue-50 border border-blue-100">
         <div className="flex items-center gap-4">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
            <div>
               <p className="text-xs font-black text-blue-900 uppercase">Verification Passed</p>
               <p className="text-[10px] text-blue-700 font-medium">All attendance records (ATT-ID) have been cross-checked for the current cycle.</p>
            </div>
         </div>
         <button className="px-6 py-2.5 rounded-xl bg-[#0F172A] text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#0F172A]/20 hover:scale-[1.02] transition-all flex items-center gap-2">
            Proceed to Disbursement
            <ChevronRight className="w-4 h-4" />
         </button>
      </div>
    </div>
  );
}

function StatusCard({ icon, label, value, sub, color }: { icon: React.ReactNode, label: string, value: string, sub?: string, color: string }) {
  return (
    <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#F1F5F9]">
       <div className="flex items-center gap-2 mb-3 text-[#94A3B8]">
          {icon}
          <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
       </div>
       <div className="flex items-baseline gap-1">
          <span className={cn("text-lg font-black", color)}>{value}</span>
          {sub && <span className="text-[10px] font-bold text-[#94A3B8]">{sub}</span>}
       </div>
    </div>
  );
}
