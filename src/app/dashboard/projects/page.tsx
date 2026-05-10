import { NewProjectButton } from "@/components/projects/NewProjectButton";
import { ProjectsPageClient } from "@/components/projects/ProjectsPageClient";
import { NewProjectModal } from "@/components/projects/NewProjectModal";
import { projectsCrud } from "@/lib/db/crud/projects";

export default async function ProjectsPage() {
  const allProjects = await projectsCrud.getAll();

  const formattedProjects = allProjects.map((p: any) => ({
    ...p,
    startDate: p.startDate ? new Date(p.startDate).toLocaleDateString() : "-",
    deadline: p.deadline ? new Date(p.deadline).toLocaleDateString() : "-",
    budget: Number(p.budget || 0),
  }));

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
      <ProjectsPageClient initialProjects={formattedProjects} />

      <NewProjectModal />
    </div>
  );
}
