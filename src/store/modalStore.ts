import { create } from "zustand";

interface ModalStore {
  isNewProjectModalOpen: boolean;
  openNewProjectModal: () => void;
  closeNewProjectModal: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  isNewProjectModalOpen: false,
  openNewProjectModal: () => set({ isNewProjectModalOpen: true }),
  closeNewProjectModal: () => set({ isNewProjectModalOpen: false }),
}));
