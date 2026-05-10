"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Send,
  Download,
  CheckCircle,
  Calendar,
  MapPin,
  Briefcase,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { Invoice } from "@/types/invoice";
import { IDChip } from "@/components/ui/IDChip";
import { InvoiceStatusChip } from "@/components/ui/InvoiceStatusChip";
import { formatCurrency } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import { motion as m } from "framer-motion";

interface InvoiceDetailSheetProps {
  invoice: Invoice | null;
  onClose: () => void;
}

type TabType = "summary" | "line-items";

export const InvoiceDetailSheet = ({
  invoice,
  onClose,
}: InvoiceDetailSheetProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("summary");

  const total = invoice ? invoice.amount + invoice.tax : 0;
  const isOverdue = invoice?.status === "Overdue";

  return (
    <AnimatePresence>
      {invoice && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-[#0F172A]/80 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Slide-over Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-[520px] bg-white flex flex-col border-l border-divider shadow-2xl"
          >
            {/* Header */}
            <div
              className={cn(
                "px-6 pt-6 pb-4 border-b border-divider shrink-0",
                isOverdue ? "bg-red-50" : "bg-page-bg"
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <IDChip id={invoice.id} />
                  {invoice.receiptId && (
                    <IDChip id={invoice.receiptId} variant="muted" size="xs" />
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-2 -mr-2 text-text-muted hover:text-text-primary hover:bg-divider rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest mb-1">
                    Total Amount
                  </p>
                  <p className="text-3xl font-bold text-text-primary tracking-tight">
                    {formatCurrency(total)}
                  </p>
                  <p className="text-[12px] text-text-muted mt-1">
                    incl. {formatCurrency(invoice.tax)} tax
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <InvoiceStatusChip status={invoice.status} />
                  {isOverdue && (
                    <div className="flex items-center gap-1 text-red-500 text-[11px] font-bold">
                      <AlertTriangle className="w-3 h-3" />
                      Payment Overdue
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex px-6 border-b border-divider bg-white shrink-0">
              {[
                { id: "summary" as TabType, label: "Summary" },
                { id: "line-items" as TabType, label: `Line Items (${invoice.lineItems.length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-4 py-3 text-sm font-semibold transition-all relative",
                    activeTab === tab.id
                      ? "text-text-primary"
                      : "text-text-secondary hover:text-text-primary hover:bg-page-bg"
                  )}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="invoice-sheet-tab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {activeTab === "summary" && (
                <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {/* IDs & References */}
                  <div className="space-y-3">
                    <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                      References
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-page-bg border border-divider">
                        <p className="text-[10px] text-text-muted font-medium mb-1.5">Project ID</p>
                        <IDChip id={invoice.projectId} size="xs" />
                      </div>
                      <div className="p-3 rounded-xl bg-page-bg border border-divider">
                        <p className="text-[10px] text-text-muted font-medium mb-1.5">Client ID</p>
                        <IDChip id={invoice.clientId} size="xs" variant="muted" />
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-divider" />

                  {/* Client Info */}
                  <div className="space-y-3">
                    <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                      Billed To
                    </h3>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-text-primary">{invoice.clientName}</p>
                        <div className="flex items-center gap-1 text-[12px] text-text-muted mt-0.5">
                          <MapPin className="w-3 h-3 shrink-0" />
                          <span className="leading-relaxed">{invoice.billingAddress}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-divider" />

                  {/* Dates */}
                  <div className="space-y-3">
                    <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                      Timeline
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 rounded-xl bg-page-bg border border-divider">
                        <div className="flex items-center gap-1.5 text-text-muted mb-2">
                          <Calendar className="w-3.5 h-3.5" />
                          <p className="text-[10px] font-bold uppercase tracking-wider">Issue Date</p>
                        </div>
                        <p className="text-sm font-bold text-text-primary">{invoice.issueDate}</p>
                      </div>
                      <div
                        className={cn(
                          "p-4 rounded-xl border",
                          isOverdue
                            ? "bg-red-50 border-red-200"
                            : "bg-page-bg border-divider"
                        )}
                      >
                        <div className="flex items-center gap-1.5 text-text-muted mb-2">
                          <Calendar className="w-3.5 h-3.5" />
                          <p className="text-[10px] font-bold uppercase tracking-wider">Due Date</p>
                        </div>
                        <p
                          className={cn(
                            "text-sm font-bold",
                            isOverdue ? "text-red-500" : "text-text-primary"
                          )}
                        >
                          {invoice.dueDate}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-divider" />

                  {/* Financial Breakdown */}
                  <div className="space-y-3">
                    <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                      Financial Breakdown
                    </h3>
                    <div className="rounded-xl border border-divider overflow-hidden">
                      <div className="flex justify-between items-center px-4 py-3 bg-white">
                        <span className="text-[13px] text-text-secondary">Subtotal</span>
                        <span className="text-[13px] font-mono font-medium text-text-primary">
                          {formatCurrency(invoice.amount)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center px-4 py-3 bg-white border-t border-divider">
                        <span className="text-[13px] text-text-secondary">Tax</span>
                        <span className="text-[13px] font-mono font-medium text-text-primary">
                          {formatCurrency(invoice.tax)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center px-4 py-4 bg-page-bg border-t border-divider">
                        <span className="text-sm font-bold text-text-primary">Total</span>
                        <span className="text-lg font-bold font-mono text-accent">
                          {formatCurrency(total)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "line-items" && (
                <div className="p-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {invoice.lineItems.length > 0 ? (
                    <div className="rounded-xl border border-divider overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-page-bg border-b border-divider">
                          <tr>
                            <th className="px-4 py-3 text-left text-[10px] font-bold text-text-muted uppercase tracking-wider">Description</th>
                            <th className="px-4 py-3 text-right text-[10px] font-bold text-text-muted uppercase tracking-wider">Qty</th>
                            <th className="px-4 py-3 text-right text-[10px] font-bold text-text-muted uppercase tracking-wider">Rate</th>
                            <th className="px-4 py-3 text-right text-[10px] font-bold text-text-muted uppercase tracking-wider">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {invoice.lineItems.map((item) => (
                            <tr key={item.id} className="border-b border-divider hover:bg-page-bg">
                              <td className="px-4 py-3 text-text-primary">{item.description}</td>
                              <td className="px-4 py-3 text-right text-text-secondary font-mono">{item.qty}</td>
                              <td className="px-4 py-3 text-right text-text-secondary font-mono">{formatCurrency(item.rate)}</td>
                              <td className="px-4 py-3 text-right font-bold font-mono text-text-primary">{formatCurrency(item.amount)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className="w-12 h-12 rounded-full bg-page-bg flex items-center justify-center text-text-muted mx-auto mb-3">
                        <FileText className="w-5 h-5" />
                      </div>
                      <p className="text-sm font-medium text-text-secondary">No line items added yet.</p>
                      <p className="text-[12px] text-text-muted mt-1">Line items will appear here once added.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-divider bg-page-bg shrink-0 space-y-3">
              {invoice.status !== "Paid" && (
                <button className="w-full flex items-center justify-center gap-2 py-3 bg-accent text-white font-bold text-sm rounded-xl hover:bg-accent/90 transition-all shadow-sm shadow-accent/20">
                  <CheckCircle className="w-4 h-4" />
                  Mark as Paid
                </button>
              )}
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 py-2.5 bg-white border border-border text-text-primary font-bold text-sm rounded-xl hover:bg-page-bg transition-all">
                  <Send className="w-4 h-4" />
                  Send Invoice
                </button>
                <button className="flex items-center justify-center gap-2 py-2.5 bg-white border border-border text-text-primary font-bold text-sm rounded-xl hover:bg-page-bg transition-all">
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
