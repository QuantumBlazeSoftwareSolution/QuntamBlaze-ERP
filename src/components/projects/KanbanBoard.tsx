"use client";

import React from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useKanbanBoard } from "@/hooks/useKanbanBoard";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanCard } from "./KanbanCard";
import { KanbanFilterBar } from "./KanbanFilterBar";
import { createPortal } from "react-dom";

export function KanbanBoard() {
  const { board, activeTask, handleDragStart, handleDragOver, handleDragEnd } = useKanbanBoard();

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    })
  );

  return (
    <div className="flex flex-col h-full">
      <KanbanFilterBar />

      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4 custom-scrollbar">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-5 min-h-[500px]">
            {board.columns.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                tasks={board.tasks.filter((t) => t.columnId === column.id)}
              />
            ))}
          </div>

          {typeof document !== "undefined" &&
            createPortal(
              <DragOverlay
                dropAnimation={{
                  duration: 250,
                  easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
                }}
              >
                {activeTask ? (
                  <div className="rotate-1 scale-105 shadow-2xl">
                    <KanbanCard task={activeTask} isOverlay />
                  </div>
                ) : null}
              </DragOverlay>,
              document.body
            )}
        </DndContext>
      </div>
    </div>
  );
}
