"use server";

import { db } from "@/lib/db";
import { projects, projectTeam, employees, clients } from "@/lib/db/schema";
import { incrementAndGet, previewNextSequence } from "@/lib/db/idTracker";
import { generateNextId } from "@/lib/idEngine";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { logAction } from "@/lib/logger";
import { projectSchema, ProjectFormData } from "@/lib/schemas/projectSchema";

export async function previewProjectIdAction(clientName: string) {
  if (!clientName || clientName.trim() === "") {
    return "PRJ-NEW-26-0001";
  }

  // Same logic as in generateProjectId / generateNextId
  let abbr = clientName
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 4)
    .toUpperCase();
  if (abbr.length === 0) {
    abbr = "NEWX";
  } else if (abbr.length < 4) {
    abbr = abbr.padEnd(4, "X");
  }

  // Get project counter sequence preview
  const nextSeq = await previewNextSequence("PROJECT");

  // Format the ID using our idEngine
  return generateNextId("PRJ", nextSeq, { compAbbr: abbr });
}

export async function createProjectAction(data: ProjectFormData) {
  try {
    // 1. Validate payload
    const parsed = projectSchema.parse(data);

    // 2. Fetch the client company name to construct the project ID abbreviation
    const client = await db.query.clients.findFirst({
      where: eq(clients.id, parsed.clientId),
    });

    const clientName = client?.name || "CORP";
    let abbr = clientName
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, 4)
      .toUpperCase();
    if (abbr.length === 0) abbr = "NEWX";
    else if (abbr.length < 4) abbr = abbr.padEnd(4, "X");

    // 3. Get the transaction-safe sequence ID
    const nextSeq = await incrementAndGet("PROJECT", "PRJ");

    // 4. Generate the final project ID
    const projectId = generateNextId("PRJ", nextSeq, { compAbbr: abbr });

    // 5. Insert into projects table
    await db.insert(projects).values({
      id: projectId,
      name: parsed.name.trim(),
      clientId: parsed.clientId,
      startDate: parsed.startDate ? new Date(parsed.startDate) : null,
      deadline: parsed.deadline ? new Date(parsed.deadline) : null,
      progress: 0,
      budget: parsed.budget.toString(),
      status: "Active",
      description: parsed.description,
    });

    // 6. Insert team members into project_team table, ensuring employees exist
    if (parsed.teamMembers && parsed.teamMembers.length > 0) {
      for (const empId of parsed.teamMembers) {
        // Ensure the employee exists in the employees table to satisfy foreign key constraints
        const existingEmployee = await db.query.employees.findFirst({
          where: eq(employees.id, empId),
        });

        if (!existingEmployee) {
          // If a mock team member ID doesn't exist yet, insert a placeholder record
          let name = "Assigned Team Member";
          if (empId === "USR-JD-01") name = "John Doe";
          else if (empId === "USR-AL-02") name = "Alice Lee";
          else if (empId === "USR-MK-03") name = "Mike King";

          await db.insert(employees).values({
            id: empId,
            name,
            email: `${empId.toLowerCase()}@quantumblaze.com`,
            status: "Active",
          });
        }

        // Insert team association
        await db.insert(projectTeam).values({
          projectId,
          employeeId: empId,
        });
      }
    }

    // 7. Log the action using logAction centralized logger
    await logAction(projectId, "PROJECT", {
      actionName: "CREATE_PROJECT",
      actor: "System Admin",
      description: `Initiated new project: ${parsed.name} (${projectId})`,
      time: new Date().toISOString(),
      previousValue: null,
      newValue: {
        id: projectId,
        name: parsed.name,
        clientId: parsed.clientId,
        startDate: parsed.startDate,
        deadline: parsed.deadline,
        budget: parsed.budget,
        teamMembers: parsed.teamMembers,
        description: parsed.description,
        status: "Active",
      },
    });

    // Revalidate paths
    revalidatePath("/projects");
    revalidatePath("/dashboard");

    return { success: true, projectId };
  } catch (error: any) {
    console.error("Failed to create project:", error);
    return { success: false, error: error.message || "Database error while initiating project." };
  }
}
