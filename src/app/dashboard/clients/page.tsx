"use client";

import { motion } from "framer-motion";
import { ClientsTable } from "@/components/dashboard/clients/ClientsTable";
import { ClientFilterBar } from "@/components/dashboard/clients/ClientFilterBar";
import { MOCK_CLIENTS } from "@/lib/mockData/clients";

export default function ClientsPage() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-2"
      >
        <h1 className="text-4xl font-bold text-text-primary tracking-tight">Client Directory</h1>
        <p className="text-text-secondary text-lg">
          Manage active engagements and billing parameters.
        </p>
      </motion.div>

      {/* Filter Bar */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <ClientFilterBar />
      </motion.div>

      {/* Table Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <ClientsTable data={MOCK_CLIENTS} />
      </motion.div>
    </div>
  );
}
