"use server";

import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema/projects";
import { clients } from "@/lib/db/schema/clients";
import { invoices } from "@/lib/db/schema/invoices";
import { leads } from "@/lib/db/schema/leads";
import { employees } from "@/lib/db/schema/hr/employees";
import { tasks } from "@/lib/db/schema/tasks";
import { ilike, or } from "drizzle-orm";

export type SearchResult = {
  id: string;
  name: string;
  type: "project" | "client" | "invoice" | "lead" | "employee" | "task";
  href: string;
  metadata?: string;
};

export async function globalSearch(query: string): Promise<SearchResult[]> {
  if (!query || query.length < 2) return [];

  const results: SearchResult[] = [];
  const searchTerm = `%${query}%`;

  try {
    // 1. Search Projects
    const projectResults = await db
      .select({ id: projects.id, name: projects.name })
      .from(projects)
      .where(or(ilike(projects.id, searchTerm), ilike(projects.name, searchTerm)))
      .limit(5);
    
    projectResults.forEach(p => results.push({
      id: p.id,
      name: p.name,
      type: "project",
      href: `/dashboard/projects/${p.id}`
    }));

    // 2. Search Clients
    const clientResults = await db
      .select({ id: clients.id, name: clients.name })
      .from(clients)
      .where(or(ilike(clients.id, searchTerm), ilike(clients.name, searchTerm)))
      .limit(5);
    
    clientResults.forEach(c => results.push({
      id: c.id,
      name: c.name,
      type: "client",
      href: `/dashboard/clients/${c.id}`
    }));

    // 3. Search Invoices
    const invoiceResults = await db
      .select({ id: invoices.id, status: invoices.status })
      .from(invoices)
      .where(ilike(invoices.id, searchTerm))
      .limit(5);
    
    invoiceResults.forEach(inv => results.push({
      id: inv.id,
      name: `Invoice ${inv.id}`,
      type: "invoice",
      href: `/dashboard/finance/invoices/${inv.id}`,
      metadata: inv.status
    }));

    // 4. Search Leads
    const leadResults = await db
      .select({ id: leads.id, name: leads.company })
      .from(leads)
      .where(or(ilike(leads.id, searchTerm), ilike(leads.company, searchTerm)))
      .limit(5);
    
    leadResults.forEach(l => results.push({
      id: l.id,
      name: l.name,
      type: "lead",
      href: `/dashboard/leads/${l.id}`
    }));

    // 5. Search Employees
    const employeeResults = await db
      .select({ id: employees.id, name: employees.name })
      .from(employees)
      .where(or(ilike(employees.id, searchTerm), ilike(employees.name, searchTerm)))
      .limit(5);
    
    employeeResults.forEach(e => results.push({
      id: e.id,
      name: e.name,
      type: "employee",
      href: `/dashboard/hr/employees/${e.id}`
    }));

    // 6. Search Tasks
    const taskResults = await db
      .select({ id: tasks.id, title: tasks.title })
      .from(tasks)
      .where(or(ilike(tasks.id, searchTerm), ilike(tasks.title, searchTerm)))
      .limit(5);
    
    taskResults.forEach(t => results.push({
      id: t.id,
      name: t.title,
      type: "task",
      href: `/dashboard/tasks/${t.id}`
    }));

  } catch (error) {
    console.error("Search error:", error);
  }

  return results;
}
