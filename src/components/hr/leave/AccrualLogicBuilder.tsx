"use client";

import React from 'react';
import { 
  Zap, 
  ArrowRight, 
  Plus, 
  Minus,
  Settings,
  Calendar,
  Lock,
  Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function AccrualLogicBuilder() {
  return (
    <div className="bg-[#0F172A] rounded-3xl p-8 text-white h-full flex flex-col shadow-xl">
      <div className="flex items-center justify-between mb-10">
        <div>
           <h3 className="text-white font-bold flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#10B981]" />
              Accrual Logic Builder
           </h3>
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Automated Entitlement Sequencing</p>
        </div>
        <button className="text-[10px] font-black text-slate-400 hover:text-white uppercase tracking-widest">
           Advanced JSON
        </button>
      </div>

      <div className="flex-1 space-y-8">
         <section className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-4 mb-6">
               <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <Calendar className="w-4 h-4" />
               </div>
               <div>
                  <h4 className="text-xs font-black uppercase tracking-widest">Frequency Settings</h4>
                  <p className="text-[10px] text-slate-400">When should days be granted?</p>
               </div>
            </div>
            
            <div className="flex gap-2">
               {['Monthly', 'Quarterly', 'Yearly'].map((f) => (
                 <button 
                   key={f}
                   className={cn(
                     "flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                     f === 'Monthly' ? "bg-blue-600 border-blue-500 text-white" : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                   )}
                 >
                    {f}
                 </button>
               ))}
            </div>
         </section>

         <section className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-[#10B981]/20 flex items-center justify-center text-[#10B981]">
                     <Layers className="w-4 h-4" />
                  </div>
                  <div>
                     <h4 className="text-xs font-black uppercase tracking-widest">Proration Logic</h4>
                     <p className="text-[10px] text-slate-400">Mid-cycle adjustment rules</p>
                  </div>
               </div>
               <div className="w-10 h-5 bg-[#10B981] rounded-full relative">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm" />
               </div>
            </div>

            <div className="space-y-4">
               <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-[11px] font-medium text-slate-300">Grant Method</span>
                  <span className="text-[11px] font-black uppercase tracking-widest text-blue-400">Pro-Rata Basis</span>
               </div>
               <div className="flex items-center justify-between py-2">
                  <span className="text-[11px] font-medium text-slate-300">Minimum Service</span>
                  <span className="text-[11px] font-black uppercase tracking-widest text-blue-400">03 Months</span>
               </div>
            </div>
         </section>

         <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex gap-4">
            <Lock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[10px] text-amber-200/70 leading-relaxed font-medium">
               Logic changes will be effective from the next accrual cycle (JUN-24). Existing balances will not be recalculated unless "Force Re-Sync" is triggered.
            </p>
         </div>
      </div>

      <button className="w-full mt-10 py-3 rounded-2xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20">
         Deploy Logic Sequence
      </button>
    </div>
  );
}
