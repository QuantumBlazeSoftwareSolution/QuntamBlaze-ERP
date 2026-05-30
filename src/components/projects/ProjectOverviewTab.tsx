"use client";

import React from "react";
import {
  Calendar,
  Clock,
  Target,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProjectDetail, Milestone, LinkedDocument } from "@/types/project";
import { IDChip } from "@/components/ui/IDChip";
import { useSystemConfig } from "@/hooks/useSystemConfig";

interface ProjectOverviewTabProps {
  project: ProjectDetail;
}

export function ProjectOverviewTab({ project }: ProjectOverviewTabProps) {
  const { formatCurrency } = useSystemConfig();
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Left Column: Summary & Milestones */}
      <div className="xl:col-span-2 space-y-8">
        {/* Project Summary Card */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-8 shadow-sm">
          <h3 className="text-[#0F172A] font-bold text-lg mb-6">Project Summary</h3>
          <p className="text-[#475569] text-sm leading-relaxed mb-10 max-w-2xl">
            {project.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <p className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest mb-3 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" />
                Timeline
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] border border-[#F1F5F9] flex items-center justify-center text-[#475569] text-xs font-black">
                    START
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-[#94A3B8] uppercase">Kickoff</p>
                    <p className="text-xs font-bold text-[#0F172A]">
                      {project.startDate instanceof Date
                        ? project.startDate.toLocaleDateString()
                        : String(project.startDate || "")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] border border-[#F1F5F9] flex items-center justify-center text-red-500 text-xs font-black">
                    END
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-[#94A3B8] uppercase">Deadline</p>
                    <p className="text-xs font-bold text-[#0F172A]">
                      {project.deadline instanceof Date
                        ? project.deadline.toLocaleDateString()
                        : String(project.deadline || "")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <p className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest mb-3 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" />
                Core Team
              </p>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {project.team.map((member, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-semibold shadow-sm",
                        member.color
                      )}
                      title={member.name}
                    >
                      {member.initials}
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-[#F1F5F9] flex items-center justify-center text-[#475569] text-[10px] font-black">
                    +2
                  </div>
                </div>
                <span className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">
                  Active Collaboration
                </span>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-10 border-t border-[#F1F5F9]">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">
                Budget Allocation [{formatCurrency(project.budget, true)}]
              </p>
              <span className="text-[10px] font-black text-[#10B981] uppercase tracking-widest">
                {Math.round((project.budgetSpent / project.budget) * 100)}% Spent
              </span>
            </div>
            <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden border border-[#F1F5F9]">
              <div
                className="h-full bg-[#10B981] rounded-full"
                style={{ width: `${(project.budgetSpent / project.budget) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Milestone Trajectory */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-[#0F172A] font-bold text-lg">Milestone Trajectory</h3>
            <button className="text-[10px] font-black text-[#10B981] uppercase tracking-widest flex items-center gap-1 hover:underline">
              View Timeline Map
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <ProjectMilestoneStrip milestones={project.milestones} />
        </div>
      </div>

      {/* Right Column: Context Actions & Log */}
      <div className="space-y-8">
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-8 shadow-sm">
          <h4 className="text-[10px] font-black text-[#0F172A] uppercase tracking-[0.2em] mb-8">
            Context Actions
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#F1F5F9]">
              <p className="text-[9px] font-black text-[#94A3B8] uppercase tracking-widest mb-1">
                Open Tasks
              </p>
              <h4 className="text-xl font-black text-[#0F172A]">{project.openTasks}</h4>
            </div>
            <div className="p-4 rounded-xl bg-[#FEF2F2] border border-[#FECACA] group cursor-pointer hover:bg-red-100 transition-all">
              <p className="text-[9px] font-black text-[#EF4444] uppercase tracking-widest mb-1">
                Blockers
              </p>
              <h4 className="text-xl font-black text-[#EF4444]">{project.blockers}</h4>
            </div>
          </div>
        </div>

        <LinkedDocumentsPanel documents={project.linkedDocuments} />

        <div className="bg-white border border-[#E2E8F0] rounded-xl p-8 shadow-sm">
          <h4 className="text-[10px] font-black text-[#0F172A] uppercase tracking-[0.2em] mb-8 flex items-center justify-between">
            Log Stream
            <TrendingUp className="w-4 h-4 text-[#10B981]" />
          </h4>
          <div className="space-y-6">
            <LogItem
              dotColor="bg-[#10B981]"
              text={`SRS-${project.id} generated`}
              sub="10:42 AM by System"
            />
            <LogItem dotColor="bg-[#0F172A]" text="Cluster config updated" sub="Yesterday by JD" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectMilestoneStrip({ milestones }: { milestones: Milestone[] }) {
  return (
    <div className="flex items-center justify-between relative">
      {/* Connection Line */}
      <div className="absolute top-4 left-0 right-0 h-0.5 bg-[#F1F5F9] -z-1" />

      {milestones.map((ms, idx) => (
        <div key={ms.id} className="flex flex-col items-center text-center relative z-10 flex-1">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center mb-4 transition-all duration-500",
              ms.state === "completed"
                ? "bg-[#10B981] text-white shadow-lg shadow-[#10B981]/20"
                : ms.state === "current"
                  ? "bg-white border-4 border-[#10B981] animate-pulse"
                  : "bg-white border-2 border-[#E2E8F0] text-[#94A3B8]"
            )}
          >
            {ms.state === "completed" ? (
              <Target className="w-4 h-4" />
            ) : (
              <span className="text-[10px] font-black">{idx + 1}</span>
            )}
          </div>
          <p
            className={cn(
              "text-[10px] font-black uppercase tracking-widest mb-1",
              ms.state === "upcoming" ? "text-[#94A3B8]" : "text-[#0F172A]"
            )}
          >
            {ms.label}
          </p>
          <p className="text-[9px] font-bold text-[#94A3B8]">{ms.subLabel}</p>
        </div>
      ))}
    </div>
  );
}

function LinkedDocumentsPanel({ documents }: { documents: LinkedDocument[] }) {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl p-8 shadow-sm">
      <h4 className="text-[10px] font-black text-[#0F172A] uppercase tracking-[0.2em] mb-8">
        Linked Documents
      </h4>
      <div className="flex flex-wrap gap-2">
        {documents.map((doc) => (
          <IDChip
            key={doc.id}
            id={doc.id}
            size="xs"
            className={cn(
              "font-black tracking-tight",
              doc.type === "proposal"
                ? "bg-blue-50 border-blue-100 text-blue-700"
                : doc.type === "agreement"
                  ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                  : "bg-amber-50 border-amber-100 text-amber-700"
            )}
          />
        ))}
      </div>
    </div>
  );
}

function LogItem({ dotColor, text, sub }: { dotColor: string; text: string; sub: string }) {
  return (
    <div className="flex gap-4">
      <div className={cn("w-2 h-2 rounded-full mt-1.5 flex-shrink-0", dotColor)} />
      <div>
        <p className="text-xs font-bold text-[#0F172A] mb-1">{text}</p>
        <p className="text-[10px] font-medium text-[#94A3B8]">{sub}</p>
      </div>
    </div>
  );
}
