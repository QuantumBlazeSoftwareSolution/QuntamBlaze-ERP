"use client";

import React from 'react';
import { 
  FilePlus, 
  Plus, 
  ChevronDown, 
  MoreHorizontal,
  ExternalLink,
  Globe
} from 'lucide-react';
import { IDChip } from '@/components/ui/IDChip';
import { cn } from '@/lib/utils';
import { ProjectDetail } from '@/types/project';

interface ProjectPageHeaderProps {
  project: ProjectDetail;
}

export function ProjectPageHeader({ project }: ProjectPageHeaderProps) {
  return (
    <div className="bg-white border-b border-[#E2E8F0] px-8 py-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <IDChip id={project.id} variant="accent" size="md" className="bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]" />
        <div>
          <h1 className="text-[#0F172A] text-xl font-bold tracking-tight">{project.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <IDChip id={project.clientId} size="xs" className="bg-[#EFF6FF] border-[#BFDBFE] text-[#1E40AF]" />
            <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">•</span>
            <span className="text-xs font-bold text-[#64748B]">{project.clientName}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F1F5F9] border border-[#E2E8F0]">
           <div className={cn(
             "w-1.5 h-1.5 rounded-full",
             project.status === 'Active' ? "bg-[#10B981]" : "bg-amber-500"
           )} />
           <span className="text-[10px] font-black uppercase tracking-widest text-[#475569]">{project.status}</span>
           <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
        </div>

        <div className="h-8 w-[1px] bg-[#E2E8F0] mx-2" />

        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm font-bold text-[#475569] hover:bg-[#F8FAFC] transition-all bg-white group">
          <FilePlus className="w-4 h-4 text-[#94A3B8] group-hover:text-blue-600 transition-colors" />
          Generate SRS
        </button>

        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#10B981] text-white text-sm font-bold shadow-lg shadow-[#10B981]/20 hover:scale-[1.02] transition-all">
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </div>
    </div>
  );
}
