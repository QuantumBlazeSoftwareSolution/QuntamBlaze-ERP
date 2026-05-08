export type DocType = "SRS" | "AGR" | "PRO" | "Note";
export type DocStatus = "Draft" | "Under Review" | "Approved" | "Signed";

export interface DocumentVersion {
  id: string; // Full versioned ID like AGR-PRJ-GOOG-26-005-V1
  version: number;
  authorId: string;
  authorName: string;
  timestamp: string;
  summary: string;
}

export interface Document {
  id: string; // Base ID like AGR-PRJ-GOOG-26-005
  projectId: string;
  name: string;
  type: DocType;
  status: DocStatus;
  currentVersion: number;
  lastModified: string;
  authorName: string;
  authorAvatar?: string;
  versions: DocumentVersion[];
}

export interface FolderNode {
  id: string;
  name: string;
  type: "folder" | "file-category";
  projectId?: string;
  children?: FolderNode[];
}
