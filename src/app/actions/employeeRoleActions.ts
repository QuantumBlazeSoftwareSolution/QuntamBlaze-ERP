"use server";

import { employeeRolesCrud } from "@/lib/db/crud/employeeRoles";
import { revalidatePath } from "next/cache";

export async function getEmployeeRolesAction() {
  try {
    const roles = await employeeRolesCrud.getAll();
    return { success: true, roles };
  } catch (error: any) {
    console.error("Failed to fetch employee roles:", error);
    return { success: false, error: error.message || "Failed to fetch employee roles." };
  }
}

export async function createEmployeeRoleAction(data: {
  name: string;
  code: string;
  description?: string;
  baseRole: string;
}) {
  try {
    const { name, code, description, baseRole } = data;
    if (!name || !code) {
      return { success: false, error: "Name and Code are required." };
    }

    const id = code.toLowerCase().replace(/[^a-z0-9]/g, "-");

    await employeeRolesCrud.create({
      id,
      name,
      code: code.toUpperCase(),
      description,
      baseRole,
    });

    revalidatePath("/dashboard/hr/roles");
    revalidatePath("/dashboard/hr/employees");

    return { success: true };
  } catch (error: any) {
    console.error("Failed to create employee role:", error);
    if (error.code === "23505") {
      return { success: false, error: "A role with this code already exists." };
    }
    return { success: false, error: error.message || "Failed to create employee role." };
  }
}

export async function updateEmployeeRoleAction(
  id: string,
  data: {
    name?: string;
    description?: string;
    baseRole?: string;
  }
) {
  try {
    await employeeRolesCrud.update(id, data);


    revalidatePath("/dashboard/hr/roles");
    revalidatePath("/dashboard/hr/employees");

    return { success: true };
  } catch (error: any) {
    console.error("Failed to update employee role:", error);
    return { success: false, error: error.message || "Failed to update employee role." };
  }
}

export async function deleteEmployeeRoleAction(id: string) {
  try {
    await employeeRolesCrud.delete(id);

    revalidatePath("/dashboard/hr/roles");
    revalidatePath("/dashboard/hr/employees");

    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete employee role:", error);
    return { success: false, error: error.message || "Failed to delete employee role." };
  }
}
