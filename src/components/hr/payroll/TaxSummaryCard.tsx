"use client";

import React from "react";
import {
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  FileText,
  Lock,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function TaxSummaryCard() {
  return (
    <div className="bg-[#0F172A] rounded-3xl p-8 text-white h-full flex flex-col shadow-xl">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h3 className="text-white font-bold flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#10B981]" />
            Tax & Statutory (YTD)
          </h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
            Fiscal Year 2024 Summary
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-6">
        <TaxItem
          label="EPF Employee Share"
          value="84,200.00"
          sub="8% Basic"
          color="text-blue-400"
        />
        <TaxItem
          label="EPF Employer Share"
          value="126,300.00"
          sub="12% Basic"
          color="text-violet-400"
        />
        <TaxItem
          label="ETF Contribution"
          value="31,575.00"
          sub="3% Basic"
          color="text-emerald-400"
        />
        <TaxItem
          label="PAYE Tax Deducted"
          value="58,000.00"
          sub="Cumulative"
          color="text-amber-400"
        />
      </div>

      <div className="mt-10 p-5 rounded-2xl bg-white/5 border border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <Lock className="w-4 h-4 text-slate-500" />
          <h5 className="text-[10px] font-black uppercase tracking-widest">Compliance Status</h5>
        </div>
        <p className="text-[10px] text-slate-400 leading-relaxed font-medium mb-4">
          All statutory payments for Q1 & Q2 have been remitted to the Central Bank of Sri Lanka.
        </p>
        <button className="w-full py-2.5 rounded-xl bg-white/10 text-[9px] font-black uppercase tracking-widest hover:bg-white/20 transition-all flex items-center justify-center gap-2">
          Download T-10 Form
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function TaxItem({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          {label}
        </span>
        <span className={cn("text-xs font-black", color)}>{value}</span>
      </div>
      <p className="text-[9px] font-bold text-slate-600">{sub}</p>
    </div>
  );
}
