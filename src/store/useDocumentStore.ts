import { create } from "zustand";
import { Document, FolderNode } from "@/types/documents";

interface DocumentState {
  selectedFolderId: string | null;
  selectedDocumentId: string | null;
  selectedVersionId: string | null;

  setSelectedFolder: (id: string | null) => void;
  setSelectedDocument: (id: string | null) => void;
  setSelectedVersion: (id: string | null) => void;
}

export const useDocumentStore = create<DocumentState>((set) => ({
  selectedFolderId: null,
  selectedDocumentId: null,
  selectedVersionId: null,

  setSelectedFolder: (id) =>
    set({ selectedFolderId: id, selectedDocumentId: null, selectedVersionId: null }),
  setSelectedDocument: (id) => set({ selectedDocumentId: id, selectedVersionId: null }),
  setSelectedVersion: (id) => set({ selectedVersionId: id }),
}));
