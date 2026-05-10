"use client";

import { InvoiceFormData } from "@/types/invoice";
import { calculateTotals } from "@/lib/finance/taxCalculator";
import { motion } from "framer-motion";
import { format } from "date-fns";

export function InvoicePreviewPane({ data }: { data: InvoiceFormData }) {
  const { subtotal, totalTax, totalDue, taxGroups } = calculateTotals(data.lineItems);

  return (
    <div className="flex-1 bg-[#0F0F0F] p-12 overflow-y-auto flex justify-center">
      <motion.div
        layout
        className="w-full max-w-[800px] bg-white rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-12 text-[#1A1A1A] min-h-[1000px] flex flex-col"
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-16">
          <div className="space-y-4">
            <h1 className="text-5xl font-black tracking-tighter text-[#050505]">INVOICE</h1>
            <p className="text-[14px] font-mono text-[#8A8A8A] font-bold">{data.invoiceId}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-[#00E5FF]">Quantum Blaze</p>
            <p className="text-[12px] text-[#8A8A8A] mt-2">1010 Nexus Way, Sector 4</p>
            <p className="text-[12px] text-[#8A8A8A]">Aethelgard Prime</p>
          </div>
        </div>

        <div className="flex justify-between mb-16">
          <div className="space-y-6">
            <div>
              <p className="text-[11px] font-black text-[#8A8A8A] uppercase tracking-widest mb-2">
                Billed To
              </p>
              <p className="text-xl font-bold text-[#050505]">{data.clientName || "—"}</p>
              <p className="text-[13px] text-[#3A3A3A] font-mono mt-1">{data.clientId}</p>
              <p className="text-[13px] text-[#8A8A8A] max-w-[200px] mt-2 leading-relaxed">
                {data.billingAddress || "—"}
              </p>
            </div>
          </div>
          <div className="text-right space-y-6">
            <div>
              <p className="text-[11px] font-black text-[#8A8A8A] uppercase tracking-widest mb-1">
                Issue Date
              </p>
              <p className="text-[15px] font-bold text-[#050505]">{data.issueDate}</p>
            </div>
            <div>
              <p className="text-[11px] font-black text-[#8A8A8A] uppercase tracking-widest mb-1">
                Due Date
              </p>
              <p className="text-[15px] font-bold text-[#050505]">{data.dueDate}</p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1">
          <table className="w-full border-t border-b border-[#050505] mb-8">
            <thead>
              <tr className="bg-[#F9FAFB]">
                <th className="text-left py-4 px-2 text-[11px] font-black text-[#8A8A8A] uppercase tracking-widest">
                  Description
                </th>
                <th className="text-center py-4 px-2 text-[11px] font-black text-[#8A8A8A] uppercase tracking-widest">
                  Qty
                </th>
                <th className="text-right py-4 px-2 text-[11px] font-black text-[#8A8A8A] uppercase tracking-widest">
                  Rate
                </th>
                <th className="text-center py-4 px-2 text-[11px] font-black text-[#8A8A8A] uppercase tracking-widest">
                  Tax
                </th>
                <th className="text-right py-4 px-2 text-[11px] font-black text-[#8A8A8A] uppercase tracking-widest">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {data.lineItems.map((item, index) => (
                <tr key={index} className="border-b border-[#E5E7EB]">
                  <td className="py-5 px-2 text-[14px] text-[#050505] font-medium">
                    {item.description || "—"}
                  </td>
                  <td className="py-5 px-2 text-[14px] text-center text-[#3A3A3A]">{item.qty}</td>
                  <td className="py-5 px-2 text-[14px] text-right text-[#3A3A3A]">
                    {item.rate.toLocaleString()}
                  </td>
                  <td className="py-5 px-2 text-[14px] text-center text-[#8A8A8A]">
                    {item.taxPercent}%
                  </td>
                  <td className="py-5 px-2 text-[14px] text-right font-bold text-[#050505]">
                    {(item.qty * item.rate).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex flex-col items-end gap-3 mb-16">
          <div className="flex justify-between w-64 text-[14px]">
            <span className="text-[#8A8A8A]">Subtotal</span>
            <span className="font-bold text-[#050505]">{subtotal.toLocaleString()}</span>
          </div>
          {Object.values(taxGroups).map((group) => (
            <div key={group.rate} className="flex justify-between w-64 text-[14px]">
              <span className="text-[#8A8A8A]">VAT ({group.rate}%)</span>
              <span className="font-bold text-[#050505]">{group.taxAmount.toLocaleString()}</span>
            </div>
          ))}
          <div className="flex justify-between w-64 text-2xl font-black text-[#050505] pt-6 border-t-2 border-[#050505] mt-2">
            <span>Total Due</span>
            <span>{totalDue.toLocaleString()}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-12 border-t border-[#E5E7EB] grid grid-cols-2 gap-12">
          <div className="space-y-4">
            <p className="text-[11px] font-black text-[#8A8A8A] uppercase tracking-widest">
              Bank Details
            </p>
            <div className="text-[12px] text-[#3A3A3A] space-y-1">
              <p>
                <span className="text-[#8A8A8A]">Bank:</span> Quantum Global Finance
              </p>
              <p>
                <span className="text-[#8A8A8A]">IBAN:</span> AE02 4000 0000 1234 5678 901
              </p>
              <p>
                <span className="text-[#8A8A8A]">SWIFT:</span> QBZAAEAD
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end justify-end">
            <div className="w-48 h-20 border-2 border-dashed border-[#E5E7EB] rounded-lg flex items-center justify-center">
              <span className="text-[10px] font-bold text-[#8A8A8A] uppercase tracking-widest">
                Awaiting Signature
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
