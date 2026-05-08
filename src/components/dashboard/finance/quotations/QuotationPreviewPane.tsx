"use client";

import { QuotationFormData } from "@/types/quotation";
import { calculateTotals } from "@/lib/finance/taxCalculator";
import { motion, AnimatePresence } from "framer-motion";

export function QuotationPreviewPane({ data }: { data: QuotationFormData }) {
  // Reuse totals logic - note: we might need to adjust for discount
  const { subtotal } = calculateTotals(data.lineItems as any);
  const discountAmount = data.discountType === "percentage" ? (subtotal * (data.discount || 0)) / 100 : (data.discount || 0);
  const total = subtotal - discountAmount;

  return (
    <div className="flex-1 bg-[#0F0F0F] p-12 overflow-y-auto flex justify-center">
      <motion.div 
        layout
        className="w-full max-w-[800px] bg-white rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-12 text-[#1A1A1A] min-h-[1000px] flex flex-col"
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-16">
          <div className="space-y-4">
            <h1 className="text-5xl font-black tracking-tighter text-[#050505] leading-none">QUANTUM<br/>BLAZE</h1>
            <p className="text-[12px] font-bold text-[#8A8A8A] uppercase tracking-widest">Systems Engineering Div.</p>
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-black text-[#00E5FF] tracking-tighter uppercase mb-2">QUOTATION</h2>
            <div className="space-y-1 text-[11px] font-bold text-[#8A8A8A]">
              <p>ID: {data.quotationId}</p>
              <p>DATE: 2024-05-15</p>
              <p className="text-[#050505]">VALID UNTIL: {data.validityDate || "2024-06-15"}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12 mb-16 border-t border-b border-[#050505] py-8">
           <div className="space-y-4">
              <p className="text-[10px] font-black text-[#8A8A8A] uppercase tracking-widest">PREPARED FOR</p>
              <div>
                <p className="text-xl font-black text-[#050505]">Nexus Corp</p>
                <p className="text-[13px] text-[#3A3A3A] mt-1">Attn: Operations Director</p>
                <p className="text-[13px] text-[#8A8A8A] mt-2 leading-relaxed">Level 42, Sector 7<br/>Neo-Angeles Metro</p>
              </div>
           </div>
           <div className="space-y-4">
              <p className="text-[10px] font-black text-[#8A8A8A] uppercase tracking-widest">PREPARED BY</p>
              <div>
                <p className="text-xl font-black text-[#050505]">Executive Terminal</p>
                <p className="text-[13px] text-[#3A3A3A] mt-1">Quantum Blaze ERP</p>
                <p className="text-[13px] text-[#8A8A8A] mt-2">auth@quantumblaze.sys</p>
              </div>
           </div>
        </div>

        {/* Scope */}
        <div className="mb-12">
          <p className="text-[10px] font-black text-[#8A8A8A] uppercase tracking-widest mb-4">SCOPE OF OPERATIONS</p>
          <p className="text-[14px] text-[#3A3A3A] leading-relaxed whitespace-pre-wrap">
            {data.scopeOfWork || "Initial deployment and architectural design for Nexus Corp core processing units. This includes load balancing configurations and security protocol integration across all active nodes."}
          </p>
        </div>

        {/* Table */}
        <div className="mb-12">
          <table className="w-full">
            <thead>
              <tr className="bg-[#050505] text-white">
                <th className="text-left py-3 px-4 text-[10px] font-black uppercase tracking-widest">Description</th>
                <th className="text-center py-3 px-4 text-[10px] font-black uppercase tracking-widest">Hrs/Qty</th>
                <th className="text-right py-3 px-4 text-[10px] font-black uppercase tracking-widest">Rate</th>
                <th className="text-right py-3 px-4 text-[10px] font-black uppercase tracking-widest">Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.lineItems.map((item, index) => (
                <tr key={index} className="border-b border-[#E5E7EB]">
                  <td className="py-5 px-4 text-[14px] text-[#050505] font-bold">{item.description || "—"}</td>
                  <td className="py-5 px-4 text-[14px] text-center text-[#3A3A3A]">{item.hours || item.qty}</td>
                  <td className="py-5 px-4 text-[14px] text-right text-[#3A3A3A]">{item.rate.toLocaleString()}</td>
                  <td className="py-5 px-4 text-[14px] text-right font-black text-[#050505]">
                    {((item.hours || item.qty) * item.rate).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex flex-col items-end gap-2 mb-16">
          <div className="flex justify-between w-64 text-[13px]">
            <span className="text-[#8A8A8A] font-bold">Subtotal</span>
            <span className="font-bold text-[#050505]">{subtotal.toLocaleString()}</span>
          </div>
          
          <AnimatePresence>
            {data.discount > 0 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex justify-between w-64 text-[13px]"
              >
                <span className="text-[#8A8A8A] font-bold">Discount ({data.discount}%)</span>
                <span className="font-bold text-danger">-{discountAmount.toLocaleString()}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between w-64 text-2xl font-black text-[#050505] pt-4 border-t-2 border-[#050505] mt-2">
            <span className="uppercase tracking-tighter">TOTAL (Cr)</span>
            <span>{total.toLocaleString()}</span>
          </div>
        </div>

        {/* Milestones */}
        {data.useMilestones && data.milestones.length > 0 && (
          <div className="mt-8 border-t border-[#E5E7EB] pt-12">
            <p className="text-[10px] font-black text-[#8A8A8A] uppercase tracking-widest mb-6">PROPOSED MILESTONES</p>
            <div className="grid grid-cols-1 gap-4">
               {data.milestones.map((ms, i) => (
                 <div key={i} className="flex justify-between items-center p-4 bg-[#F9FAFB] rounded border-l-4 border-[#00E5FF]">
                    <span className="text-[14px] font-bold text-[#050505]">{ms.description || `Milestone ${i+1}`}</span>
                    <div className="flex items-center gap-8">
                       <span className="text-[13px] text-[#8A8A8A] font-bold">{ms.percentage}%</span>
                       <span className="text-[14px] font-black text-[#050505]">{(total * ms.percentage / 100).toLocaleString()}</span>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
