import { relations } from "drizzle-orm";
import { clients } from "./clients";
import { projects, projectMilestones, projectTeam } from "./projects";
import { invoices } from "./invoices";
import { leads } from "./leads";
import { employees } from "./hr/employees";

// ─── Projects ─────────────────────────────────────────────────────────────────

export const projectsRelations = relations(projects, ({ one, many }) => ({
  client: one(clients, { fields: [projects.clientId], references: [clients.id] }),
  milestones: many(projectMilestones),
  team: many(projectTeam),
  invoices: many(invoices),
}));

export const projectMilestonesRelations = relations(projectMilestones, ({ one }) => ({
  project: one(projects, { fields: [projectMilestones.projectId], references: [projects.id] }),
}));

export const projectTeamRelations = relations(projectTeam, ({ one }) => ({
  project: one(projects, { fields: [projectTeam.projectId], references: [projects.id] }),
  employee: one(employees, { fields: [projectTeam.employeeId], references: [employees.id] }),
}));

// ─── Clients ──────────────────────────────────────────────────────────────────

export const clientsRelations = relations(clients, ({ many }) => ({
  projects: many(projects),
  invoices: many(invoices),
}));

// ─── Invoices ─────────────────────────────────────────────────────────────────

export const invoicesRelations = relations(invoices, ({ one }) => ({
  project: one(projects, { fields: [invoices.projectId], references: [projects.id] }),
  client: one(clients, { fields: [invoices.clientId], references: [clients.id] }),
}));

// ─── Leads ────────────────────────────────────────────────────────────────────

export const leadsRelations = relations(leads, ({ one }) => ({
  assignedUser: one(employees, { fields: [leads.assignedTo], references: [employees.id] }),
}));

// ─── Employees ────────────────────────────────────────────────────────────────

export const employeesRelations = relations(employees, ({ one, many }) => ({
  reportingTo: one(employees, {
    fields: [employees.reportingToId],
    references: [employees.id],
    relationName: "reportingHierarchy",
  }),
  reportees: many(employees, { relationName: "reportingHierarchy" }),
  projectTeam: many(projectTeam),
}));
