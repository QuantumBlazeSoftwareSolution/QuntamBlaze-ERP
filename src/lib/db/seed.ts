import { db } from "./index";
import * as schema from "./schema";
import {
  MOCK_ROLES,
  MOCK_TEAM,
  MOCK_CLIENTS,
  MOCK_LEADS,
  MOCK_PROJECTS,
  MOCK_EMPLOYEES,
  MOCK_HR_ACTIVITIES,
  MOCK_INVOICES,
} from "@/lib/mockData";
import { PROJECT_DETAILS } from "@/lib/mockData/projectDetails";
import { Role } from "@/lib/mockData/roles";
import { TeamMember } from "@/types/team";
import { Client } from "@/types/client";
import { Lead } from "@/lib/mockData/leads";
import { Project } from "@/lib/mockData/projects";
import { Employee, HRActivity } from "@/types/hr";
import { Invoice } from "@/types/invoice";

/** Safely parse a date string, returning null if invalid */
function safeDate(str: string | null | undefined): Date | null {
  if (!str) return null;
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

async function main() {
  console.log("🌱 Seeding Database...");
  try {
    console.log("Inserting Roles...");
    await db.insert(schema.roles).values(MOCK_ROLES.map((r: Role) => ({
      id: r.id, name: r.name, description: r.description, color: r.color, permissions: r.permissions, isSystem: r.isSystem,
    }))).onConflictDoNothing();

    console.log("Inserting Users...");
    await db.insert(schema.users).values(MOCK_TEAM.map((u: TeamMember) => ({
      id: u.id, name: u.name, email: u.email, avatar: u.avatar, roleId: "role-admin", status: u.status, lastActive: safeDate(u.lastActive),
    }))).onConflictDoNothing();

    console.log("Inserting Clients...");
    await db.insert(schema.clients).values(MOCK_CLIENTS.map((c: Client) => ({
      id: c.id, name: c.name, industry: c.industry, billingAddress: c.billingAddress, paymentTerms: c.paymentTerms, contactPerson: c.contactPerson, contactEmail: c.contactEmail, contactPhone: c.contactPhone, status: c.status, joinedAt: new Date(c.joinedAt),
    }))).onConflictDoNothing();

    console.log("Inserting Leads...");
    await db.insert(schema.leads).values(MOCK_LEADS.map((l: Lead) => ({
      id: l.id, company: l.company, contactName: l.contactName, contactEmail: l.contactEmail, contactPhone: l.contactPhone, source: l.source, status: l.status, score: l.score, estimatedValue: String(l.estimatedValue), industry: l.industry, notes: l.notes, createdAt: new Date(l.createdAt),
    }))).onConflictDoNothing();

    console.log("Inserting Employees...");
    await db.insert(schema.employees).values(MOCK_EMPLOYEES.map((e: Employee) => ({
      id: e.id, name: e.name, email: e.email!, role: e.role, department: e.department, status: e.status, phone: e.phone || null, address: e.address || null, nic: e.nic || null, bankDetails: e.bankDetails || null, profileHealth: e.profileHealth || 0, joinDate: safeDate(e.joinDate),
    }))).onConflictDoNothing();

    console.log("Inserting Projects...");
    // Ensure the client IDs referenced by projects exist (mock data uses different IDs than MOCK_CLIENTS)
    await db.insert(schema.clients).values([
      { id: "CLI-GOOG-01", name: "Google", industry: "Technology", billingAddress: "1600 Amphitheatre Parkway, Mountain View, CA", paymentTerms: "Net-30", contactPerson: "Sundar Pichai", contactEmail: "s.pichai@google.com", contactPhone: "+1 (650) 253-0000", status: "Active", joinedAt: new Date("2023-01-15") },
      { id: "CLI-AMZN-04", name: "Amazon", industry: "Technology", billingAddress: "410 Terry Ave N, Seattle, WA", paymentTerms: "Net-30", contactPerson: "Andy Jassy", contactEmail: "a.jassy@amazon.com", contactPhone: "+1 (206) 266-1000", status: "Active", joinedAt: new Date("2023-02-01") },
      { id: "CLI-MSFT-09", name: "Microsoft", industry: "Technology", billingAddress: "One Microsoft Way, Redmond, WA", paymentTerms: "Net-45", contactPerson: "Satya Nadella", contactEmail: "s.nadella@microsoft.com", contactPhone: "+1 (425) 882-8080", status: "Active", joinedAt: new Date("2023-03-01") },
      { id: "CLI-AAPL-02", name: "Meta", industry: "Technology", billingAddress: "1 Hacker Way, Menlo Park, CA", paymentTerms: "Net-30", contactPerson: "Mark Zuckerberg", contactEmail: "m.zuckerberg@meta.com", contactPhone: "+1 (650) 543-4800", status: "Active", joinedAt: new Date("2023-04-01") },
    ]).onConflictDoNothing();

    await db.insert(schema.projects).values(MOCK_PROJECTS.map((p: Project) => {
      const details = PROJECT_DETAILS[p.id];
      return { id: p.id, name: p.name, clientId: p.clientId, startDate: safeDate(p.startDate), deadline: safeDate(p.deadline), progress: p.progress, budget: String(p.budget), status: p.status, description: details?.description || "" };
    })).onConflictDoNothing();

    console.log("Inserting Milestones...");
    for (const prjId in PROJECT_DETAILS) {
      const details = PROJECT_DETAILS[prjId];
      if (details.milestones?.length > 0) {
        await db.insert(schema.projectMilestones).values(details.milestones.map((m: any) => ({
          id: `${prjId}-${m.id}`, projectId: prjId, label: m.label, subLabel: m.subLabel, state: m.state,
        }))).onConflictDoNothing();
      }
    }

    console.log("Inserting Invoices...");
    await db.insert(schema.invoices).values(MOCK_INVOICES.map((inv: Invoice) => ({
      id: inv.id,
      projectId: null,   // Finance mock uses placeholder IDs not in projects table
      clientId: null,    // Finance mock uses placeholder IDs not in clients table
      issueDate: safeDate(inv.issueDate), dueDate: safeDate(inv.dueDate), amount: String(inv.amount), tax: String(inv.tax), status: inv.status, billingAddress: inv.billingAddress, lineItems: inv.lineItems,
    }))).onConflictDoNothing();

    console.log("Inserting HR Activities...");
    await db.insert(schema.hrActivities).values(MOCK_HR_ACTIVITIES.map((act: HRActivity) => ({
      id: act.id, type: act.type, description: act.description, entities: act.entities, timestamp: new Date(),
    }))).onConflictDoNothing();

    console.log("✅ Seeding Completed!");
  } catch (error) {
    console.error("❌ Seeding Failed:", error);
    process.exit(1);
  }
}
main();
