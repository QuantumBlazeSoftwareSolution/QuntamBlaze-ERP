"use client";

import { Receipt, Download, FileText, ArrowUpRight } from "lucide-react";
import { ClientDetail } from "@/types/client";
import { IDChip } from "@/components/ui/IDChip";
import { InvoiceStatusChip } from "@/components/ui/InvoiceStatusChip";
import { format } from "date-fns";

export function FinanceTab({ client }: { client: ClientDetail }) {
  return (
    <div className="space-y-10">
      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-bg-card border border-border rounded-2xl p-6 space-y-4">
          <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest">
            Total Billed
          </p>
          <p className="text-3xl font-bold text-text-primary tracking-tight">
            ${client.totalBilled.toLocaleString()}
          </p>
        </div>
        <div className="bg-bg-card border border-border rounded-2xl p-6 space-y-4">
          <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest">
            Total Paid
          </p>
          <p className="text-3xl font-bold text-success tracking-tight">
            ${(client.totalBilled - client.outstandingBalance).toLocaleString()}
          </p>
        </div>
        <div className="bg-bg-card border border-border rounded-2xl p-6 space-y-4">
          <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest">
            Outstanding
          </p>
          <p className="text-3xl font-bold text-danger tracking-tight">
            ${client.outstandingBalance.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Invoice History */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Receipt className="w-5 h-5 text-accent" />
          <h2 className="text-[11px] font-bold text-text-secondary uppercase tracking-[0.2em]">
            Invoice History
          </h2>
        </div>

        <div className="bg-bg-card border border-border rounded-2xl overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-bg-surface/50 border-b border-border">
                <th className="text-left px-6 py-4 text-[11px] font-bold text-text-muted uppercase tracking-widest">
                  Invoice ID
                </th>
                <th className="text-left px-6 py-4 text-[11px] font-bold text-text-muted uppercase tracking-widest">
                  Issue Date
                </th>
                <th className="text-left px-6 py-4 text-[11px] font-bold text-text-muted uppercase tracking-widest">
                  Due Date
                </th>
                <th className="text-left px-6 py-4 text-[11px] font-bold text-text-muted uppercase tracking-widest">
                  Amount
                </th>
                <th className="text-left px-6 py-4 text-[11px] font-bold text-text-muted uppercase tracking-widest">
                  Status
                </th>
                <th className="text-right px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {client.invoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="border-b border-border/50 hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="px-6 py-5">
                    <IDChip id={invoice.id} className="hover:text-accent transition-colors" />
                  </td>
                  <td className="px-6 py-5 text-[14px] text-text-secondary">
                    {format(new Date(invoice.date), "MMM dd, yyyy")}
                  </td>
                  <td className="px-6 py-5 text-[14px] text-text-secondary">
                    {format(new Date(invoice.dueDate), "MMM dd, yyyy")}
                  </td>
                  <td className="px-6 py-5 text-[15px] font-bold text-text-primary">
                    ${invoice.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-5">
                    <InvoiceStatusChip status={invoice.status} />
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-2 text-text-muted hover:text-accent transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
