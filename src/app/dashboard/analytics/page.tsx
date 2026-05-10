import { projectsCrud } from "@/lib/db/crud/projects";
import { clientsCrud } from "@/lib/db/crud/clients";
import { invoicesCrud } from "@/lib/db/crud/invoices";
import { formatCurrency } from "@/lib/utils/format";
import AnalyticsPageClient from "@/components/dashboard/analytics/AnalyticsPageClient";

export default async function AnalyticsPage() {
  const [projects, clients, invoices] = await Promise.all([
    projectsCrud.getAll(),
    clientsCrud.getAll(),
    invoicesCrud.getAll(),
  ]);

  // Compute KPI Metrics
  const totalRevenue = invoices
    .filter((inv) => inv.status === "Paid")
    .reduce((sum, inv) => sum + Number(inv.amount || 0), 0);
  
  const avgProjectValue = projects.length > 0 
    ? projects.reduce((sum, p) => sum + Number(p.budget || 0), 0) / projects.length 
    : 0;

  const kpiMetrics = [
    { label: "Gross Revenue", value: formatCurrency(totalRevenue), change: "+12.4%", status: "up" as const },
    { label: "Active Projects", value: projects.filter(p => p.status === "Active").length.toString(), change: "+2", status: "up" as const },
    { label: "Avg. Project Value", value: formatCurrency(avgProjectValue), change: "-3.1%", status: "down" as const },
    { label: "Client Satisfaction", value: "98.2%", change: "+0.5%", status: "up" as const },
  ];

  // Monthly Revenue (Mocking trend from DB data for visualization)
  const monthlyRevenue = [
    { month: "Jan", revenue: totalRevenue * 0.1, projection: totalRevenue * 0.12 },
    { month: "Feb", revenue: totalRevenue * 0.15, projection: totalRevenue * 0.14 },
    { month: "Mar", revenue: totalRevenue * 0.2, projection: totalRevenue * 0.22 },
    { month: "Apr", revenue: totalRevenue * 0.25, projection: totalRevenue * 0.26 },
    { month: "May", revenue: totalRevenue * 0.3, projection: totalRevenue * 0.32 },
  ];

  // Top Clients
  const topClients = clients.slice(0, 5).map(c => ({
    name: c.name,
    revenue: Number(c.totalBilled || 0),
    projects: c.projects?.length || 0,
    growth: "+12%"
  })).sort((a, b) => b.revenue - a.revenue);

  // Status Distribution
  const statusCounts = projects.reduce((acc: Record<string, number>, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {});

  const statusDistribution = [
    { name: "Active", value: statusCounts["Active"] || 0, color: "#10B981" },
    { name: "On-Hold", value: statusCounts["On-Hold"] || 0, color: "#F59E0B" },
    { name: "Completed", value: statusCounts["Completed"] || 0, color: "#3B82F6" },
  ];

  return (
    <AnalyticsPageClient 
      kpiMetrics={kpiMetrics}
      monthlyRevenue={monthlyRevenue}
      topClients={topClients}
      statusDistribution={statusDistribution}
    />
  );
}
