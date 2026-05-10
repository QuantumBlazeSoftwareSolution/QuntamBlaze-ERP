import { TeamMember } from "@/types/team";

export const MOCK_TEAM: TeamMember[] = [
  {
    id: "USR-JK-26-001",
    name: "J. Kaelen",
    email: "jkaelen@qblaze.io",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop",
    role: "Admin",
    activeProjects: ["PRJ-GOOG-26-001", "PRJ-AMZN-26-003"],
    lastActive: "2023.10.24 14:32Z",
    status: "Active",
  },
  {
    id: "USR-MR-26-042",
    name: "M. Rostova",
    email: "mrostova@qblaze.io",
    role: "Developer",
    activeProjects: ["PRJ-MSFT-26-042"],
    lastActive: "2023.10.24 10:11Z",
    status: "Inactive",
  },
  {
    id: "USR-JB-26-009",
    name: "J. Bourne",
    email: "jbourne@qblaze.io",
    role: "PM",
    activeProjects: ["PRJ-META-26-012"],
    lastActive: "1 hour ago",
    status: "Active",
  },
];
