"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, UserPlus, CheckCircle2, TrendingUp, Plus, Search, Filter } from "lucide-react";
import { LeadsTable } from "@/components/dashboard/leads/LeadsTable";
import { cn } from "@/lib/utils";

interface LeadsPageClientProps {
  initialLeads: any[];
}

export default function LeadsPageClient({ initialLeads }: LeadsPageClientProps) {
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const stats = [
    {
      label: "Total Leads",
      value: initialLeads.length,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      label: "New Leads",
      value: initialLeads.filter((l) => l.status === "New").length,
      icon: UserPlus,
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      label: "Qualified",
      value: initialLeads.filter((l) => l.status === "Qualified").length,
      icon: CheckCircle2,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
    {
      label: "Converted (Won)",
      value: initialLeads.filter((l) => l.status === "Won").length,
      icon: TrendingUp,
      color: "text-success",
      bg: "bg-success/10",
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">Leads Management</h1>
          <p className="text-text-secondary mt-1 text-lg">
            Track and nurture potential business opportunities.
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent/90 transition-all shadow-sm shadow-accent/20 shrink-0">
          <Plus className="w-5 h-5" />
          Create New Lead
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border border-border rounded-2xl p-6 shadow-sm flex items-center gap-5"
          >
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", stat.bg)}>
              <stat.icon className={cn("w-6 h-6", stat.color)} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-text-muted uppercase tracking-[0.1em] mb-0.5">
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-text-primary tracking-tight">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Table Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 border border-border rounded-2xl shadow-sm">
        <div className="flex items-center gap-2 flex-1 max-w-md bg-page-bg border border-divider rounded-xl px-4 py-2">
          <Search className="w-4 h-4 text-text-muted" />
          <input
            placeholder="Search by company or contact..."
            className="bg-transparent border-none outline-none text-sm text-text-primary w-full placeholder:text-text-muted"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-text-muted mr-2" />
          <div className="flex bg-page-bg p-1 rounded-lg border border-divider">
            {(["all", "New", "Qualified", "Proposal"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={cn(
                  "px-4 py-1.5 text-[11px] font-bold rounded-md transition-all uppercase tracking-wider",
                  statusFilter === tab
                    ? "bg-white text-accent shadow-sm border border-divider"
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <LeadsTable statusFilter={statusFilter} data={initialLeads} />
      </motion.div>
    </div>
  );
}
