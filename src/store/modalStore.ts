import { create } from "zustand";

type ModalType = "newProject" | "taskDetail" | null;

interface ModalState {
  activeModal: ModalType;
  modalData: unknown;
  openModal: (type: ModalType, data?: unknown) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  activeModal: null,
  modalData: null,
  openModal: (type, data = null) => set({ activeModal: type, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: null }),
}));
