"use client";

import { useState, useCallback } from "react";
import { DragEndEvent, DragStartEvent, DragOverEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { KanbanBoardState, KanbanTask } from "@/types/kanban";

const INITIAL_BOARD: KanbanBoardState = {
  columns: [
    { id: "backlog", title: "Backlog", accentColor: "text-[#3A3A3A]" },
    { id: "in-progress", title: "In Progress", accentColor: "text-accent" },
    { id: "review", title: "Review", accentColor: "text-warning" },
    { id: "done", title: "Done", accentColor: "text-success" },
  ],
  tasks: [
    {
      id: "TSK-PRJ-GOOG-26-001-01",
      title: "Audit legacy cluster topology",
      priority: "Critical",
      assignees: [
        { initials: "JD", color: "bg-accent/20 text-accent" },
        { initials: "AL", color: "bg-success/20 text-success" },
      ],
      dueDate: "2026-02-15",
      subTasksDone: 3,
      subTasksTotal: 5,
      columnId: "done",
    },
    {
      id: "TSK-PRJ-GOOG-26-001-02",
      title: "Design multi-region VPC layout",
      priority: "High",
      assignees: [{ initials: "MK", color: "bg-warning/20 text-warning" }],
      dueDate: "2026-03-20",
      subTasksDone: 2,
      subTasksTotal: 4,
      columnId: "done",
    },
    {
      id: "TSK-PRJ-GOOG-26-001-03",
      title: "Migrate core services to K8s",
      priority: "Critical",
      assignees: [
        { initials: "JD", color: "bg-accent/20 text-accent" },
        { initials: "SR", color: "bg-danger/20 text-danger" },
      ],
      dueDate: "2026-05-01",
      subTasksDone: 5,
      subTasksTotal: 8,
      columnId: "in-progress",
    },
    {
      id: "TSK-PRJ-GOOG-26-001-04",
      title: "Set up CI/CD pipeline",
      priority: "High",
      assignees: [{ initials: "TC", color: "bg-pink-500/20 text-pink-400" }],
      dueDate: "2026-04-10",
      subTasksDone: 1,
      subTasksTotal: 3,
      columnId: "in-progress",
    },
    {
      id: "TSK-PRJ-GOOG-26-001-05",
      title: "Database schema migration scripts",
      priority: "High",
      assignees: [{ initials: "AL", color: "bg-success/20 text-success" }],
      dueDate: "2026-05-15",
      subTasksDone: 2,
      subTasksTotal: 6,
      columnId: "in-progress",
    },
    {
      id: "TSK-PRJ-GOOG-26-001-06",
      title: "Load balancer configuration review",
      priority: "Medium",
      assignees: [{ initials: "MK", color: "bg-warning/20 text-warning" }],
      dueDate: "2026-06-01",
      subTasksDone: 0,
      subTasksTotal: 2,
      columnId: "review",
    },
    {
      id: "TSK-PRJ-GOOG-26-001-07",
      title: "Security audit — IAM policies",
      priority: "Critical",
      assignees: [
        { initials: "JD", color: "bg-accent/20 text-accent" },
        { initials: "VP", color: "bg-purple-500/20 text-purple-400" },
      ],
      dueDate: "2026-04-05",
      subTasksDone: 4,
      subTasksTotal: 4,
      columnId: "review",
    },
    {
      id: "TSK-PRJ-GOOG-26-001-08",
      title: "Performance benchmark baseline",
      priority: "Medium",
      assignees: [{ initials: "SR", color: "bg-danger/20 text-danger" }],
      dueDate: "2026-07-01",
      subTasksDone: 0,
      subTasksTotal: 3,
      columnId: "backlog",
    },
    {
      id: "TSK-PRJ-GOOG-26-001-09",
      title: "Disaster recovery runbooks",
      priority: "Low",
      assignees: [{ initials: "TC", color: "bg-pink-500/20 text-pink-400" }],
      dueDate: "2026-08-15",
      subTasksDone: 0,
      subTasksTotal: 5,
      columnId: "backlog",
    },
    {
      id: "TSK-PRJ-GOOG-26-001-10",
      title: "Stakeholder training sessions",
      priority: "Low",
      assignees: [{ initials: "AL", color: "bg-success/20 text-success" }],
      dueDate: "2026-09-30",
      subTasksDone: 0,
      subTasksTotal: 2,
      columnId: "backlog",
    },
  ],
};

export function useKanbanBoard(prjId: string) {
  const [board, setBoard] = useState<KanbanBoardState>(INITIAL_BOARD);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [overColumnId, setOverColumnId] = useState<string | null>(null);

  const activeTask = board.tasks.find((t) => t.id === activeTaskId) ?? null;

  const onDragStart = useCallback(({ active }: DragStartEvent) => {
    setActiveTaskId(active.id as string);
  }, []);

  const onDragOver = useCallback(
    ({ over }: DragOverEvent) => {
      if (!over) { setOverColumnId(null); return; }

      const overId = over.id as string;
      const isOverColumn = board.columns.some((c) => c.id === overId);
      if (isOverColumn) {
        setOverColumnId(overId);
      } else {
        // over is a task — find its column
        const overTask = board.tasks.find((t) => t.id === overId);
        setOverColumnId(overTask?.columnId ?? null);
      }
    },
    [board]
  );

  const onDragEnd = useCallback(
    ({ over, active: draggedActive }: DragEndEvent) => {
      setActiveTaskId(null);
      setOverColumnId(null);
      if (!over) return;

      const activeId = draggedActive.id as string;
      const overId = over.id as string;

      setBoard((prev) => {
        const tasks = [...prev.tasks];
        const activeIdx = tasks.findIndex((t) => t.id === activeId);
        if (activeIdx === -1) return prev;

        const isOverColumn = prev.columns.some((c) => c.id === overId);

        if (isOverColumn) {
          // Drop onto column directly
          tasks[activeIdx] = { ...tasks[activeIdx], columnId: overId };
          return { ...prev, tasks };
        }

        // Drop onto another task
        const overIdx = tasks.findIndex((t) => t.id === overId);
        if (overIdx === -1) return prev;

        const overColumnId = tasks[overIdx].columnId;
        tasks[activeIdx] = { ...tasks[activeIdx], columnId: overColumnId };
        return { ...prev, tasks: arrayMove(tasks, activeIdx, overIdx) };
      });
    },
    []
  );

  const addTask = useCallback((columnId: string) => {
    const seq = String(board.tasks.length + 1).padStart(2, "0");
    const newTask: KanbanTask = {
      id: `TSK-${prjId}-${seq}`,
      title: "New Task",
      priority: "Medium",
      assignees: [],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      subTasksDone: 0,
      subTasksTotal: 0,
      columnId,
    };
    setBoard((prev) => ({ ...prev, tasks: [...prev.tasks, newTask] }));
  }, [board.tasks, prjId]);

  return {
    board,
    activeTask,
    activeTaskId,
    overColumnId,
    onDragStart,
    onDragOver,
    onDragEnd,
    addTask,
  };
}
