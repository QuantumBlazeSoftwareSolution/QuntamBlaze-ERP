import { NewProjectButton } from "@/components/projects/NewProjectButton";
import { ProjectsPageClient } from "@/components/projects/ProjectsPageClient";
import { NewProjectModal } from "@/components/projects/NewProjectModal";
import { projectsCrud } from "@/lib/db/crud/projects";

export default async function ProjectsPage() {
  const projects = await projectsCrud.getAll();

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
      <ProjectsPageClient initialProjects={projects} />

      <NewProjectModal />
    </div>
  );
}
