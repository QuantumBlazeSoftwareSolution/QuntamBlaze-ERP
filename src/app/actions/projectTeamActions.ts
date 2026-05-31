"use server";

import { db } from "@/lib/db";
import { projectTeam, employees, employeeRoles, projects } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { triggerRealtimeAlertAction } from "./notificationActions";

/**
 * Returns all active employees in the system.
 */
export async function getEmployeesAction() {
  try {
    const data = await db
      .select({
        id: employees.id,
        name: employees.name,
        email: employees.email,
        role: employees.role,
        employeeRole: employees.employeeRole,
        avatar: employees.avatar,
        status: employees.status,
        baseRole: employeeRoles.baseRole,
      })
      .from(employees)
      .leftJoin(employeeRoles, eq(employees.employeeRole, employeeRoles.code))
      .where(eq(employees.status, "Active"))
      .orderBy(employees.name);

    // Make sure baseRole defaults to "None" if null (due to left join / no matching role)
    const normalizedData = data.map((emp) => ({
      ...emp,
      baseRole: emp.baseRole || "None",
    }));

    return { success: true, employees: normalizedData };
  } catch (error: any) {
    console.error("Failed to fetch employees:", error);
    return { success: false, error: error.message || "Failed to fetch employees." };
  }
}

/**
 * Assigns an employee to a project under a specific role slot.
 * Enforces the exclusive 1-member rule for Project Manager (PM) and Tech Lead (TL) roles.
 */
export async function assignProjectMemberAction(
  projectId: string,
  employeeId: string,
  role: "PM" | "TL" | "Dev" | "QA" | "UI/UX"
) {
  try {
    // 1. Enforce exclusive slots for single-select roles
    if (role === "PM" || role === "TL") {
      await db
        .delete(projectTeam)
        .where(and(eq(projectTeam.projectId, projectId), eq(projectTeam.projectRole, role)));
    } else {
      // 2. For multi-select roles, check if this member is already assigned to this role on the project
      const existing = await db.query.projectTeam.findFirst({
        where: and(
          eq(projectTeam.projectId, projectId),
          eq(projectTeam.employeeId, employeeId),
          eq(projectTeam.projectRole, role)
        ),
      });
      if (existing) {
        return { success: true, message: "Member is already assigned to this role." };
      }
    }

    // 3. Insert the new assignment
    await db.insert(projectTeam).values({
      projectId,
      employeeId,
      projectRole: role,
    });

    // 3b. Trigger real-time alert and push notifications for the assigned employee
    try {
      const project = await db.query.projects.findFirst({
        where: eq(projects.id, projectId),
      });
      const projectName = project?.name || projectId;

      await triggerRealtimeAlertAction(employeeId, {
        type: "proposal",
        entityId: projectId,
        message: `New Assignment! You have been assigned as ${role} for project: ${projectName} (${projectId})`,
        url: `/dashboard/chat?projectId=${projectId}`,
      });
    } catch (notifErr) {
      console.error(`Failed to send dynamic assignment notification to employee ${employeeId}:`, notifErr);
    }

    // 4. Revalidate paths to trigger dynamic server-side update
    revalidatePath(`/dashboard/projects/${projectId}`);
    revalidatePath("/projects");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error: any) {
    console.error("Failed to assign project member:", error);
    return { success: false, error: error.message || "Failed to assign project member." };
  }
}

/**
 * Removes an employee from a project role slot.
 */
export async function removeProjectMemberAction(
  projectId: string,
  employeeId: string,
  role: "PM" | "TL" | "Dev" | "QA" | "UI/UX"
) {
  try {
    await db
      .delete(projectTeam)
      .where(
        and(
          eq(projectTeam.projectId, projectId),
          eq(projectTeam.employeeId, employeeId),
          eq(projectTeam.projectRole, role)
        )
      );

    // Revalidate paths
    revalidatePath(`/dashboard/projects/${projectId}`);
    revalidatePath("/projects");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error: any) {
    console.error("Failed to remove project member:", error);
    return { success: false, error: error.message || "Failed to remove project member." };
  }
}
