"use client";

import React from 'react';
import { Candidate } from '@/types/hr';
import { IDChip } from '@/components/ui/IDChip';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CandidateCardProps {
  candidate: Candidate;
}

export function CandidateCard({ candidate }: CandidateCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: candidate.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing group",
        isDragging && "ring-2 ring-[#10B981] ring-offset-2 z-50 shadow-xl rotate-1 scale-105"
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <IDChip id={candidate.id} size="xs" />
        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]">
          {candidate.source}
        </span>
      </div>

      <h4 className="text-[#0F172A] text-sm font-semibold mb-1 group-hover:text-[#10B981] transition-colors">{candidate.name}</h4>
      <div className="text-[10px] font-mono text-[#94A3B8] mb-3">{candidate.jobId}</div>

      {candidate.score !== undefined && (
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-[#94A3B8] font-medium uppercase tracking-wider">Score</span>
            <span className={cn(
              "text-[10px] font-bold",
              candidate.score > 80 ? "text-[#10B981]" : candidate.score > 60 ? "text-amber-500" : "text-red-500"
            )}>
              {candidate.score}%
            </span>
          </div>
          <div className="h-1 bg-[#F1F5F9] rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-500",
                candidate.score > 80 ? "bg-[#10B981]" : candidate.score > 60 ? "bg-amber-500" : "bg-red-500"
              )}
              style={{ width: `${candidate.score}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-[#F1F5F9]">
        <div className="flex items-center gap-1.5 text-[#64748B]">
          <Calendar className="w-3 h-3" />
          <span className="text-[10px] font-medium">
            {candidate.nextInterviewDate ? `Next: ${candidate.nextInterviewDate}` : `D+${candidate.daysInStage}`}
          </span>
        </div>
        
        {candidate.assignee ? (
          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center border border-white shadow-sm" title={candidate.assignee.name}>
             {candidate.assignee.avatar ? (
               <img src={candidate.assignee.avatar} className="w-full h-full rounded-full" alt="" />
             ) : (
               <User className="w-3 h-3 text-blue-600" />
             )}
          </div>
        ) : (
          <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center border border-dashed border-gray-200">
             <User className="w-3 h-3 text-gray-300" />
          </div>
        )}
      </div>
    </div>
  );
}
