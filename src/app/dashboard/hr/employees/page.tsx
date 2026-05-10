import { employeesCrud } from "@/lib/db/crud/employees";
import { EmployeeDirectoryClient } from "@/components/hr/employees/EmployeeDirectoryClient";

export default async function EmployeeDirectoryPage() {
  const allEmployees = await employeesCrud.getAll();

  const formattedEmployees = allEmployees.map((e: any) => ({
    ...e,
    joiningDate: e.joiningDate ? new Date(e.joiningDate).toLocaleDateString() : "-",
    dateOfBirth: e.dateOfBirth ? new Date(e.dateOfBirth).toLocaleDateString() : "-",
  }));

  return <EmployeeDirectoryClient employees={formattedEmployees} />;
}
