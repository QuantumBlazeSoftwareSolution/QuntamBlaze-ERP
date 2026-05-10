import { create } from "zustand";
import { Role, ModulePermissions, PermissionSet } from "@/types/team";

interface TeamState {
  rolePermissions: Record<Role, ModulePermissions>;
  updatePermission: (
    role: Role,
    module: keyof ModulePermissions,
    type: keyof PermissionSet,
    value: boolean
  ) => void;
}

const DEFAULT_PERMISSIONS: PermissionSet = { read: true, write: false, admin: false };

const INITIAL_PERMISSIONS: Record<Role, ModulePermissions> = {
  Admin: {
    projects: { read: true, write: true, admin: true },
    finance: { read: true, write: true, admin: true },
    leads: { read: true, write: true, admin: true },
    docs: { read: true, write: true, admin: true },
    settings: { read: true, write: true, admin: true },
    admin: { read: true, write: true, admin: true },
  },
  PM: {
    projects: { read: true, write: true, admin: true },
    finance: { read: true, write: false, admin: false },
    leads: { read: true, write: true, admin: false },
    docs: { read: true, write: true, admin: true },
    settings: { read: true, write: false, admin: false },
    admin: { read: false, write: false, admin: false },
  },
  Developer: {
    projects: { read: true, write: true, admin: false },
    finance: { read: false, write: false, admin: false },
    leads: { read: false, write: false, admin: false },
    docs: { read: true, write: true, admin: false },
    settings: { read: false, write: false, admin: false },
    admin: { read: false, write: false, admin: false },
  },
  Finance: {
    projects: { read: true, write: false, admin: false },
    finance: { read: true, write: true, admin: true },
    leads: { read: true, write: false, admin: false },
    docs: { read: true, write: true, admin: false },
    settings: { read: false, write: false, admin: false },
    admin: { read: false, write: false, admin: false },
  },
  Client: {
    projects: { read: true, write: false, admin: false },
    finance: { read: true, write: false, admin: false },
    leads: { read: false, write: false, admin: false },
    docs: { read: true, write: false, admin: false },
    settings: { read: false, write: false, admin: false },
    admin: { read: false, write: false, admin: false },
  },
};

export const useTeamStore = create<TeamState>((set) => ({
  rolePermissions: INITIAL_PERMISSIONS,
  updatePermission: (role, module, type, value) =>
    set((state) => ({
      rolePermissions: {
        ...state.rolePermissions,
        [role]: {
          ...state.rolePermissions[role],
          [module]: {
            ...state.rolePermissions[role][module],
            [type]: value,
          },
        },
      },
    })),
}));
