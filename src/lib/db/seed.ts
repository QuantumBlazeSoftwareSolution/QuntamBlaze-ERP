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

async function main() {
  console.log("🌱 Seeding Database...");

  try {
    // 1. Roles
    console.log("Inserting Roles...");
    await db.insert(schema.roles).values(
      MOCK_ROLES.map((r: Role) => ({
        id: r.id,
        name: r.name,
        description: r.description,
        color: r.color,
        permissions: r.permissions,
        isSystem: r.isSystem,
      }))
    );

    // 2. Users (from MOCK_TEAM)
    console.log("Inserting Users...");
    await db.insert(schema.users).values(
      MOCK_TEAM.map((u: TeamMember) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        avatar: u.avatar,
        roleId: "role-admin", // Defaulting to admin for mock users
        status: u.status,
        lastActive: u.lastActive ? new Date(u.lastActive) : null,
      }))
    );

    // 3. Clients
    console.log("Inserting Clients...");
    await db.insert(schema.clients).values(
      MOCK_CLIENTS.map((c: Client) => ({
        id: c.id,
        name: c.name,
        industry: c.industry,
        billingAddress: c.billingAddress,
        paymentTerms: c.paymentTerms,
        contactPerson: c.contactPerson,
        contactEmail: c.contactEmail,
        contactPhone: c.contactPhone,
        status: c.status,
        joinedAt: new Date(c.joinedAt),
      }))
    );

    // 4. Leads
    console.log("Inserting Leads...");
    await db.insert(schema.leads).values(
      MOCK_LEADS.map((l: Lead) => ({
        id: l.id,
        company: l.company,
        contactName: l.contactName,
        contactEmail: l.contactEmail,
        contactPhone: l.contactPhone,
        source: l.source,
        status: l.status,
        score: l.score,
        estimatedValue: String(l.estimatedValue),
        industry: l.industry,
        notes: l.notes,
        createdAt: new Date(l.createdAt),
      }))
    );

    // 5. Employees
    console.log("Inserting Employees...");
    await db.insert(schema.employees).values(
      MOCK_EMPLOYEES.map((e: Employee) => ({
        id: e.id,
        name: e.name,
        email: e.email!,
        role: e.role,
        department: e.department,
        status: e.status,
        phone: e.phone || null,
        address: e.address || null,
        nic: e.nic || null,
        bankDetails: e.bankDetails || null,
        profileHealth: e.profileHealth || 0,
        joinDate: e.joinDate ? new Date(e.joinDate) : null,
      }))
    );

    // 6. Projects
    console.log("Inserting Projects...");
    await db.insert(schema.projects).values(
      MOCK_PROJECTS.map((p: Project) => {
        const details = PROJECT_DETAILS[p.id];
        return {
          id: p.id,
          name: p.name,
          clientId: p.clientId,
          startDate: new Date(p.startDate),
          deadline: new Date(p.deadline),
          progress: p.progress,
          budget: String(p.budget),
          status: p.status,
          description: details?.description || "",
        };
      })
    );

    // 7. Project Milestones
    console.log("Inserting Milestones...");
    for (const prjId in PROJECT_DETAILS) {
      const details = PROJECT_DETAILS[prjId];
      if (details.milestones && details.milestones.length > 0) {
        await db.insert(schema.projectMilestones).values(
          details.milestones.map((m: any) => ({
            id: `${prjId}-${m.id}`,
            projectId: prjId,
            label: m.label,
            subLabel: m.subLabel,
            state: m.state,
          }))
        );
      }
    }

    // 8. Invoices
    console.log("Inserting Invoices...");
    await db.insert(schema.invoices).values(
      MOCK_INVOICES.map((inv: Invoice) => ({
        id: inv.id,
        projectId: inv.projectId,
        clientId: inv.clientId,
        issueDate: new Date(inv.issueDate),
        dueDate: new Date(inv.dueDate),
        amount: String(inv.amount),
        tax: String(inv.tax),
        status: inv.status,
        billingAddress: inv.billingAddress,
        lineItems: inv.lineItems,
      }))
    );

    // 9. HR Activities
    console.log("Inserting HR Activities...");
    await db.insert(schema.hrActivities).values(
      MOCK_HR_ACTIVITIES.map((act: HRActivity) => ({
        id: act.id,
        type: act.type,
        description: act.description,
        entities: act.entities,
        timestamp: new Date(),
      }))
    );

    console.log("✅ Seeding Completed!");
  } catch (error) {
    console.error("❌ Seeding Failed:", error);
    process.exit(1);
  }
}

main();
