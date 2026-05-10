"use client";

import { motion } from "framer-motion";
import { UserPlus, ShieldCheck, Users } from "lucide-react";
import { TeamMembersTable } from "@/components/dashboard/settings/team/TeamMembersTable";
import { PermissionsMatrix } from "@/components/dashboard/settings/team/PermissionsMatrix";
import { MOCK_TEAM } from "@/lib/mockData/team";

export default function TeamManagementPage() {
  return (
    <div className="space-y-12 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-1"
        >
          <h1 className="text-4xl font-bold text-text-primary tracking-tight">Team Management</h1>
          <p className="text-text-secondary text-lg">
            Global oversight and permission orchestration.
          </p>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-8 py-3.5 bg-accent/10 border border-accent/30 text-accent font-bold rounded-xl hover:bg-accent/20 transition-all shadow-lg"
        >
          <UserPlus className="w-5 h-5" />+ Invite Member
        </motion.button>
      </div>

      {/* Team Table Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 px-1">
          <Users className="w-5 h-5 text-accent" />
          <h2 className="text-[11px] font-bold text-text-muted uppercase tracking-[0.2em]">
            Active Operatives
          </h2>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <TeamMembersTable members={MOCK_TEAM} />
        </motion.div>
      </section>

      {/* Permissions Matrix Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 px-1">
          <ShieldCheck className="w-5 h-5 text-accent" />
          <h2 className="text-[11px] font-bold text-text-muted uppercase tracking-[0.2em]">
            Permission Matrix
          </h2>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <PermissionsMatrix />
        </motion.div>
      </section>
    </div>
  );
}
