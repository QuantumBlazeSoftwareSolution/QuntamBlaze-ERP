import { notFound } from "next/navigation";
import { employeesCrud } from "@/lib/db/crud/employees";
import { EmployeeProfileClient } from "@/components/hr/employees/EmployeeProfileClient";
import { db } from "@/lib/db";
import { departments } from "@/lib/db/schema";

export default async function EmployeeProfilePage({
  params,
}: {
  params: Promise<{ empId: string }>;
}) {
  const { empId } = await params;
  const employee = await employeesCrud.getById(empId);
  const allDepartments = await db.select().from(departments);

  if (!employee) {
    notFound();
  }

  return <EmployeeProfileClient employee={employee} departments={allDepartments} />;
}
