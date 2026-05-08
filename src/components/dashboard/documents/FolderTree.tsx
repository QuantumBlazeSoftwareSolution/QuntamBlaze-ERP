"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown, Folder, FolderOpen, FileText, FileSignature, FileCheck, StickyNote } from "lucide-react";
import { FolderNode } from "@/types/documents";
import { useDocumentStore } from "@/store/useDocumentStore";
import { cn } from "@/lib/utils";

const TYPE_ICONS: Record<string, any> = {
  "SRS Documents": FileText,
  "AGR Agreements": FileSignature,
  "PRO Proposals": FileCheck,
  "Meeting Notes": StickyNote,
};

function FolderItem({ node, depth = 0 }: { node: FolderNode; depth?: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedFolderId, setSelectedFolder } = useDocumentStore();

  const isFolder = node.type === "folder";
  const isSelected = selectedFolderId === node.id;
  const Icon = isFolder ? (isOpen ? FolderOpen : Folder) : (TYPE_ICONS[node.name] || FileText);

  return (
    <div className="select-none">
      <div 
        className={cn(
          "flex items-center gap-2 px-4 py-2 cursor-pointer transition-all hover:bg-white/5 group",
          isSelected && "bg-accent/5 text-accent"
        )}
        style={{ paddingLeft: `${depth * 16 + 16}px` }}
        onClick={() => {
          if (isFolder) setIsOpen(!isOpen);
          setSelectedFolder(node.id);
        }}
      >
        {isFolder && (
          isOpen ? <ChevronDown className="w-3.5 h-3.5 text-text-muted" /> : <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
        )}
        {!isFolder && <div className="w-3.5" />}
        <Icon className={cn("w-4 h-4", isSelected ? "text-accent" : "text-text-muted group-hover:text-text-secondary")} />
        <span className={cn(
          "text-[13px] font-medium tracking-tight",
          isFolder ? "font-mono text-text-muted" : "text-text-secondary",
          isSelected && "text-accent"
        )}>
          {node.name}
        </span>
      </div>

      {isFolder && isOpen && node.children?.map(child => (
        <FolderItem key={child.id} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}

export function FolderTree({ tree }: { tree: FolderNode[] }) {
  return (
    <div className="w-[260px] bg-[#0A0A0A] border-r border-border h-full overflow-y-auto py-6">
      <h3 className="px-6 text-[11px] font-bold text-text-muted uppercase tracking-[0.2em] mb-6">Project Directories</h3>
      <div className="space-y-1">
        {tree.map(node => (
          <FolderItem key={node.id} node={node} />
        ))}
      </div>
    </div>
  );
}
