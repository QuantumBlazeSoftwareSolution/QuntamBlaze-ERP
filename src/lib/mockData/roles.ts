export type Permission = "read" | "write" | "delete" | "admin";
export type Module =
  | "dashboard"
  | "projects"
  | "clients"
  | "finance"
  | "analytics"
  | "settings"
  | "team";

export interface RolePermissions {
  [module: string]: Permission[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
  color: string;
  memberCount: number;
  isSystem: boolean;
  permissions: RolePermissions;
}

export const MODULES: { id: Module; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "projects", label: "Projects" },
  { id: "clients", label: "Clients" },
  { id: "finance", label: "Finance" },
  { id: "analytics", label: "Analytics" },
  { id: "settings", label: "Settings" },
  { id: "team", label: "Team" },
];

export const ALL_PERMISSIONS: Permission[] = ["read", "write", "delete", "admin"];

export const MOCK_ROLES: Role[] = [
  {
    id: "role-admin",
    name: "Admin",
    description: "Full system access. Manages users, billing, and configurations.",
    color: "#10B981",
    memberCount: 2,
    isSystem: true,
    permissions: {
      dashboard: ["read", "write", "delete", "admin"],
      projects: ["read", "write", "delete", "admin"],
      clients: ["read", "write", "delete", "admin"],
      finance: ["read", "write", "delete", "admin"],
      analytics: ["read", "write", "delete", "admin"],
      settings: ["read", "write", "delete", "admin"],
      team: ["read", "write", "delete", "admin"],
    },
  },
  {
    id: "role-manager",
    name: "Manager",
    description: "Manages projects and clients. Can view finance and analytics.",
    color: "#3B82F6",
    memberCount: 5,
    isSystem: false,
    permissions: {
      dashboard: ["read", "write"],
      projects: ["read", "write", "delete"],
      clients: ["read", "write"],
      finance: ["read"],
      analytics: ["read"],
      settings: [],
      team: ["read"],
    },
  },
  {
    id: "role-operator",
    name: "Operator",
    description: "Executes day-to-day tasks. Can update projects and log activities.",
    color: "#F59E0B",
    memberCount: 12,
    isSystem: false,
    permissions: {
      dashboard: ["read"],
      projects: ["read", "write"],
      clients: ["read"],
      finance: [],
      analytics: ["read"],
      settings: [],
      team: ["read"],
    },
  },
  {
    id: "role-viewer",
    name: "Viewer",
    description: "Read-only access to dashboard and projects.",
    color: "#8B5CF6",
    memberCount: 8,
    isSystem: false,
    permissions: {
      dashboard: ["read"],
      projects: ["read"],
      clients: ["read"],
      finance: [],
      analytics: [],
      settings: [],
      team: [],
    },
  },
];
