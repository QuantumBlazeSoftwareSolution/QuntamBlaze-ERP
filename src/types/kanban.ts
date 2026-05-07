export type Priority = "Critical" | "High" | "Medium" | "Low";
export type TaskStatus = "Backlog" | "In Progress" | "Review" | "Done";

export interface TaskAssignee {
  initials: string;
  color: string; // Tailwind class e.g. "bg-accent/20 text-accent"
}

export interface KanbanTask {
  id: string;           // TSK-PRJ-GOOG-26-001-01
  title: string;
  priority: Priority;
  assignees: TaskAssignee[];
  dueDate: string;      // ISO
  subTasksDone: number;
  subTasksTotal: number;
  columnId: string;
}

export interface KanbanColumnType {
  id: string;
  title: string;
  accentColor: string; // Tailwind class for column header accent
}

export interface KanbanBoardState {
  columns: KanbanColumnType[];
  tasks: KanbanTask[];
}
