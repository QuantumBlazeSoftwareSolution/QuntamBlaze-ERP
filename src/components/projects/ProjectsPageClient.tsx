"use client";

import { useState, useCallback } from "react";
import { FilterBar } from "./FilterBar";
import { ProjectsTable } from "./ProjectsTable";
import { ProjectHealthCard } from "@/components/dashboard/ProjectHealthCard";
import { ProjectStatusDonut } from "@/components/dashboard/ProjectStatusDonut";
import { MOCK_PROJECTS } from "@/lib/mockData/projects";
import { statusDistribution } from "@/lib/mockData/dashboard";

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
    <div className="flex flex-col h-[calc(100vh-240px)] min-h-[500px]">
      {/* Controls Row (Fixed) */}
      <div className="flex items-center justify-between gap-4 flex-wrap mb-6 shrink-0">
        <FilterBar
          activeStatus={activeStatus}
          activeClient={activeClient}
          onStatusChange={setActiveStatus}
          onClientChange={setActiveClient}
        />
      </div>

      {/* Bento Grid Content (Scrollable Columns) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">
        {/* Left Column: Projects List (Independent Scroll) */}
        <div className="lg:col-span-2 overflow-y-auto pr-4 custom-scrollbar">
          <div className="pb-6">
            <ProjectsTable statusFilter={activeStatus} clientFilter={activeClient} />
          </div>
        </div>

        {/* Right Column: Analytics & Health (Independent Scroll) */}
        <aside className="overflow-y-auto pr-2 custom-scrollbar">
          <div className="pb-6 space-y-6">
            <ProjectStatusDonut data={statusDistribution} />
            
            <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-6">Top Active Projects</h3>
              <div className="space-y-4">
                {filteredProjects.slice(0, 3).map((p) => (
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
              <button className="w-full mt-6 py-2 text-xs font-bold text-text-secondary hover:text-accent border border-divider hover:border-accent rounded-lg transition-all">
                View Performance Report
              </button>
            </div>

            <div className="p-6 rounded-xl bg-accent/5 border border-accent/10">
              <h4 className="text-xs font-bold text-accent uppercase tracking-widest mb-2">Pro Tip</h4>
              <p className="text-[11px] text-text-secondary leading-relaxed">
                Use <kbd className="px-1.5 py-0.5 rounded bg-white border border-border">CMD+K</kbd> to quickly jump between projects or clients from anywhere in the app.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
