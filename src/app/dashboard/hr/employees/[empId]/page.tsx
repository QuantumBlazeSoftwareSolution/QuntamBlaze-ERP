import { notFound } from "next/navigation";
import { employeesCrud } from "@/lib/db/crud/employees";
import { EmployeeProfileClient } from "@/components/hr/employees/EmployeeProfileClient";

export default async function EmployeeProfilePage({
  params,
}: {
  params: Promise<{ empId: string }>;
}) {
  const { empId } = await params;
  const employee = await employeesCrud.getById(empId);

  if (!employee) {
    notFound();
  }

  return <EmployeeProfileClient employee={employee} />;
}
