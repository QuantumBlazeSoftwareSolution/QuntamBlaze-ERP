import { employeeRolesCrud } from "@/lib/db/crud/employeeRoles";
import { employeesCrud } from "@/lib/db/crud/employees";
import { HRRolesClient } from "@/components/hr/roles/HRRolesClient";

export default async function HRRolesPage() {
  const roles = await employeeRolesCrud.getAll();
  const employees = await employeesCrud.getAll();

  return <HRRolesClient roles={roles} employees={employees} />;
}
