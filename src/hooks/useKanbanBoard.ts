"use client";

import { useState, useCallback } from "react";
import { KanbanBoardState, KanbanTask, KanbanColumnType, TaskStatus } from "@/types/kanban";
import { arrayMove } from "@dnd-kit/sortable";
import { DragEndEvent, DragOverEvent } from "@dnd-kit/core";

const INITIAL_COLUMNS: KanbanColumnType[] = [
  { id: "Backlog", title: "Backlog", accentColor: "border-slate-200" },
  { id: "In Progress", title: "In Progress", accentColor: "border-emerald-500" },
  { id: "Review", title: "Review", accentColor: "border-amber-500" },
  { id: "Done", title: "Done", accentColor: "border-blue-500" },
];

const INITIAL_TASKS: KanbanTask[] = [
  {
    id: "TSK-PRJ-GOOG-26-005-01",
    title: "Cloud Infrastructure Audit",
    priority: "Critical",
    assignees: [{ initials: "JD", color: "bg-emerald-500" }],
    dueDate: "2026-05-12",
    subTasksDone: 8,
    subTasksTotal: 12,
    columnId: "In Progress",
  },
  {
    id: "TSK-PRJ-GOOG-26-005-02",
    title: "Security Protocol Definition",
    priority: "High",
    assignees: [{ initials: "AL", color: "bg-blue-500" }],
    dueDate: "2026-05-15",
    subTasksDone: 3,
    subTasksTotal: 5,
    columnId: "Backlog",
  },
  {
    id: "TSK-PRJ-GOOG-26-005-03",
    title: "Network Topology Mapping",
    priority: "Medium",
    assignees: [{ initials: "MK", color: "bg-amber-500" }],
    dueDate: "2026-05-10", // Overdue
    subTasksDone: 2,
    subTasksTotal: 10,
    columnId: "Review",
  },
  {
    id: "TSK-PRJ-GOOG-26-005-04",
    title: "API Gateway Configuration",
    priority: "High",
    assignees: [
      { initials: "JD", color: "bg-emerald-500" },
      { initials: "AL", color: "bg-blue-500" },
    ],
    dueDate: "2026-05-20",
    subTasksDone: 0,
    subTasksTotal: 4,
    columnId: "In Progress",
  },
  {
    id: "TSK-PRJ-GOOG-26-005-05",
    title: "Data Migration Script",
    priority: "Low",
    assignees: [{ initials: "MK", color: "bg-amber-500" }],
    dueDate: "2026-05-25",
    subTasksDone: 0,
    subTasksTotal: 8,
    columnId: "Backlog",
  },
];

export function useKanbanBoard() {
  const [board, setBoard] = useState<KanbanBoardState>({
    columns: INITIAL_COLUMNS,
    tasks: INITIAL_TASKS,
  });

  const [activeTask, setActiveTask] = useState<KanbanTask | null>(null);

  const handleDragStart = useCallback(
    (event: any) => {
      const { active } = event;
      const task = board.tasks.find((t) => t.id === active.id);
      if (task) setActiveTask(task);
    },
    [board.tasks]
  );

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    // Dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setBoard((prev) => {
        const activeIndex = prev.tasks.findIndex((t) => t.id === activeId);
        const overIndex = prev.tasks.findIndex((t) => t.id === overId);

        if (prev.tasks[activeIndex].columnId !== prev.tasks[overIndex].columnId) {
          const newTasks = [...prev.tasks];
          newTasks[activeIndex] = {
            ...newTasks[activeIndex],
            columnId: prev.tasks[overIndex].columnId,
          };
          return { ...prev, tasks: arrayMove(newTasks, activeIndex, overIndex) };
        }

        return { ...prev, tasks: arrayMove(prev.tasks, activeIndex, overIndex) };
      });
    }

    // Dropping a Task over a Column
    const isOverAColumn = over.data.current?.type === "Column";
    if (isActiveATask && isOverAColumn) {
      setBoard((prev) => {
        const activeIndex = prev.tasks.findIndex((t) => t.id === activeId);
        const newTasks = [...prev.tasks];
        newTasks[activeIndex] = {
          ...newTasks[activeIndex],
          columnId: overId as string,
        };
        return { ...prev, tasks: newTasks };
      });
    }
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    // Final reorder logic if needed (already handled by dragOver for tasks)
  }, []);

  return {
    board,
    activeTask,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
}
