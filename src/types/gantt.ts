export type GanttStatus = "In Progress" | "Done" | "Blocked" | "To-Do";
export type ViewMode = "day" | "week" | "month";

export interface GanttAssignee {
  initials: string;
  color: string;
}

export interface GanttTask {
  id: string; // TSK-PRJ-GOOG-26-001-01
  name: string;
  start: string; // ISO date
  end: string; // ISO date
  status: GanttStatus;
  assignee?: GanttAssignee;
  dependsOn?: string; // Task ID this depends on
}

export interface GanttMilestoneType {
  id: string; // MST-PRJ-GOOG-26-001-01
  label: string;
  date: string; // ISO date
}
