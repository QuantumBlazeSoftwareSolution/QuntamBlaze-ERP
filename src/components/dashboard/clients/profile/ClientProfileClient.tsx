"use client";

import { motion } from "framer-motion";
import { ClientProfileHeader } from "@/components/dashboard/clients/profile/ClientProfileHeader";
import { ClientQuickStats } from "@/components/dashboard/clients/profile/ClientQuickStats";
import { ClientTabs } from "@/components/dashboard/clients/profile/ClientTabs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ClientProfileClientProps {
  client: any;
}

export function ClientProfileClient({ client }: ClientProfileClientProps) {
  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumbs / Back */}
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
        <Link
          href="/dashboard/clients"
          className="inline-flex items-center gap-2 text-text-muted hover:text-accent transition-colors text-[13px] font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Client Directory
        </Link>
      </motion.div>

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <ClientProfileHeader client={client} />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content (3/4) */}
        <div className="lg:col-span-3">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <ClientTabs client={client} />
          </motion.div>
        </div>

        {/* Sidebar Stats (1/4) */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ClientQuickStats client={client} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
