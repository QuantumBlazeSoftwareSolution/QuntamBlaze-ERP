"use client";

import { motion } from "framer-motion";
import { StatTile } from "@/components/dashboard/StatTile";
import { QuickActionBar } from "@/components/dashboard/finance/QuickActionBar";
import { InvoiceTable } from "@/components/dashboard/finance/InvoiceTable";
import { formatCurrency } from "@/lib/utils/format";

interface FinancePageClientProps {
  invoices: any[];
  financeStats: {
    totalOutstanding: number;
    paidThisMonth: number;
    taxLiability: number;
    revenueThisMonth: number;
  };
}

export default function FinancePageClient({ invoices, financeStats }: FinancePageClientProps) {
  const statsData = [
    {
      label: "Total Outstanding",
      value: formatCurrency(financeStats.totalOutstanding),
      trendText: "Live from DB",
      trendDirection: "up" as const,
      icon: "warning",
      sparkline: [40, 65, 50, 80, 70, 95, 100].map((v) => ({ value: v })),
    },
    {
      label: "Revenue This Month",
      value: formatCurrency(financeStats.revenueThisMonth),
      trendText: "Live from DB",
      trendDirection: "up" as const,
      icon: "account_balance",
      sparkline: [20, 40, 35, 60, 55, 85, 90].map((v) => ({ value: v })),
    },
    {
      label: "Tax Liability (VAT/GST)",
      value: formatCurrency(financeStats.taxLiability),
      trendText: "Computed from invoices",
      trendDirection: "neutral" as const,
      icon: "receipt_long",
      sparkline: [50, 50, 50, 50, 50, 50, 50].map((v) => ({ value: v })),
    },
    {
      label: "Paid This Month",
      value: formatCurrency(financeStats.paidThisMonth),
      trendText: "Live from DB",
      trendDirection: "up" as const,
      icon: "domain",
      sparkline: [30, 45, 40, 70, 65, 90, 95].map((v) => ({ value: v })),
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-2"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">
            Financial Command Center
          </h1>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shadow-[0_0_8px_rgba(0,229,255,0.5)]" />
            <span className="text-[10px] font-bold text-accent uppercase tracking-widest">
              Sync: Real-Time
            </span>
          </div>
        </div>
        <p className="text-text-secondary text-lg">
          Real-time fiscal telemetry and transaction auditing.
        </p>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatTile {...stat} trend={0} />
          </motion.div>
        ))}
      </div>

      {/* Quick Action Bar */}
      <QuickActionBar />

      {/* Invoices Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <InvoiceTable data={invoices} />
      </motion.div>
    </div>
  );
}
