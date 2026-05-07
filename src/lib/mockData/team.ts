export interface TeamMember {
  id: string;
  name: string;
  initials: string;
  color: string;
}

export const MOCK_TEAM: TeamMember[] = [
  { id: "USR-JD-26-001", name: "James Doe", initials: "JD", color: "bg-accent/20 text-accent" },
  { id: "USR-AL-26-002", name: "Alice Lee", initials: "AL", color: "bg-success/20 text-success" },
  { id: "USR-MK-26-003", name: "Mark Kim", initials: "MK", color: "bg-warning/20 text-warning" },
  { id: "USR-SR-26-004", name: "Sara Raj", initials: "SR", color: "bg-danger/20 text-danger" },
  { id: "USR-VP-26-005", name: "Vic Park", initials: "VP", color: "bg-purple-500/20 text-purple-400" },
  { id: "USR-TC-26-006", name: "Tom Chen", initials: "TC", color: "bg-pink-500/20 text-pink-400" },
];
