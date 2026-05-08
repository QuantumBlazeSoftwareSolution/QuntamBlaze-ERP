import { Project } from "@/lib/mockData/projects";
import { FolderNode } from "@/types/documents";

export function buildDocumentTree(projects: Project[]): FolderNode[] {
  return projects.map((project) => ({
    id: project.id,
    name: project.id, // Monospace PRJ-ID as folder name
    type: "folder",
    projectId: project.id,
    children: [
      { id: `${project.id}-srs`, name: "SRS Documents", type: "file-category" },
      { id: `${project.id}-agr`, name: "AGR Agreements", type: "file-category" },
      { id: `${project.id}-pro`, name: "PRO Proposals", type: "file-category" },
      { id: `${project.id}-note`, name: "Meeting Notes", type: "file-category" },
    ],
  }));
}
