"use client";

import { useRef, useState } from "react";
import { FilePlus, Plus } from "lucide-react";
import { IDChip } from "@/components/ui/IDChip";
import { ProjectStatusChip } from "@/components/projects/ProjectStatusChip";
import { ProjectDetail } from "@/types/project";

interface ProjectPageHeaderProps {
  project: ProjectDetail;
}

export function ProjectPageHeader({ project }: ProjectPageHeaderProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setTimeout(() => {
      titleRef.current?.focus();
      // Place cursor at end
      const range = document.createRange();
      const sel = window.getSelection();
      if (titleRef.current && sel) {
        range.selectNodeContents(titleRef.current);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }, 0);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      titleRef.current?.blur();
    }
    if (e.key === "Escape") {
      titleRef.current?.blur();
    }
  };

  const handleGenerateSRS = () => {
    const srsId = `SRS-${project.id}`;
    console.log(`[ID ENGINE] Generated: ${srsId}`);
    alert(`Generated: ${srsId}`);
  };

  return (
    <div className="pb-6 border-b border-[#1A1A1A]">
      {/* ID Chips Row */}
      <div className="flex items-center gap-2 mb-4">
        <IDChip id={project.id} className="text-sm" />
        <IDChip
          id={project.clientId}
          className="text-sm border-border/50 text-text-secondary bg-transparent"
        />
        <div className="ml-2">
          <ProjectStatusChip status={project.status} />
        </div>
      </div>

      {/* Title + Actions Row */}
      <div className="flex items-start justify-between gap-6">
        {/* Editable Title */}
        <h1
          ref={titleRef}
          contentEditable={isEditing}
          suppressContentEditableWarning
          onDoubleClick={handleDoubleClick}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`text-4xl font-semibold text-text-primary tracking-tight leading-tight cursor-default outline-none transition-all ${
            isEditing
              ? "border-b-2 border-accent cursor-text"
              : "hover:opacity-80"
          }`}
          title="Double-click to edit"
        >
          {project.name}
        </h1>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={handleGenerateSRS}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-[11px] font-bold tracking-[0.1em] uppercase text-text-secondary hover:text-text-primary hover:border-border-hover transition-all"
          >
            <FilePlus className="w-4 h-4" />
            Generate SRS
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/40 rounded-lg text-[11px] font-bold tracking-[0.1em] uppercase text-accent hover:bg-accent/20 transition-all">
            <Plus className="w-4 h-4" />
            New Task
          </button>
        </div>
      </div>
    </div>
  );
}
