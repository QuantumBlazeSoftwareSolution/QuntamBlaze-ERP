"use server";

import { db } from "@/lib/db";
import { personalTasks } from "@/lib/db/schema/personalTasks";
import { eq, and } from "drizzle-orm";
import { getCurrentSessionAction } from "./auth";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface PersonalTaskData {
  title: string;
  description?: string | null;
  priority: "Low" | "Medium" | "High";
  status: "Todo" | "In Progress" | "Completed";
  dueDate?: string | null; // ISO Date String
  checklist: ChecklistItem[];
}

/**
 * Fetch all personal tasks for the currently signed-in user.
 */
export async function getPersonalTasksAction() {
  try {
    const session = await getCurrentSessionAction();
    if (!session || !session.userId) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    const tasks = await db
      .select()
      .from(personalTasks)
      .where(eq(personalTasks.userId, session.userId));

    // Sort tasks: Incomplete tasks first, then by priority, then by createdAt desc
    const priorityWeight = { High: 3, Medium: 2, Low: 1 };
    const sortedTasks = tasks.sort((a, b) => {
      // 1. Completed state comparison (Todo/In Progress vs Completed)
      const aDone = a.status === "Completed" ? 1 : 0;
      const bDone = b.status === "Completed" ? 1 : 0;
      if (aDone !== bDone) return aDone - bDone;

      // 2. Priority comparison
      const aWeight = priorityWeight[a.priority as keyof typeof priorityWeight] || 2;
      const bWeight = priorityWeight[b.priority as keyof typeof priorityWeight] || 2;
      if (aWeight !== bWeight) return bWeight - aWeight; // Descending order of priority

      // 3. Date comparison
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return { success: true, tasks: sortedTasks };
  } catch (error: any) {
    console.error("[QB-PERSONAL-TASKS] Failed to get personal tasks:", error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
}

/**
 * Create a new personal task.
 */
export async function createPersonalTaskAction(data: PersonalTaskData) {
  try {
    const session = await getCurrentSessionAction();
    if (!session || !session.userId) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    if (!data.title.trim()) {
      return { success: false, error: "Task title is required." };
    }

    const taskId = `TSK-PR-${uuidv4().substring(0, 8).toUpperCase()}`;

    await db.insert(personalTasks).values({
      id: taskId,
      userId: session.userId,
      title: data.title,
      description: data.description || null,
      priority: data.priority,
      status: data.status,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      checklist: data.checklist,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    revalidatePath("/dashboard/profile");
    return { success: true, taskId };
  } catch (error: any) {
    console.error("[QB-PERSONAL-TASKS] Failed to create personal task:", error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
}

/**
 * Update an existing personal task.
 */
export async function updatePersonalTaskAction(id: string, data: Partial<PersonalTaskData>) {
  try {
    const session = await getCurrentSessionAction();
    if (!session || !session.userId) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    // 1. Confirm ownership
    const taskResult = await db
      .select()
      .from(personalTasks)
      .where(and(eq(personalTasks.id, id), eq(personalTasks.userId, session.userId)));

    if (taskResult.length === 0) {
      return { success: false, error: "Task not found or access denied." };
    }

    const updateFields: any = {
      updatedAt: new Date(),
    };

    if (data.title !== undefined) {
      if (!data.title.trim()) return { success: false, error: "Task title cannot be empty." };
      updateFields.title = data.title;
    }
    if (data.description !== undefined) updateFields.description = data.description;
    if (data.priority !== undefined) updateFields.priority = data.priority;
    if (data.status !== undefined) updateFields.status = data.status;
    if (data.dueDate !== undefined)
      updateFields.dueDate = data.dueDate ? new Date(data.dueDate) : null;
    if (data.checklist !== undefined) updateFields.checklist = data.checklist;

    await db.update(personalTasks).set(updateFields).where(eq(personalTasks.id, id));

    revalidatePath("/dashboard/profile");
    return { success: true };
  } catch (error: any) {
    console.error("[QB-PERSONAL-TASKS] Failed to update personal task:", error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
}

/**
 * Delete a personal task.
 */
export async function deletePersonalTaskAction(id: string) {
  try {
    const session = await getCurrentSessionAction();
    if (!session || !session.userId) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    // 1. Confirm ownership
    const taskResult = await db
      .select()
      .from(personalTasks)
      .where(and(eq(personalTasks.id, id), eq(personalTasks.userId, session.userId)));

    if (taskResult.length === 0) {
      return { success: false, error: "Task not found or access denied." };
    }

    await db.delete(personalTasks).where(eq(personalTasks.id, id));

    revalidatePath("/dashboard/profile");
    return { success: true };
  } catch (error: any) {
    console.error("[QB-PERSONAL-TASKS] Failed to delete personal task:", error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
}
