import { Role, ModulePermissions } from "@/types/team";
import { useTeamStore } from "@/store/useTeamStore";

export function getModulePermissions(role: Role): ModulePermissions {
  // In a real app, this would be a selector from the store
  return useTeamStore.getState().rolePermissions[role];
}
