"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, TrendingUp } from "lucide-react";
import { ReceiptsTable } from "@/components/dashboard/finance/receipts/ReceiptsTable";
import { ReceiptFilters } from "@/components/dashboard/finance/receipts/ReceiptFilters";
import { LogReceiptModal } from "@/components/dashboard/finance/receipts/LogReceiptModal";
import { MOCK_RECEIPTS } from "@/lib/mockData/receipts";
import { formatCurrency } from "@/lib/utils/format";
import { Receipt } from "@/types/receipt";

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState<Receipt[]>(MOCK_RECEIPTS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogReceipt = (data: any) => {
    // Generate actual receipt object
    const newReceipt: Receipt = {
      id: `RCT-2410-${(receipts.length + 90).toString().padStart(3, "0")}`,
      invoiceId: data.invoiceId,
      clientId: "CLI-NEW",
      clientName: "New Client",
      paymentDate: data.paymentDate,
      amount: Number(data.amount),
      paymentMethod: data.method,
      referenceNumber: data.referenceNumber,
      loggedBy: { name: "Op. Alpha" },
    };

    setReceipts([newReceipt, ...receipts]);
    setIsModalOpen(false);
  };

  const totalCollected = receipts.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-1"
        >
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">
            Receipt & Payment Log
          </h1>
          <p className="text-text-secondary text-lg">
            Monitor and log all incoming financial transactions.
          </p>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-border text-text-primary font-bold rounded-xl hover:bg-white/10 transition-all shadow-lg"
        >
          <Plus className="w-4 h-4 text-accent" />
          Log New Receipt
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Summary Tile */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-bg-card border border-border rounded-2xl p-8 space-y-6 relative overflow-hidden group"
        >
          <div className="space-y-2 relative z-10">
            <p className="text-[11px] font-bold text-text-muted uppercase tracking-[0.2em]">
              Total Collected This Month
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-bold text-text-muted">$</span>
              <h2 className="text-4xl font-black text-success tracking-tighter">
                {totalCollected.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </h2>
            </div>
            <div className="flex items-center gap-2 text-success pt-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-[13px] font-bold">+14.2% vs last period</span>
            </div>
          </div>
          {/* Subtle background decoration */}
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-success/5 rounded-full blur-3xl group-hover:bg-success/10 transition-colors" />
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <ReceiptFilters />
        </motion.div>
      </div>

      {/* Receipts Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <ReceiptsTable data={receipts} />
      </motion.div>

      {/* Modal */}
      <LogReceiptModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLog={handleLogReceipt}
      />
    </div>
  );
}
