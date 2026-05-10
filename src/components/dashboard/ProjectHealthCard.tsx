"use client";

import React from 'react';
import { IDChip } from '@/components/ui/IDChip';
import { ProjectHealth } from '@/lib/mockData/dashboard';

export const ProjectHealthCard = ({ project }: { project: ProjectHealth }) => {
  const budgetPercentage = Math.min((project.budgetSpent / project.budgetTotal) * 100, 100);
  
  return (
    <div className="bg-white border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <IDChip id={project.id} size="xs" />
        <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
          project.status === 'active' ? 'bg-success-bg text-success' : 'bg-warning-bg text-warning'
        }`}>
          {project.status}
        </span>
      </div>

      <h4 className="text-text-primary font-bold text-sm mb-1">{project.name}</h4>
      <div className="mb-5">
        <IDChip id={project.clientId} size="xs" variant="muted" />
      </div>

      <div className="space-y-4">
        {/* Project Progress */}
        <div>
          <div className="flex justify-between text-[11px] font-semibold mb-1.5">
            <span className="text-text-secondary uppercase">Progress</span>
            <span className="text-text-primary">{project.progress}%</span>
          </div>
          <div className="h-1.5 w-full bg-divider rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent transition-all duration-1000 ease-out"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        {/* Budget Burn */}
        <div>
          <div className="flex justify-between text-[11px] font-semibold mb-1.5">
            <span className="text-text-secondary uppercase">Budget Burn</span>
            <span className={budgetPercentage > 80 ? 'text-danger' : 'text-text-primary'}>
              ${project.budgetSpent.toLocaleString()} / ${project.budgetTotal.toLocaleString()}
            </span>
          </div>
          <div className="h-1.5 w-full bg-divider rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ease-out ${
                budgetPercentage > 90 ? 'bg-danger' : budgetPercentage > 75 ? 'bg-warning' : 'bg-info'
              }`}
              style={{ width: `${budgetPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
