export type TaskStatus = "Backlog" | "In Progress" | "Review" | "Done";
export type TaskPriority = "Critical" | "High" | "Medium" | "Low";

export interface SubTask {
  id: string; // STSK-[TSK-ID]-Seq
  title: string;
  isCompleted: boolean;
}

export interface TaskAttachment {
  id: string;
  name: string;
  size: string;
  type: string;
}

export interface TaskComment {
  id: string;
  userId: string; // USR-ID
  userName: string;
  userInitials: string;
  userColor: string;
  text: string;
  timestamp: string; // ISO
}

export interface TaskDetail {
  id: string; // TSK-[PrjID]-Seq
  projectId: string;
  projectName: string;
  clientId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignees: { id: string; name: string; initials: string; color: string }[];
  dueDate: string;
  subTasks: SubTask[];
  attachments: TaskAttachment[];
  activity: TaskComment[];
}
