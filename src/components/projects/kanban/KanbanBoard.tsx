"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
} from "@dnd-kit/core";
import { useKanbanBoard } from "@/hooks/useKanbanBoard";
import { useKanbanSensors, kanbanCollisionDetection } from "@/lib/kanban/dndConfig";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanCard } from "./KanbanCard";
import { KanbanFilterBar } from "./KanbanFilterBar";

interface KanbanBoardProps {
  prjId: string;
}

export function KanbanBoard({ prjId }: KanbanBoardProps) {
  const sensors = useKanbanSensors();
  const {
    board,
    activeTask,
    activeTaskId,
    overColumnId,
    onDragStart,
    onDragOver,
    onDragEnd,
    addTask,
  } = useKanbanBoard(prjId);

  const [priorityFilter, setPriorityFilter] = useState("");

  const getColumnTasks = (columnId: string) => {
    return board.tasks.filter(
      (t) =>
        t.columnId === columnId &&
        (priorityFilter === "" || t.priority === priorityFilter)
    );
  };

  return (
    <div className="bg-[#050505] rounded-xl">
      <KanbanFilterBar
        selectedPriority={priorityFilter}
        onPriorityChange={setPriorityFilter}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={kanbanCollisionDetection}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        {/* Board Columns */}
        <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
          {board.columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={getColumnTasks(column.id)}
              isOver={overColumnId === column.id}
              activeTaskId={activeTaskId}
              onAddTask={() => addTask(column.id)}
            />
          ))}
        </div>

        {/* Drag Overlay — floating card while dragging */}
        <DragOverlay>
          {activeTask ? (
            <KanbanCard task={activeTask} isOverlay />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
