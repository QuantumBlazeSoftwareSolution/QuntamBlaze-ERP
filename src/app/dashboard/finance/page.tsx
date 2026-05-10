"use client";

import { motion } from "framer-motion";
import { StatTile } from "@/components/dashboard/StatTile";
import { QuickActionBar } from "@/components/dashboard/finance/QuickActionBar";
import { InvoiceTable } from "@/components/dashboard/finance/InvoiceTable";
import { MOCK_FINANCE_STATS, MOCK_INVOICES } from "@/lib/mockData/finance";
import { formatCurrency } from "@/lib/utils/format";

export default function FinancePage() {
  const statsData = [
    {
      label: "Total Outstanding",
      value: formatCurrency(MOCK_FINANCE_STATS.totalOutstanding),
      trendText: `+${MOCK_FINANCE_STATS.trends.outstanding}% vs last month`,
      trendDirection: "up" as const,
      icon: "warning", // Maps to AlertTriangle in StatTile
      sparkline: [
        { value: 40 },
        { value: 65 },
        { value: 50 },
        { value: 80 },
        { value: 70 },
        { value: 95 },
        { value: 100 },
      ],
    },
    {
      label: "Revenue This Month",
      value: formatCurrency(MOCK_FINANCE_STATS.revenueThisMonth),
      trendText: `+${MOCK_FINANCE_STATS.trends.revenue}% vs last month`,
      trendDirection: "up" as const,
      icon: "account_balance", // Maps to Wallet
      sparkline: [
        { value: 20 },
        { value: 40 },
        { value: 35 },
        { value: 60 },
        { value: 55 },
        { value: 85 },
        { value: 90 },
      ],
    },
    {
      label: "Tax Liability (VAT/GST)",
      value: formatCurrency(MOCK_FINANCE_STATS.taxLiability),
      trendText: `0.0% vs last month`,
      trendDirection: "neutral" as const,
      icon: "receipt_long", // Maps to Receipt
      sparkline: [
        { value: 50 },
        { value: 50 },
        { value: 50 },
        { value: 50 },
        { value: 50 },
        { value: 50 },
        { value: 50 },
      ],
    },
    {
      label: "Paid This Month",
      value: formatCurrency(MOCK_FINANCE_STATS.paidThisMonth),
      trendText: `+${MOCK_FINANCE_STATS.trends.paid}% vs last month`,
      trendDirection: "up" as const,
      icon: "domain", // Maps to Building2
      sparkline: [
        { value: 30 },
        { value: 45 },
        { value: 40 },
        { value: 70 },
        { value: 65 },
        { value: 90 },
        { value: 95 },
      ],
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
            {/* We can't directly use StatTile because it expects StatData from dashboard mock, 
                but our structure is close enough. We'll map it. */}
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
        <InvoiceTable data={MOCK_INVOICES} />
      </motion.div>
    </div>
  );
}
