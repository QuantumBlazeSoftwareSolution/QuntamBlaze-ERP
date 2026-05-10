import { employeesCrud } from "@/lib/db/crud/employees";
import HRDashboardClient from "@/components/hr/HRDashboardClient";

export default async function HRDashboard() {
  const employees = await employeesCrud.getAll();

  // Compute stats from real data
  const totalHeadcount = employees.length;
  const newHires30d = employees.filter(e => {
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
      value: 12, // Stubbed for now
      trend: "8 active JOB-IDs",
      trendType: "up" as const,
      icon: "Briefcase",
      colorFamily: "blue" as const,
    },
    {
      label: "In Pipeline",
      value: 47, // Stubbed for now
      trend: "active CND-IDs",
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
    color: ["#3B82F6", "#F59E0B", "#8B5CF6", "#EC4899", "#10B981", "#06B6D4", "#EF4444"][i % 7]
  }));

  return (
    <HRDashboardClient 
      hrStats={hrStats}
      deptHeadcountData={deptHeadcountData}
    />
  );
}
