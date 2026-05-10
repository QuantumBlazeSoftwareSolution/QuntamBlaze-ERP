export enum UserRole {
  Admin = "Admin",
  PM = "PM",
  Developer = "Developer",
  Finance = "Finance",
  Client = "Client",
}

export interface User {
  id: string; // USR-ID
  fullName: string;
  email: string;
  role: UserRole;
  status: "Active" | "Inactive" | "Invited";
}
