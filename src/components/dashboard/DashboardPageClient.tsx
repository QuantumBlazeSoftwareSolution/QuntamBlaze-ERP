"use client";

import { motion, Variants } from "framer-motion";
import { StatTile } from "@/components/dashboard/StatTile";
import { ProjectHealthCard } from "@/components/dashboard/ProjectHealthCard";
import { ProjectStatusDonut } from "@/components/dashboard/ProjectStatusDonut";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import Link from "next/link";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
};

interface DashboardPageClientProps {
  statsData: any[];
  projectHealthData: any[];
  statusDistribution: any[];
  activityFeedData: any[];
}

export default function DashboardPageClient({
  statsData,
  projectHealthData,
  statusDistribution,
  activityFeedData,
}: DashboardPageClientProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col h-[calc(100vh-140px)] min-h-[500px]"
    >
      {/* Top Stats Row (Fixed) */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 shrink-0 mb-6">
        {statsData.map((stat) => (
          <motion.div key={stat.label} variants={itemVariants}>
            <StatTile {...stat} />
          </motion.div>
        ))}
      </section>

      {/* Bento Grid Content (Scrollable Columns) */}
      <section className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        {/* Project Health Grid (Takes up 2 columns) */}
        <div className="lg:col-span-2 overflow-y-auto pr-4 custom-scrollbar">
          <div className="pb-6 space-y-6">
            <motion.div variants={itemVariants} className="flex items-center justify-between">
              <h2 className="text-2xl font-medium text-text-primary">Active Deployments</h2>
              <Link href="/dashboard/projects">
                <button className="px-4 py-2 border border-accent/50 text-accent font-bold tracking-[0.1em] text-[11px] uppercase rounded hover:bg-accent/10 hover:shadow-sm transition-all cursor-pointer">
                  View All
                </button>
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projectHealthData.map((project) => (
                <motion.div key={project.id} variants={itemVariants}>
                  <ProjectHealthCard project={project} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Activity & Charts */}
        <div className="overflow-y-auto pr-2 custom-scrollbar">
          <div className="pb-6 space-y-6">
            <motion.div variants={itemVariants}>
              <ProjectStatusDonut data={statusDistribution} />
            </motion.div>

            <motion.div variants={itemVariants}>
              <ActivityFeed activities={activityFeedData} />
            </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
