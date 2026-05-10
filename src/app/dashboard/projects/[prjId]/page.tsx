"use client";

import React, { Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectPageHeader } from "@/components/projects/ProjectPageHeader";
import { ProjectTabs } from "@/components/projects/ProjectTabs";
import { ProjectOverviewTab } from "@/components/projects/ProjectOverviewTab";
import { TaskDetailPanel } from "@/components/tasks/TaskDetailPanel";
import { MOCK_PROJECTS } from "@/lib/mockData/projects";
import { ProjectDetail } from "@/types/project";

// Lazy load complex tabs
const KanbanBoard = React.lazy(() =>
  import("@/components/projects/KanbanBoard").then((m) => ({ default: m.KanbanBoard }))
);
const GanttView = React.lazy(() =>
  import("@/components/projects/GanttView").then((m) => ({ default: m.GanttView }))
);

// Helper to transform mock project to detail (simulating a fetch)
const getProjectDetail = (id: string): ProjectDetail => {
  const prj = MOCK_PROJECTS.find((p) => p.id === id) || MOCK_PROJECTS[0];

  return {
    ...prj,
    description:
      "Legacy infrastructure migration to cloud-native architecture. Involves deprecating on-premise clusters and establishing multi-region redundancy across three availability zones.",
    budgetSpent: prj.budget * 0.68,
    openTasks: 24,
    blockers: 2,
    team: [
      { initials: "JD", name: "John Doe", color: "bg-emerald-500" },
      { initials: "AL", name: "Alice Lee", color: "bg-blue-500" },
      { initials: "MK", name: "Mike King", color: "bg-amber-500" },
    ],
    milestones: [
      { id: "MS-1", label: "Phase 1: Audit", subLabel: "Completed Mar 15", state: "completed" },
      { id: "MS-2", label: "Phase 2: Integration", subLabel: "In Progress", state: "current" },
      { id: "MS-3", label: "Phase 3: Testing", subLabel: "Est. Aug 2026", state: "upcoming" },
      { id: "MS-4", label: "Phase 4: Deploy", subLabel: "Est. Nov 2026", state: "upcoming" },
      { id: "MS-5", label: "Handover", subLabel: "Dec 20, 2026", state: "upcoming" },
    ],
    linkedDocuments: [
      {
        id: "PRO-GOOG-26-001",
        type: "proposal",
        label: "Project Proposal",
        lastModified: "2026-01-05",
      },
      {
        id: "AGR-GOOG-26-001",
        type: "agreement",
        label: "Service Agreement",
        lastModified: "2026-01-10",
      },
      {
        id: "SRS-GOOG-26-001",
        type: "srs",
        label: "System Requirements",
        lastModified: "2026-01-15",
      },
    ],
  };
};

export default function ProjectDetailPage() {
  const { prjId } = useParams();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";

  const project = getProjectDetail(prjId as string);

  return (
    <div className="-mx-8 -mt-24 bg-[#F8FAFC] min-h-screen flex flex-col">
      <div className="pt-24" /> {/* Spacer for the fixed dashboard header */}
      <ProjectPageHeader project={project} />
      <ProjectTabs />
      <main className="flex-1 p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="h-full"
          >
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-64">
                  <div className="w-8 h-8 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin" />
                </div>
              }
            >
              {activeTab === "overview" && <ProjectOverviewTab project={project} />}
              {activeTab === "tasks" && <KanbanBoard />}
              {activeTab === "timeline" && <GanttView />}

              {["documents", "financials", "activity"].includes(activeTab) && (
                <div className="bg-white border border-[#E2E8F0] border-dashed rounded-3xl p-20 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-[#F8FAFC] flex items-center justify-center text-[#94A3B8] mb-4">
                    <Target className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0F172A] uppercase tracking-widest">
                    {activeTab} Workspace
                  </h3>
                  <p className="text-sm text-[#64748B] max-w-xs mt-2">
                    The {activeTab} orchestration layer for {project.id} is currently being
                    calibrated by the Ops team.
                  </p>
                </div>
              )}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>
      <TaskDetailPanel />
    </div>
  );
}

function Target({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}
