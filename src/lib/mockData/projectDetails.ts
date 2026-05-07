import { ProjectDetail } from "@/types/project";

export const PROJECT_DETAILS: Record<string, ProjectDetail> = {
  "PRJ-GOOG-26-001": {
    id: "PRJ-GOOG-26-001",
    name: "Alpha Core Migration",
    clientId: "CLI-GOOG-26",
    clientName: "Google",
    status: "Active",
    description:
      "Legacy infrastructure migration to cloud-native architecture. Involves deprecating on-premise clusters and establishing multi-region redundancy across three availability zones.",
    startDate: "2026-01-12",
    deadline: "2026-12-20",
    progress: 78,
    budget: 2400000,
    budgetSpent: 1632000,
    team: [
      { initials: "JD", name: "James Doe", color: "bg-accent/20 text-accent" },
      { initials: "AL", name: "Alice Lee", color: "bg-success/20 text-success" },
      { initials: "MK", name: "Mark Kim", color: "bg-warning/20 text-warning" },
      { initials: "SR", name: "Sara Raj", color: "bg-danger/20 text-danger" },
      { initials: "VP", name: "Vic Park", color: "bg-purple-500/20 text-purple-400" },
      { initials: "TC", name: "Tom Chen", color: "bg-pink-500/20 text-pink-400" },
    ],
    milestones: [
      { id: "m1", label: "Phase 1: Audit", subLabel: "Completed Mar 15", state: "completed" },
      { id: "m2", label: "Phase 2: Integration", subLabel: "In Progress", state: "current" },
      { id: "m3", label: "Phase 3: Testing", subLabel: "Est. Aug 2026", state: "upcoming" },
      { id: "m4", label: "Phase 4: Deploy", subLabel: "Est. Nov 2026", state: "upcoming" },
      { id: "m5", label: "Handover", subLabel: "Dec 20, 2026", state: "upcoming" },
    ],
    linkedDocuments: [
      {
        id: "PRO-PRJ-GOOG-26-001-01",
        type: "proposal",
        label: "Migration Protocol",
        lastModified: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "AGR-PRJ-GOOG-26-001-V2",
        type: "agreement",
        label: "SLA Agreement",
        lastModified: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "SRS-PRJ-GOOG-26-001",
        type: "srs",
        label: "Spec Document",
        lastModified: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    openTasks: 24,
    blockers: 2,
  },
  "PRJ-MSFT-26-002": {
    id: "PRJ-MSFT-26-002",
    name: "Quantum Sync Protocol",
    clientId: "CLI-MSFT-26",
    clientName: "Microsoft",
    status: "Active",
    description:
      "Designing and implementing a high-frequency synchronization protocol between distributed Azure nodes. Targeting sub-20ms latency across all edge locations.",
    startDate: "2026-06-20",
    deadline: "2027-02-10",
    progress: 34,
    budget: 2400000,
    budgetSpent: 816000,
    team: [
      { initials: "SR", name: "Sara Raj", color: "bg-danger/20 text-danger" },
      { initials: "TC", name: "Tom Chen", color: "bg-pink-500/20 text-pink-400" },
      { initials: "JD", name: "James Doe", color: "bg-accent/20 text-accent" },
    ],
    milestones: [
      { id: "m1", label: "Scoping", subLabel: "Completed Jun 30", state: "completed" },
      { id: "m2", label: "Architecture", subLabel: "In Progress", state: "current" },
      { id: "m3", label: "Development", subLabel: "Est. Oct 2026", state: "upcoming" },
      { id: "m4", label: "QA & Cert", subLabel: "Est. Jan 2027", state: "upcoming" },
      { id: "m5", label: "Release", subLabel: "Feb 10, 2027", state: "upcoming" },
    ],
    linkedDocuments: [
      {
        id: "PRO-PRJ-MSFT-26-002-01",
        type: "proposal",
        label: "Protocol Proposal",
        lastModified: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "AGR-PRJ-MSFT-26-002-V1",
        type: "agreement",
        label: "Service Agreement",
        lastModified: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "SRS-PRJ-MSFT-26-002",
        type: "srs",
        label: "Tech Specification",
        lastModified: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    openTasks: 18,
    blockers: 1,
  },
};

export function getProjectDetail(prjId: string): ProjectDetail | null {
  return PROJECT_DETAILS[prjId] ?? null;
}
