import { employeesCrud } from "@/lib/db/crud/employees";
import { EmployeeDirectoryClient } from "@/components/hr/employees/EmployeeDirectoryClient";

export default async function EmployeeDirectoryPage() {
  const employees = await employeesCrud.getAll();

  return <EmployeeDirectoryClient employees={employees} />;
}
