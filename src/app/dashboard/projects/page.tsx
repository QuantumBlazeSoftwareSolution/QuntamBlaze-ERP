import { NewProjectButton } from "@/components/projects/NewProjectButton";
import { ProjectsPageClient } from "@/components/projects/ProjectsPageClient";
import { NewProjectModal } from "@/components/projects/NewProjectModal";

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary tracking-tight">Projects</h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage and monitor all active deployments
          </p>
        </div>
        <NewProjectButton />
      </div>

      {/* Client-side table + filter + toggle */}
      <ProjectsPageClient />

      <NewProjectModal />
    </div>
  );
}
