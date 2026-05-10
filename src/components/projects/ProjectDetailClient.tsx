"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectPageHeader } from "@/components/projects/ProjectPageHeader";
import { ProjectTabs } from "@/components/projects/ProjectTabs";
import { ProjectOverviewTab } from "@/components/projects/ProjectOverviewTab";
import { ProjectDocumentsTab } from "@/components/projects/ProjectDocumentsTab";
import { ProjectFinancialsTab } from "@/components/projects/ProjectFinancialsTab";
import { ProjectActivityTab } from "@/components/projects/ProjectActivityTab";
import { TaskDetailPanel } from "@/components/tasks/TaskDetailPanel";

// Lazy load complex tabs
const KanbanBoard = React.lazy(() =>
  import("@/components/projects/KanbanBoard").then((m) => ({ default: m.KanbanBoard }))
);
const GanttView = React.lazy(() =>
  import("@/components/projects/GanttView").then((m) => ({ default: m.GanttView }))
);

interface ProjectDetailClientProps {
  project: any; // We'll type this properly based on DB output
}

export function ProjectDetailClient({ project }: ProjectDetailClientProps) {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";

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
              {activeTab === "documents" && <ProjectDocumentsTab />}
              {activeTab === "financials" && <ProjectFinancialsTab />}
              {activeTab === "activity" && <ProjectActivityTab />}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>
      <TaskDetailPanel />
    </div>
  );
}
