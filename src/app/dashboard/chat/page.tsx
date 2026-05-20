import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { projectsCrud } from "@/lib/db/crud/projects";
import { ChatWorkspaceClient } from "@/components/chat/ChatWorkspaceClient";

export const metadata = {
  title: "Chat Workspace | Quantum Blaze ERP",
  description: "Real-time collaboration, team messaging, and Google Drive-backed file attachments.",
};

interface ChatPageProps {
  searchParams: Promise<{ projectId?: string }>;
}

export default async function ChatPage({ searchParams }: ChatPageProps) {
  const session = await getSession();
  if (!session || !session.userId) {
    redirect("/login");
  }

  const { projectId } = await searchParams;

  // Retrieve projects
  const allProjects = await projectsCrud.getAll();

  const currentUser = {
    userId: session.userId,
    name: session.name || "Unknown User",
    email: session.email || "",
    roleName: session.roleName || "Member",
    roleColor: session.roleColor || "#10B981",
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[500px]">
      <div className="mb-6 shrink-0">
        <h1 className="text-3xl font-bold text-text-primary tracking-tight">Workspace Chat</h1>
        <p className="text-text-secondary mt-1">
          Real-time collaboration, team messaging, and Google Drive-backed file attachments.
        </p>
      </div>

      <div className="flex-1 min-h-0">
        <ChatWorkspaceClient
          initialProjects={allProjects.map((p) => ({
            id: p.id,
            name: p.name,
            status: p.status,
            progress: p.progress || 0,
            description: p.description,
          }))}
          currentUser={currentUser}
          initialSelectedProjectId={projectId || ""}
        />
      </div>
    </div>
  );
}
