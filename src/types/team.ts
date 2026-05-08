export type Role = "Admin" | "PM" | "Developer" | "Finance" | "Client";

export interface PermissionSet {
  read: boolean;
  write: boolean;
  admin: boolean;
}

export interface ModulePermissions {
  projects: PermissionSet;
  finance: PermissionSet;
  leads: PermissionSet;
  docs: PermissionSet;
  settings: PermissionSet;
  admin: PermissionSet;
}

export interface TeamMember {
  id: string; // USR-Initials-YY-Seq
  name: string;
  email: string;
  avatar?: string;
  role: Role;
  activeProjects: string[]; // PRJ-IDs
  lastActive: string;
  status: "Active" | "Inactive" | "Pending";
}
