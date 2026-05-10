import { notFound } from "next/navigation";
import { projectsCrud } from "@/lib/db/crud/projects";
import { ProjectDetailClient } from "@/components/projects/ProjectDetailClient";

export default async function ProjectDetailPage({ params }: { params: Promise<{ prjId: string }> }) {
  const { prjId } = await params;
  const projectData = await projectsCrud.getById(prjId);

  if (!projectData) {
    notFound();
  }

  // Format data to match what the frontend expects
  const formattedProject: any = {
    ...projectData,
    budget: Number(projectData.budget || 0),
    budgetSpent: Number(projectData.budget || 0) * ((projectData.progress || 0) / 100),
    clientName: projectData.client?.name || "N/A",
    openTasks: 24, // TODO: Wire this up to actual tasks when task schema is finalized
    blockers: 2,   // TODO: Wire this up
    team: projectData.team?.map((pt) => ({
      initials: pt.employee?.name?.substring(0, 2).toUpperCase() || "??",
      name: pt.employee?.name || "Unknown",
      color: "bg-blue-500", 
    })) || [],
    linkedDocuments: [], // TODO: Wire this up
  };

  return <ProjectDetailClient project={formattedProject} />;
}
