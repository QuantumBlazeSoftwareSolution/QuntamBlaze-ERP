"use client";

import React from "react";
import {
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Banknote,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function PayrollValidationWall() {
  return (
    <div className="bg-[#0F172A] rounded-3xl p-8 text-white h-full flex flex-col shadow-xl">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h3 className="text-white font-bold flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
            Pre-Processing Validation
          </h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
            Consistency & Data Integrity Check
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-6">
        <ValidationItem
          status="success"
          title="Tax Slab Alignment"
          description="All 42 employees are mapped to the latest IRD tax brackets."
        />
        <ValidationItem
          status="warning"
          title="Missing Bank Details"
          description="02 employees (EMP-FIN-26-008, 009) have incomplete SWIFT codes."
        />
        <ValidationItem
          status="success"
          title="EPF/ETF Registration"
          description="100% workforce registered under the statutory portal."
        />
        <ValidationItem
          status="neutral"
          title="Overtime Anomaly"
          description="Engineering team OT is 15% higher than last month's average."
        />
      </div>

      <div className="mt-10 p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
        <Banknote className="w-8 h-8 text-blue-400" />
        <div className="flex-1">
          <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-300">
            Bank Transfer Ready
          </h5>
          <p className="text-xs font-black text-white">LKR 4,250,000.00</p>
        </div>
        <button className="text-[9px] font-black text-blue-400 uppercase tracking-widest hover:underline">
          Download Batch
        </button>
      </div>
    </div>
  );
}

function ValidationItem({
  status,
  title,
  description,
}: {
  status: "success" | "warning" | "neutral";
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-white/10 transition-all">
      <div
        className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm",
          status === "success"
            ? "bg-[#10B981]/20 text-[#10B981]"
            : status === "warning"
              ? "bg-amber-500/20 text-amber-400"
              : "bg-blue-500/20 text-blue-400"
        )}
      >
        {status === "success" && <CheckCircle2 className="w-4 h-4" />}
        {status === "warning" && <AlertTriangle className="w-4 h-4" />}
        {status === "neutral" && <HelpCircle className="w-4 h-4" />}
      </div>
      <div>
        <h4 className="text-xs font-black uppercase tracking-widest text-white mb-1">{title}</h4>
        <p className="text-[10px] text-slate-400 leading-relaxed font-medium">{description}</p>
      </div>
    </div>
  );
}
