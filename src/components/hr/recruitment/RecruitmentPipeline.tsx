"use client";

import React, { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects,
  useDroppable,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Candidate, PipelineStage } from "@/types/hr";
import { CandidateCard } from "./CandidateCard";
import { cn } from "@/lib/utils";
import { updateCandidateStageAction } from "@/app/actions/hrActions";

interface RecruitmentPipelineProps {
  candidates: Candidate[];
}

const STAGES: PipelineStage[] = [
  "Applied",
  "Screening",
  "Technical",
  "Final",
  "Offer",
  "Hired",
  "Rejected",
];

const STAGE_COLORS: Record<string, string> = {
  Applied: "bg-slate-400",
  Screening: "bg-blue-500",
  Technical: "bg-violet-500",
  Final: "bg-amber-500",
  Offer: "bg-green-500",
  Hired: "bg-emerald-600",
  Rejected: "bg-red-500",
};

export function RecruitmentPipeline({ candidates: initialCandidates }: RecruitmentPipelineProps) {
  const [candidates, setCandidates] = useState(initialCandidates);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Sync state with parent props on live DB refresh
  React.useEffect(() => {
    setCandidates(initialCandidates);
  }, [initialCandidates]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeCandidate = candidates.find((c) => c.id === active.id);
    if (!activeCandidate) return;

    // Find if we are dragging over a stage (column) or another card
    const overId = over.id as string;
    const isStage = STAGES.includes(overId as PipelineStage);

    let newStage: PipelineStage;

    if (isStage) {
      newStage = overId as PipelineStage;
    } else {
      const overCandidate = candidates.find((c) => c.id === overId);
      if (!overCandidate) return;
      newStage = overCandidate.currentStage;
    }

    if (activeCandidate.currentStage !== newStage) {
      setCandidates((prev) =>
        prev.map((c) => (c.id === active.id ? { ...c, currentStage: newStage } : c))
      );
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeCandidate = candidates.find((c) => c.id === active.id);
    if (activeCandidate) {
      // Persist the stage update dynamically in the PostgreSQL database!
      updateCandidateStageAction(activeCandidate.id, activeCandidate.currentStage).then((res) => {
        if (!res.success) {
          console.error("Failed to persist pipeline stage in DB:", res.error);
        }
      });
    }

    if (active.id !== over.id) {
      const overCandidate = candidates.find((c) => c.id === over.id);

      if (
        activeCandidate &&
        overCandidate &&
        activeCandidate.currentStage === overCandidate.currentStage
      ) {
        const oldIndex = candidates.findIndex((c) => c.id === active.id);
        const newIndex = candidates.findIndex((c) => c.id === over.id);
        setCandidates(arrayMove(candidates, oldIndex, newIndex));
      }
    }
  };

  const activeCandidate = activeId ? candidates.find((c) => c.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 overflow-x-auto pb-8 h-[calc(100vh-250px)] min-h-[600px] scrollbar-hide">
        {STAGES.map((stage) => {
          const stageCandidates = candidates.filter((c) => c.currentStage === stage);

          return (
            <div key={stage} className="flex flex-col min-w-[280px] max-w-[280px] h-full">
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", STAGE_COLORS[stage])} />
                  <h3 className="text-[#0F172A] font-bold text-sm tracking-tight">{stage}</h3>
                </div>
                <span className="bg-[#F1F5F9] text-[#64748B] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#E2E8F0]">
                  {stageCandidates.length}
                </span>
              </div>

              {/* Column Content */}
              <PipelineColumn stage={stage}>
                <SortableContext
                  id={stage}
                  items={stageCandidates.map((c) => c.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {stageCandidates.map((candidate) => (
                    <CandidateCard key={candidate.id} candidate={candidate} />
                  ))}
                </SortableContext>

                {stageCandidates.length === 0 && (
                  <div className="h-24 flex flex-col items-center justify-center border-2 border-dashed border-[#E2E8F0] rounded-xl text-[#94A3B8] bg-[#F8FAFC]/50">
                    <span className="text-[11px] font-bold">Drop here</span>
                  </div>
                )}
              </PipelineColumn>
            </div>
          );
        })}
      </div>

      <DragOverlay
        dropAnimation={{
          sideEffects: defaultDropAnimationSideEffects({
            styles: {
              active: {
                opacity: "0.5",
              },
            },
          }),
        }}
      >
        {activeCandidate ? <CandidateCard candidate={activeCandidate} /> : null}
      </DragOverlay>
    </DndContext>
  );
}

function PipelineColumn({
  stage,
  children,
}: {
  stage: PipelineStage;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex-1 bg-white/50 border border-[#E2E8F0] rounded-xl p-3 space-y-3 overflow-y-auto scrollbar-hide transition-all duration-200 min-h-[200px] flex flex-col justify-start",
        isOver && "bg-slate-50 border-slate-300 ring-2 ring-[#10B981]/10 shadow-inner",
        stage === "Hired" && "bg-emerald-50/30 border-emerald-100",
        stage === "Rejected" && "bg-slate-50/50"
      )}
    >
      {children}
    </div>
  );
}
