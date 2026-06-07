import { employeesCrud } from "@/lib/db/crud/employees";
import HRDashboardClient from "@/components/hr/HRDashboardClient";
import { db } from "@/lib/db";
import { jobs, candidates, hrActivities } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export default async function HRDashboard() {
  const employees = await employeesCrud.getAll();

  const activeJobs = await db.select().from(jobs).where(eq(jobs.status, "Active"));
  const openPositionsCount = activeJobs.length;

  const allCandidates = await db.select().from(candidates);
  const candidatesCount = allCandidates.length;

  const dbActivities = await db
    .select()
    .from(hrActivities)
    .orderBy(desc(hrActivities.timestamp))
    .limit(10);

  const activities = dbActivities.map((act) => ({
    id: act.id,
    type: act.type,
    description: act.description,
    timestamp: act.timestamp ? new Date(act.timestamp).toISOString().replace("T", " ").substring(0, 16) : "Just now",
    entities: (act.entities as string[]) || [],
  }));

  // Compute stats from real data
  const totalHeadcount = employees.length;
  const newHires30d = employees.filter((e) => {
    const joinDate = new Date(e.joinDate || "");
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return joinDate > thirtyDaysAgo;
  }).length;

  const hrStats = [
    {
      label: "Total Headcount",
      value: totalHeadcount,
      trend: `↑ ${newHires30d} this month`,
      trendType: "up" as const,
      icon: "Users",
      colorFamily: "teal" as const,
    },
    {
      label: "Open Positions",
      value: openPositionsCount,
      trend: `${openPositionsCount} active JOB-IDs`,
      trendType: "up" as const,
      icon: "Briefcase",
      colorFamily: "blue" as const,
    },
    {
      label: "In Pipeline",
      value: candidatesCount,
      trend: `${candidatesCount} active CND-IDs`,
      trendType: "up" as const,
      icon: "UserPlus",
      colorFamily: "violet" as const,
    },
    {
      label: "New Hires (30d)",
      value: newHires30d,
      trend: "last 30 days",
      trendType: "up" as const,
      icon: "UserCheck",
      colorFamily: "green" as const,
    },
    {
      label: "Attendance Rate",
      value: "98.2%",
      trend: "↑ 0.5%",
      trendType: "up" as const,
      icon: "Clock",
      colorFamily: "teal" as const,
    },
    {
      label: "Pending Leaves",
      value: 8,
      trend: "LEV- awaiting approval",
      trendType: "down" as const,
      icon: "CalendarOff",
      colorFamily: "amber" as const,
    },
    {
      label: "Payroll This Month",
      value: "$420,500",
      trend: "PAY- run value",
      trendType: "up" as const,
      icon: "Wallet",
      colorFamily: "blue" as const,
    },
    {
      label: "Attrition Rate",
      value: "2.4%",
      trend: "↓ vs last quarter",
      trendType: "down" as const,
      icon: "TrendingDown",
      colorFamily: "red" as const,
    },
  ];

  // Dept distribution from real data
  const deptCounts = employees.reduce((acc: Record<string, number>, e) => {
    const dept = e.department || "Other";
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});

  const deptHeadcountData = Object.entries(deptCounts).map(([name, count], i) => ({
    name,
    count,
    color: ["#3B82F6", "#F59E0B", "#8B5CF6", "#EC4899", "#10B981", "#06B6D4", "#EF4444"][i % 7],
  }));

  return <HRDashboardClient hrStats={hrStats} deptHeadcountData={deptHeadcountData} activities={activities} />;
}
