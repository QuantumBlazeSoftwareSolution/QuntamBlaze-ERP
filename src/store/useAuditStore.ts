import { create } from "zustand";
import { AuditEntry } from "@/types/audit";

interface AuditState {
  isOpen: boolean;
  entries: AuditEntry[];
  entityId: string | null;

  openAuditLog: (entityId?: string) => void;
  closeAuditLog: () => void;
  setEntries: (entries: AuditEntry[]) => void;
}

export const useAuditStore = create<AuditState>((set) => ({
  isOpen: false,
  entries: [],
  entityId: null,

  openAuditLog: (entityId) => set({ isOpen: true, entityId: entityId || null }),
  closeAuditLog: () => set({ isOpen: false, entityId: null }),
  setEntries: (entries) => set({ entries }),
}));
