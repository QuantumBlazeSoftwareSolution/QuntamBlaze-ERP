"use client";

import { useMemo } from "react";
import { FolderTree } from "@/components/dashboard/documents/FolderTree";
import { DocumentList } from "@/components/dashboard/documents/DocumentList";
import { VersionHistoryPanel } from "@/components/dashboard/documents/VersionHistoryPanel";
import { DocumentListActions } from "@/components/dashboard/documents/DocumentListActions";
import { buildDocumentTree } from "@/lib/documents/treeBuilder";
import { MOCK_PROJECTS } from "@/lib/mockData/projects";
import { MOCK_DOCUMENTS } from "@/lib/mockData/documents";
import { useDocumentStore } from "@/store/useDocumentStore";

export default function DocumentRepositoryPage() {
  const tree = useMemo(() => buildDocumentTree(MOCK_PROJECTS), []);
  const { selectedDocumentId } = useDocumentStore();
  
  const selectedDocument = useMemo(() => 
    MOCK_DOCUMENTS.find(doc => doc.id === selectedDocumentId),
    [selectedDocumentId]
  );

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
      {/* Top Bar Actions */}
      <DocumentListActions />

      <div className="flex-1 flex overflow-hidden bg-page-bg">
        {/* Left: Folder Tree */}
        <FolderTree tree={tree} />

        {/* Center: Document List */}
        <DocumentList documents={MOCK_DOCUMENTS} />

        {/* Right: Version History (Slides in) */}
        <VersionHistoryPanel document={selectedDocument} />
      </div>
    </div>
  );
}
