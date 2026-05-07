"use client";

import { format } from "date-fns";
import { ProjectDetail } from "@/types/project";
import { ProjectProgressBar } from "@/components/projects/ProjectProgressBar";
import { ProjectMilestoneStrip } from "./ProjectMilestoneStrip";

export function ProjectOverviewTab({ project }: { project: ProjectDetail }) {
  const budgetPercent = Math.round((project.budgetSpent / project.budget) * 100);
  const budgetFormatted = (project.budget / 1000000).toFixed(1);
  const visibleTeam = project.team.slice(0, 3);
  const overflowCount = project.team.length - 3;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Column */}
      <div className="lg:col-span-2 space-y-6">
        {/* Summary Card */}
        <div className="bg-bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-medium text-text-primary mb-4">Project Summary</h3>
          <div className="grid grid-cols-3 gap-6">
            {/* Description */}
            <div className="col-span-2">
              <p className="text-sm text-text-secondary leading-relaxed">{project.description}</p>

              {/* Budget */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold tracking-[0.1em] text-text-secondary uppercase">
                    Budget Allocation (${budgetFormatted}M)
                  </span>
                  <span className="text-[11px] font-mono text-accent">{budgetPercent}% Spent</span>
                </div>
                <ProjectProgressBar progress={budgetPercent} showLabel={false} />
              </div>
            </div>

            {/* Dates & Team */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-bg-surface border border-border rounded-lg p-3">
                  <div className="text-[10px] font-bold tracking-[0.1em] text-text-secondary uppercase mb-1">
                    Start Date
                  </div>
                  <div className="text-sm font-medium text-text-primary">
                    {format(new Date(project.startDate), "MMM dd, yyyy")}
                  </div>
                </div>
                <div className="bg-bg-surface border border-border rounded-lg p-3">
                  <div className="text-[10px] font-bold tracking-[0.1em] text-text-secondary uppercase mb-1">
                    End Date
                  </div>
                  <div className="text-sm font-medium text-text-primary">
                    {format(new Date(project.deadline), "MMM dd, yyyy")}
                  </div>
                </div>
              </div>

              {/* Team Avatars */}
              <div>
                <div className="text-[10px] font-bold tracking-[0.1em] text-text-secondary uppercase mb-2">
                  Core Team
                </div>
                <div className="flex items-center">
                  {visibleTeam.map((member, i) => (
                    <div
                      key={member.initials}
                      title={member.name}
                      style={{ marginLeft: i > 0 ? "-8px" : 0 }}
                      className={`w-8 h-8 rounded-full border-2 border-bg-card flex items-center justify-center text-xs font-bold z-10 ${member.color}`}
                    >
                      {member.initials}
                    </div>
                  ))}
                  {overflowCount > 0 && (
                    <div
                      style={{ marginLeft: "-8px" }}
                      className="w-8 h-8 rounded-full border-2 border-bg-card bg-[#1A1A1A] flex items-center justify-center text-xs font-bold text-text-secondary z-10"
                    >
                      +{overflowCount}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Milestone Strip */}
        <div className="bg-bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[11px] font-bold tracking-[0.1em] text-text-secondary uppercase">
              Milestone Trajectory
            </h3>
            <button className="text-[11px] font-bold tracking-[0.1em] text-text-secondary hover:text-accent transition-colors uppercase">
              View Timeline Map →
            </button>
          </div>
          <ProjectMilestoneStrip milestones={project.milestones} />
        </div>
      </div>

      {/* Context Sidebar */}
      <div className="space-y-4">
        {/* Context Actions Widget */}
        <div className="bg-bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[11px] font-bold tracking-[0.1em] text-text-secondary uppercase">
              Context Actions
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-bg-surface border border-border rounded-lg p-4">
              <div className="text-[10px] font-bold tracking-[0.1em] text-text-secondary uppercase mb-1">
                Open Tasks
              </div>
              <div className="text-2xl font-bold text-text-primary">{project.openTasks}</div>
            </div>
            <div className="bg-bg-surface border border-danger/30 rounded-lg p-4">
              <div className="text-[10px] font-bold tracking-[0.1em] text-danger/70 uppercase mb-1">
                Blockers
              </div>
              <div className="text-2xl font-bold text-danger">{project.blockers}</div>
            </div>
          </div>
        </div>

        {/* Log Stream */}
        <div className="bg-bg-card border border-border rounded-xl p-5">
          <h3 className="text-[11px] font-bold tracking-[0.1em] text-text-secondary uppercase mb-4">
            Log Stream
          </h3>
          <div className="space-y-3">
            {[
              { dot: "bg-accent", text: `SRS-${project.id} generated`, meta: "10:42 AM by System" },
              { dot: "bg-[#3A3A3A]", text: "Cluster config updated", meta: "Yesterday by JD" },
            ].map((entry, i) => (
              <div key={i} className="flex gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${entry.dot}`} />
                <div>
                  <div className="text-sm text-text-primary">{entry.text}</div>
                  <div className="text-[11px] text-text-secondary">{entry.meta}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
