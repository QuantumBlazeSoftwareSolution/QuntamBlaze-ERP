"use client";

import { motion } from "framer-motion";
import { StatTile } from "@/components/dashboard/StatTile";
import { ProjectHealthCard } from "@/components/dashboard/ProjectHealthCard";
import { ProjectStatusDonut } from "@/components/dashboard/ProjectStatusDonut";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { MOCK_STATS, MOCK_PROJECTS, MOCK_ACTIVITIES } from "@/lib/mockData/dashboard";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
};

export default function DashboardPage() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Top Stats Row */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {MOCK_STATS.map((stat) => (
          <motion.div key={stat.label} variants={itemVariants}>
            <StatTile stat={stat} />
          </motion.div>
        ))}
      </section>

      {/* Bento Grid Layout for Main Content */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Project Health Grid (Takes up 2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div variants={itemVariants} className="flex items-center justify-between">
            <h2 className="text-2xl font-medium text-text-primary">Active Deployments</h2>
            <button className="px-4 py-2 border border-accent/50 text-accent font-bold tracking-[0.1em] text-[11px] uppercase rounded hover:bg-accent/10 hover:shadow-[0_0_12px_rgba(0,229,255,0.15)] transition-all">
              View All
            </button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_PROJECTS.map((project) => (
              <motion.div key={project.id} variants={itemVariants}>
                <ProjectHealthCard project={project} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Column: Activity & Charts */}
        <div className="space-y-6">
          <motion.div variants={itemVariants}>
            <ProjectStatusDonut />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <ActivityFeed activities={MOCK_ACTIVITIES} />
          </motion.div>
        </div>

      </section>
    </motion.div>
  );
}
