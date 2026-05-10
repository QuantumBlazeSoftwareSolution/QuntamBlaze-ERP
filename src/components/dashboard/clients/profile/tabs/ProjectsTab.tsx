"use client";

import { Briefcase, ChevronRight } from "lucide-react";
import { ClientDetail } from "@/types/client";
import { IDChip } from "@/components/ui/IDChip";
import { ProjectStatusChip } from "@/components/projects/ProjectStatusChip";
import { ProjectStatus } from "@/lib/mockData/projects";

export function ProjectsTab({ client }: { client: ClientDetail }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Briefcase className="w-5 h-5 text-accent" />
          <h2 className="text-[11px] font-bold text-text-secondary uppercase tracking-[0.2em]">
            Active Projects
          </h2>
        </div>
        <button className="text-[11px] font-bold text-accent uppercase tracking-widest hover:underline transition-all">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {client.projects.map((project) => (
          <div
            key={project.id}
            className="group relative bg-bg-card/50 border border-border rounded-2xl p-6 flex items-center justify-between hover:bg-bg-card transition-all cursor-pointer overflow-hidden"
          >
            {/* Project ID Accent */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent/30 group-hover:bg-accent transition-all" />

            <div className="flex items-center gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <IDChip id={project.id} className="bg-accent/5 border-accent/20 text-accent" />
                  <ProjectStatusChip status={project.status as ProjectStatus} />
                </div>
                <h3 className="text-lg font-bold text-text-primary group-hover:text-accent transition-colors">
                  {project.name}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-12">
              <div className="text-right space-y-2">
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                  Progress
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-[14px] font-bold text-text-primary">
                    {project.progress}%
                  </span>
                  <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent shadow-[0_0_8px_rgba(0,229,255,0.5)]"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {project.status === "Completed" ? (
                <div className="text-right space-y-1 min-w-[120px]">
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                    Completed On
                  </p>
                  <p className="text-[14px] font-bold text-text-primary">Aug 12, 2023</p>
                </div>
              ) : (
                <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-accent group-hover:translate-x-1 transition-all" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
