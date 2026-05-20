"use server";

import { employeesCrud } from "@/lib/db/crud/employees";
import { revalidatePath } from "next/cache";

import { incrementAndGet } from "@/lib/db/idTracker";

export async function createEmployeeAction(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nic: string;
  role: string;
  employeeRole: string;
  department: string;
}) {
  try {
    const { firstName, lastName, email, phone, nic, role, employeeRole, department } = data;

    if (!firstName || !lastName || !email) {
      return { success: false, error: "First Name, Last Name, and Email are required." };
    }

    const name = `${firstName} ${lastName}`;
    
    // Generate formatted ID: EMP-DEPT-YY-SEQ
    const deptCode = department.toUpperCase().replace(/[^A-Z]/g, "").substring(0, 3) || "GEN";
    const year = new Date().getFullYear().toString().substring(2);
    
    const seq = await incrementAndGet(`EMP_${deptCode}_${year}`, `EMP-${deptCode}-${year}`);
    const id = `EMP-${deptCode}-${year}-${seq.toString().padStart(3, "0")}`;

    await employeesCrud.create({
      id,
      firstName,
      lastName,
      name,
      email,
      phone,
      nic,
      role,
      employeeRole,
      department,
      status: "Active",
      joinDate: new Date(),
    });

    revalidatePath("/dashboard/hr/employees");
    return { success: true, employeeId: id };
  } catch (error: any) {
    console.error("Failed to create employee:", error);
    // Handle unique constraint violations
    if (error.code === "23505") {
      return { success: false, error: "An employee with this email already exists." };
    }
    return { success: false, error: error.message || "Failed to add new employee." };
  }
}

export async function updateEmployeeAction(
  id: string,
  data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    nic: string;
    role: string;
    employeeRole: string;
    department: string;
    status?: string;
    address?: string;
    birthDate?: string | Date | null;
    joinDate?: string | Date | null;
  }
) {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      nic,
      role,
      employeeRole,
      department,
      status,
      address,
      birthDate,
      joinDate,
    } = data;

    if (!id) {
      return { success: false, error: "Employee ID is required." };
    }

    if (!firstName || !lastName || !email) {
      return { success: false, error: "First Name, Last Name, and Email are required." };
    }

    const name = `${firstName} ${lastName}`;

    // Calculate dynamic profile health score based on completeness of 10 fields
    const healthFields = [
      firstName,
      lastName,
      email,
      phone,
      nic,
      role,
      employeeRole,
      department,
      address,
      birthDate,
    ];
    const filledCount = healthFields.filter(
      (f) => f !== undefined && f !== null && String(f).trim() !== ""
    ).length;
    const profileHealth = Math.round((filledCount / healthFields.length) * 100);

    // Format dates safely if present
    const formattedBirthDate = birthDate ? new Date(birthDate) : null;
    const formattedJoinDate = joinDate ? new Date(joinDate) : null;

    await employeesCrud.update(id, {
      firstName,
      lastName,
      name,
      email,
      phone,
      nic,
      role,
      employeeRole,
      department,
      status: status || "Active",
      address: address || null,
      birthDate: formattedBirthDate,
      joinDate: formattedJoinDate,
      profileHealth,
    });

    revalidatePath("/dashboard/hr/employees");
    revalidatePath(`/dashboard/hr/employees/${id}`);

    return { success: true };
  } catch (error: any) {
    console.error("Failed to update employee:", error);
    if (error.code === "23505") {
      return { success: false, error: "An employee with this email already exists." };
    }
    return { success: false, error: error.message || "Failed to update employee profile." };
  }
}

