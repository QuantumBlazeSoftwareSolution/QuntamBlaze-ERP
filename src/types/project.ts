import { ProjectStatus } from "@/lib/mockData/projects";

export interface TeamMember {
  initials: string;
  name: string;
  color: string; // Tailwind bg class
}

export interface Milestone {
  id: string;
  label: string;
  subLabel: string; // e.g. "Completed Mar 15"
  state: "completed" | "current" | "upcoming";
}

export interface LinkedDocument {
  id: string;
  type: "proposal" | "agreement" | "srs";
  label: string;
  lastModified: string; // ISO
}

export interface ProjectDetail {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
  status: ProjectStatus;
  description: string;
  startDate: string;
  deadline: string;
  progress: number;
  budget: number;
  budgetSpent: number;
  team: TeamMember[];
  milestones: Milestone[];
  linkedDocuments: LinkedDocument[];
  openTasks: number;
  blockers: number;
}
