import { TaskDetail } from "@/types/task";

export const MOCK_TASK_DETAIL: TaskDetail = {
  id: "TSK-PRJ-GOOG-26-005-12",
  projectId: "PRJ-GOOG-26-005",
  projectName: "Project Alpha Core",
  clientId: "CLI-GOOG-26",
  title: "Migrate Legacy Database to Quantum Storage",
  description: "Legacy infrastructure migration to cloud-native architecture. Ensures seamless data transfer with zero downtime protocols engaged. Focus on latency optimization during synchronization phase.",
  status: "In Progress",
  priority: "High",
  assignees: [
    { id: "USR-JD-26-001", name: "James Doe", initials: "JD", color: "bg-accent/20 text-accent" }
  ],
  dueDate: "2026-10-12",
  subTasks: [
    { id: "STSK-TSK-PRJ-GOOG-26-005-12-01", title: "Audit source data", isCompleted: true },
    { id: "STSK-TSK-PRJ-GOOG-26-005-12-02", title: "Configure cluster latency", isCompleted: false },
    { id: "STSK-TSK-PRJ-GOOG-26-005-12-03", title: "Validate encryption", isCompleted: false },
  ],
  attachments: [
    { id: "att-001", name: "Migration_Protocol.pdf", size: "2.4 MB", type: "pdf" },
    { id: "att-002", name: "Cluster_Manifest.json", size: "156 KB", type: "json" },
  ],
  activity: [
    {
      id: "com-001",
      userId: "USR-JD-26-001",
      userName: "James Doe",
      userInitials: "JD",
      userColor: "bg-accent/20 text-accent",
      text: "Initialized synchronization protocols. Latency checks passed.",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    }
  ],
};
