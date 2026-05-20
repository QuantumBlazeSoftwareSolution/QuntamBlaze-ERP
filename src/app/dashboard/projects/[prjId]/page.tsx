import { notFound, redirect } from "next/navigation";
import { projectsCrud } from "@/lib/db/crud/projects";
import { ProjectDetailClient } from "@/components/projects/ProjectDetailClient";
import { getSession } from "@/lib/session";

export default async function ProjectDetailPage({ params }: { params: Promise<{ prjId: string }> }) {
  const session = await getSession();
  if (!session || !session.userId) {
    redirect("/login");
  }

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

  const currentUser = {
    userId: session.userId,
    name: session.name || "Unknown User",
    email: session.email || "",
    roleName: session.roleName || "Member",
    roleColor: session.roleColor || "#10B981",
  };

  return <ProjectDetailClient project={formattedProject} currentUser={currentUser} />;
}
