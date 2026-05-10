"use client";

import React from 'react';
import { 
  Settings, 
  Clock, 
  ShieldCheck, 
  Zap, 
  Save,
  Bell,
  MinusCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function ShiftRuleConfig() {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-3xl p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
           <h3 className="text-[#0F172A] font-bold">Shift & Overtime Rules</h3>
           <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-widest mt-1">Global Configuration for Workforce Logs</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:scale-[1.02] transition-all">
           <Save className="w-3.5 h-3.5" />
           Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
         <div className="space-y-8">
            <section>
               <div className="flex items-center gap-2 mb-6">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <h4 className="text-xs font-black text-[#0F172A] uppercase tracking-widest">Time & Grace Periods</h4>
               </div>
               <div className="space-y-4">
                  <RuleInput label="Morning Shift Start" value="09:00 AM" />
                  <RuleInput label="Grace Period (Late)" value="15 Minutes" />
                  <RuleInput label="Minimum Shift Duration" value="04 Hours" />
               </div>
            </section>

            <section>
               <div className="flex items-center gap-2 mb-6">
                  <Zap className="w-4 h-4 text-[#10B981]" />
                  <h4 className="text-xs font-black text-[#0F172A] uppercase tracking-widest">Automation</h4>
               </div>
               <div className="space-y-4">
                  <ToggleRule label="Auto-Clock-Out at Shift End" active />
                  <ToggleRule label="Notify on Shift Overlap" active />
                  <ToggleRule label="Strict IP-based Clock-in" />
               </div>
            </section>
         </div>

         <div className="space-y-8">
            <section>
               <div className="flex items-center gap-2 mb-6">
                  <ShieldCheck className="w-4 h-4 text-violet-500" />
                  <h4 className="text-xs font-black text-[#0F172A] uppercase tracking-widest">Overtime Logic</h4>
               </div>
               <div className="bg-[#F8FAFC] border border-[#F1F5F9] rounded-2xl p-6 space-y-6">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-xs font-bold text-[#0F172A]">Weekly OT Threshold</p>
                        <p className="text-[10px] text-[#94A3B8] font-medium">Hours before OT multiplier applies</p>
                     </div>
                     <span className="text-sm font-black text-blue-600">45.0 Hrs</span>
                  </div>
                  <div className="h-px bg-white" />
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-xs font-bold text-[#0F172A]">OT Pay Multiplier</p>
                        <p className="text-[10px] text-[#94A3B8] font-medium">Standard rate increase</p>
                     </div>
                     <span className="text-sm font-black text-[#10B981]">1.5x</span>
                  </div>
               </div>
            </section>

            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-100 flex gap-4">
               <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-amber-600 shrink-0 shadow-sm">
                  <Bell className="w-5 h-5" />
               </div>
               <div>
                  <h5 className="text-[11px] font-black text-amber-900 uppercase tracking-widest mb-1">Compliance Warning</h5>
                  <p className="text-[10px] text-amber-800 leading-relaxed font-medium">
                     Changes to shift rules will be audited and logged under SHF-CONF-2024. All affected employees will be notified of the update via the portal.
                  </p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

function RuleInput({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl border border-[#F1F5F9] bg-white group hover:border-blue-200 transition-all cursor-pointer">
       <span className="text-xs font-bold text-[#64748B] group-hover:text-[#0F172A] transition-colors">{label}</span>
       <span className="text-xs font-black text-[#475569]">{value}</span>
    </div>
  );
}

function ToggleRule({ label, active }: { label: string, active?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2">
       <span className="text-xs font-medium text-[#475569]">{label}</span>
       <button className={cn(
         "w-10 h-5 rounded-full relative transition-all",
         active ? "bg-[#10B981]" : "bg-[#CBD5E1]"
       )}>
          <div className={cn(
            "absolute top-1 w-3 h-3 rounded-full bg-white transition-all",
            active ? "right-1" : "left-1"
          )} />
       </button>
    </div>
  );
}
