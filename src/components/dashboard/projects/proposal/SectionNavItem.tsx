"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  FileText,
  Target,
  ListChecks,
  Calendar,
  DollarSign,
  Users,
  ShieldCheck,
} from "lucide-react";
import { ProposalSectionType } from "@/types/proposal";
import { cn } from "@/lib/utils";

interface SectionNavItemProps {
  id: string;
  type: ProposalSectionType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const SECTION_ICONS: Record<ProposalSectionType, any> = {
  executive_summary: FileText,
  scope: Target,
  deliverables: ListChecks,
  timeline: Calendar,
  pricing: DollarSign,
  team: Users,
  terms: ShieldCheck,
};

export function SectionNavItem({ id, type, label, isActive, onClick }: SectionNavItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
  };

  const Icon = SECTION_ICONS[type];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-center gap-3 px-4 py-3 rounded-lg border transition-all cursor-pointer mb-2",
        isActive
          ? "bg-accent/5 border-accent/20 text-text-primary"
          : "bg-transparent border-transparent text-text-muted hover:bg-white/5 hover:text-text-secondary",
        isDragging && "opacity-50 scale-105 shadow-2xl bg-bg-card border-accent/50"
      )}
      onClick={onClick}
    >
      <div
        {...attributes}
        {...listeners}
        className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-1"
      >
        <GripVertical className="w-4 h-4 text-text-muted" />
      </div>

      <Icon className={cn("w-4 h-4", isActive ? "text-accent" : "text-text-muted")} />
      <span className="text-[13px] font-bold tracking-tight">{label}</span>

      {isActive && (
        <div className="ml-auto w-1 h-4 bg-accent rounded-full shadow-[0_0_8px_rgba(0,229,255,0.8)]" />
      )}
    </div>
  );
}
