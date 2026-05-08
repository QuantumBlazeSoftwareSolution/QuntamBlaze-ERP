"use client";

import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SectionNavItem } from "./SectionNavItem";
import { ProposalSection } from "@/types/proposal";

interface ProposalSectionNavProps {
  sections: ProposalSection[];
  activeSectionId: string;
  onSectionClick: (id: string) => void;
  onReorder: (newSections: ProposalSection[]) => void;
}

export function ProposalSectionNav({ 
  sections, 
  activeSectionId, 
  onSectionClick, 
  onReorder 
}: ProposalSectionNavProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);
      onReorder(arrayMove(sections, oldIndex, newIndex));
    }
  };

  return (
    <div className="w-[260px] border-r border-border p-6 bg-bg-card/20 overflow-y-auto">
      <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-[0.2em] mb-6">Section Navigator</h3>
      
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={sections.map(s => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-1">
            {sections.map((section) => (
              <SectionNavItem
                key={section.id}
                id={section.id}
                type={section.type}
                label={section.title}
                isActive={activeSectionId === section.id}
                onClick={() => onSectionClick(section.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
