"use client";

import { useState, useCallback } from "react";
import { FilterBar } from "./FilterBar";
import { ViewToggle } from "./ViewToggle";
import { ProjectsTable } from "./ProjectsTable";
import { ProjectHealthCard } from "@/components/dashboard/ProjectHealthCard";
import { MOCK_PROJECTS } from "@/lib/mockData/projects";

type ViewMode = "table" | "card";

export function ProjectsPageClient() {
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [activeStatus, setActiveStatus] = useState("");
  const [activeClient, setActiveClient] = useState("");

  const handleViewChange = useCallback((v: ViewMode) => setViewMode(v), []);

  const filteredProjects = MOCK_PROJECTS.filter((p) => {
    const statusMatch = activeStatus ? p.status === activeStatus : true;
    const clientMatch = activeClient ? p.clientId === activeClient : true;
    return statusMatch && clientMatch;
  });

  return (
    <div className="space-y-5">
      {/* Controls Row */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <FilterBar
          activeStatus={activeStatus}
          activeClient={activeClient}
          onStatusChange={setActiveStatus}
          onClientChange={setActiveClient}
        />
        <ViewToggle onChange={handleViewChange} />
      </div>

      {/* Content */}
      {viewMode === "table" ? (
        <ProjectsTable statusFilter={activeStatus} clientFilter={activeClient} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredProjects.map((p) => (
            <ProjectHealthCard
              key={p.id}
              project={{
                id: p.id,
                name: p.name,
                clientId: p.clientId,
                status: p.status === "OnHold" ? "on-hold" : p.status === "Review" ? "completed" : p.status === "Active" ? "active" : "active",
                progress: p.progress,
                budgetSpent: Math.round(p.budget * (p.progress / 100)),
                budgetTotal: p.budget,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
