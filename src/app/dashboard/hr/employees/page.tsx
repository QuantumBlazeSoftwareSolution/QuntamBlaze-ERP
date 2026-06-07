import { employeesCrud } from "@/lib/db/crud/employees";
import { EmployeeDirectoryClient } from "@/components/hr/employees/EmployeeDirectoryClient";
import { db } from "@/lib/db";
import { departments } from "@/lib/db/schema";

export default async function EmployeeDirectoryPage() {
  const allEmployees = await employeesCrud.getAll();
  const allDepartments = await db.select().from(departments).orderBy(departments.name);

  const formattedEmployees = allEmployees.map((e: any) => ({
    ...e,
    joiningDate: e.joiningDate ? new Date(e.joiningDate).toLocaleDateString() : "-",
    dateOfBirth: e.dateOfBirth ? new Date(e.dateOfBirth).toLocaleDateString() : "-",
  }));

  return <EmployeeDirectoryClient employees={formattedEmployees} departments={allDepartments} />;
}
