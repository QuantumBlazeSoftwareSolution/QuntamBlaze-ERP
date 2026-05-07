"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ProjectDetail } from "@/types/project";
import { ProjectPageHeader } from "@/components/projects/detail/ProjectPageHeader";
import { ProjectTabs, TabId } from "@/components/projects/detail/ProjectTabs";
import { ProjectOverviewTab } from "@/components/projects/detail/ProjectOverviewTab";
import { LinkedDocumentsPanel } from "@/components/projects/detail/LinkedDocumentsPanel";
import { KanbanBoard } from "@/components/projects/kanban/KanbanBoard";
import { GanttView } from "@/components/projects/gantt/GanttView";
import { GanttTask, GanttMilestoneType } from "@/types/gantt";

const MOCK_GANTT_TASKS: GanttTask[] = [
  { id: "TSK-PRJ-GOOG-26-001-01", name: "Audit legacy cluster topology", start: "2026-01-12", end: "2026-02-15", status: "Done", assignee: { initials: "JD", color: "bg-accent/20 text-accent" } },
  { id: "TSK-PRJ-GOOG-26-001-02", name: "Design multi-region VPC layout", start: "2026-02-01", end: "2026-03-20", status: "Done", assignee: { initials: "AL", color: "bg-success/20 text-success" } },
  { id: "TSK-PRJ-GOOG-26-001-03", name: "Migrate core services to K8s", start: "2026-03-10", end: "2026-05-30", status: "In Progress", assignee: { initials: "MK", color: "bg-warning/20 text-warning" }, dependsOn: "TSK-PRJ-GOOG-26-001-02" },
  { id: "TSK-PRJ-GOOG-26-001-04", name: "Set up CI/CD pipeline", start: "2026-03-25", end: "2026-04-30", status: "Done", assignee: { initials: "TC", color: "bg-pink-500/20 text-pink-400" } },
  { id: "TSK-PRJ-GOOG-26-001-05", name: "Database schema migration scripts", start: "2026-04-01", end: "2026-06-15", status: "In Progress", assignee: { initials: "SR", color: "bg-danger/20 text-danger" } },
  { id: "TSK-PRJ-GOOG-26-001-06", name: "Load balancer configuration review", start: "2026-05-15", end: "2026-06-30", status: "To-Do", assignee: { initials: "JD", color: "bg-accent/20 text-accent" } },
  { id: "TSK-PRJ-GOOG-26-001-07", name: "Security audit — IAM policies", start: "2026-06-01", end: "2026-07-20", status: "To-Do", assignee: { initials: "AL", color: "bg-success/20 text-success" } },
  { id: "TSK-PRJ-GOOG-26-001-08", name: "Performance benchmark baseline", start: "2026-07-01", end: "2026-08-15", status: "To-Do", assignee: { initials: "MK", color: "bg-warning/20 text-warning" } },
];

const MOCK_GANTT_MILESTONES: GanttMilestoneType[] = [
  { id: "MST-PRJ-GOOG-26-001-01", label: "Phase 1 Complete", date: "2026-02-28" },
  { id: "MST-PRJ-GOOG-26-001-02", label: "MVP Release", date: "2026-06-01" },
  { id: "MST-PRJ-GOOG-26-001-03", label: "Final Delivery", date: "2026-12-20" },
];

interface ProjectDetailClientProps {
  project: ProjectDetail;
}

const VALID_TABS: TabId[] = ["overview", "tasks", "timeline", "documents", "financials", "activity"];

function isValidTab(tab: string | null): tab is TabId {
  return VALID_TABS.includes(tab as TabId);
}

function TabContent({ project, activeTab }: { project: ProjectDetail; activeTab: TabId }) {
  switch (activeTab) {
    case "overview":
      return <ProjectOverviewTab project={project} />;
    case "tasks":
      return <KanbanBoard prjId={project.id} />;
    case "timeline":
      return (
        <GanttView
          tasks={MOCK_GANTT_TASKS}
          milestones={MOCK_GANTT_MILESTONES}
          initialViewMode="month"
        />
      );
    case "documents":
      return <LinkedDocumentsPanel documents={project.linkedDocuments} />;
    case "financials":
      return (
        <div className="p-8 text-center text-text-secondary text-sm border border-border rounded-xl">
          Financials — Coming Soon
        </div>
      );
    case "activity":
      return (
        <div className="p-8 text-center text-text-secondary text-sm border border-border rounded-xl">
          Activity Log — Coming Soon
        </div>
      );
  }
}

function ProjectDetailInner({ project }: ProjectDetailClientProps) {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const activeTab: TabId = isValidTab(tabParam) ? tabParam : "overview";

  return (
    <div className="min-h-screen bg-[#050505]">
      <div className="px-8 py-6 max-w-[1440px] mx-auto">
        <ProjectPageHeader project={project} />

        <div className="mt-6">
          <ProjectTabs activeTab={activeTab} prjId={project.id}>
            <TabContent project={project} activeTab={activeTab} />
          </ProjectTabs>
        </div>
      </div>
    </div>
  );
}

export function ProjectDetailClient({ project }: ProjectDetailClientProps) {
  return (
    <Suspense fallback={<div className="p-8 text-text-secondary">Loading...</div>}>
      <ProjectDetailInner project={project} />
    </Suspense>
  );
}
