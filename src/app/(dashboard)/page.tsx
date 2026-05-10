"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { TopBar } from '@/components/dashboard/TopBar';
import { StatTile } from '@/components/dashboard/StatTile';
import { ProjectHealthCard } from '@/components/dashboard/ProjectHealthCard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { ProjectStatusDonut } from '@/components/dashboard/ProjectStatusDonut';
import { 
  statsData, 
  projectHealthData, 
  activityFeedData, 
  statusDistribution 
} from '@/lib/mockData/dashboard';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

export default function DashboardPage() {
  return (
    <div className="flex-1 overflow-auto">
      <TopBar title="Overview" />
      
      <main className="p-8">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-[1600px] mx-auto space-y-8"
        >
          {/* KPI Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {statsData.map((stat) => (
              <motion.div key={stat.label} variants={itemVariants}>
                <StatTile {...stat} />
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Project Health Grid */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-text-muted text-xs font-semibold uppercase tracking-widest">
                  Project Health
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {projectHealthData.map((project) => (
                  <motion.div key={project.id} variants={itemVariants}>
                    <ProjectHealthCard project={project} />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Status Distribution */}
            <motion.div variants={itemVariants} className="h-full">
              <ProjectStatusDonut data={statusDistribution} />
            </motion.div>
          </div>

          {/* Activity Feed Section */}
          <div className="space-y-6">
            <h3 className="text-text-muted text-xs font-semibold uppercase tracking-widest">
              System Activity
            </h3>
            <motion.div variants={itemVariants}>
              <ActivityFeed activities={activityFeedData} />
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
