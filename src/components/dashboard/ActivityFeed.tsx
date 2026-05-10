"use client";

import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { IDChip } from '@/components/ui/IDChip';
import { ActivityItem } from '@/lib/mockData/dashboard';
import { motion } from 'framer-motion';

export const ActivityFeed = ({ activities }: { activities: ActivityItem[] }) => {
  return (
    <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-divider bg-page-bg">
        <h3 className="text-text-primary font-bold text-sm uppercase tracking-wider">Recent Activity</h3>
      </div>
      
      <div className="divide-y divide-divider">
        {activities.map((activity, index) => (
          <motion.div 
            key={activity.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="px-5 py-4 hover:bg-page-bg transition-colors"
          >
            <div className="flex justify-between items-start mb-1">
              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                <IDChip id={activity.userId} size="xs" variant="muted" />
                <span className="text-text-secondary text-sm">{activity.action}</span>
                <IDChip id={activity.entityId} size="xs" variant="accent" />
              </div>
              <span className="text-text-muted text-[11px] whitespace-nowrap ml-4">
                {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
      
      <button className="w-full py-3 text-center text-accent text-xs font-semibold hover:bg-accent/10 transition-colors border-t border-divider">
        View Full Audit Log
      </button>
    </div>
  );
};
