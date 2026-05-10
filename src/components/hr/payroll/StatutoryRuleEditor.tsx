"use client";

import React from "react";
import {
  ShieldCheck,
  Settings,
  ArrowRight,
  Info,
  AlertCircle,
  Save,
  Lock,
  Percent,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function StatutoryRuleEditor() {
  return (
    <div className="bg-[#0F172A] rounded-3xl p-8 text-white h-full flex flex-col shadow-xl">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h3 className="text-white font-bold flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Statutory Rules Engine
          </h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
            Regulatory Compliance — STAT-SL-24
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-600/20 hover:scale-[1.02] transition-all">
          <Save className="w-3.5 h-3.5" />
          Update Rules
        </button>
      </div>

      <div className="flex-1 space-y-8">
        <section>
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">
              EPF Contributions
            </h4>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase">
              Statutory Standard
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">
                Employee Share
              </p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-black text-white">8.00%</span>
                <Percent className="w-4 h-4 text-slate-600" />
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">
                Employer Share
              </p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-black text-white">12.00%</span>
                <Percent className="w-4 h-4 text-slate-600" />
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">
              ETF Contributions
            </h4>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">
              Employer Only Share
            </p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-black text-white">3.00%</span>
              <Percent className="w-4 h-4 text-slate-600" />
            </div>
          </div>
        </section>

        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex gap-4">
          <Lock className="w-5 h-5 text-slate-500 shrink-0" />
          <div>
            <h5 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">
              Audit Locked
            </h5>
            <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
              Rule changes are tracked under Compliance-Log-SL-24. Modification requires secondary
              approval from Finance Lead (FIN-LEAD-001).
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex gap-3">
        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-[10px] text-amber-200/70 font-medium italic">
          Changes will take effect from the next salary cycle. Historical payslips remain locked.
        </p>
      </div>
    </div>
  );
}
