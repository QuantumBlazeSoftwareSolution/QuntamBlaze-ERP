import { projectsCrud } from "@/lib/db/crud/projects";
import { leadsCrud } from "@/lib/db/crud/leads";
import { invoicesCrud } from "@/lib/db/crud/invoices";
import { formatCurrency } from "@/lib/utils/format";
import DashboardPageClient from "@/components/dashboard/DashboardPageClient";

export default async function DashboardPage() {
  const [allProjects, allLeads, allInvoices] = await Promise.all([
    projectsCrud.getAll(),
    leadsCrud.getAll(),
    invoicesCrud.getAll(),
  ]);

  // Compute Stats
  const totalRevenue = allInvoices
    .filter((inv) => inv.status === "Paid")
    .reduce((sum, inv) => sum + Number(inv.amount || 0), 0);

  const activeProjectsCount = allProjects.filter((p) => p.status === "Active").length;
  const outstandingInvoicesCount = allInvoices.filter((inv) => inv.status !== "Paid").length;
  const leadConversionRate =
    allLeads.length > 0
      ? (allLeads.filter((l) => l.status === "Won").length / allLeads.length) * 100
      : 0;

  const statsData = [
    {
      label: "Total Revenue",
      value: formatCurrency(totalRevenue),
      trend: 12.5,
      sparkline: [40, 35, 50, 45, 60, 55, 70].map((v) => ({ value: v })),
    },
    {
      label: "Active Projects",
      value: activeProjectsCount.toString(),
      trend: 8.2,
      sparkline: [20, 22, 21, 24, 23, 25, 24].map((v) => ({ value: v })),
    },
    {
      label: "Outstanding Invoices",
      value: outstandingInvoicesCount.toString(),
      trend: -2.4,
      sparkline: [18, 16, 17, 15, 14, 13, 14].map((v) => ({ value: v })),
    },
    {
      label: "Lead Conversion",
      value: `${leadConversionRate.toFixed(1)}%`,
      trend: 4.1,
      sparkline: [15, 16, 15.5, 17, 18, 17.5, 18.5].map((v) => ({ value: v })),
    },
  ];

  // Project Health
  const projectHealthData = allProjects.slice(0, 4).map((p) => ({
    id: p.id,
    name: p.name,
    clientId: p.clientId,
    progress: p.progress || 0,
    budgetSpent: Number(p.budget || 0) * ((p.progress || 0) / 100),
    budgetTotal: Number(p.budget || 0),
    status: p.status.toLowerCase() as any,
  }));

  // Status Distribution
  const statusCounts = allProjects.reduce((acc: Record<string, number>, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {});

  const statusDistribution = [
    { name: "Active", value: statusCounts["Active"] || 0, color: "#10B981" },
    { name: "On-Hold", value: statusCounts["On-Hold"] || 0, color: "#F59E0B" },
    { name: "Completed", value: statusCounts["Completed"] || 0, color: "#3B82F6" },
  ];

  // Activity Feed (Dummy for now, will wire to real logs later)
  const activityFeedData = [
    {
      id: "ACT-001",
      type: "project" as const,
      entityId: allProjects[0]?.id || "",
      userId: "System",
      action: "re-synchronized with DB",
      timestamp: new Date().toISOString(),
    },
  ];

  return (
    <DashboardPageClient
      statsData={statsData}
      projectHealthData={projectHealthData}
      statusDistribution={statusDistribution}
      activityFeedData={activityFeedData}
    />
  );
}
