import { NextResponse } from "next/server";
import { employeesCrud } from "@/lib/db/crud/employees";

export async function GET() {
  const employees = await employeesCrud.getAll();

  // Dept distribution
  const deptCounts = employees.reduce((acc: Record<string, number>, e) => {
    const dept = e.department || "Other";
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});

  const headcountByDept = Object.entries(deptCounts).map(([name, count], i) => ({
    name,
    count,
    color: ["#3B82F6", "#F59E0B", "#8B5CF6", "#EC4899", "#10B981", "#06B6D4", "#EF4444"][i % 7]
  }));

  // Stubbed others for now
  const hiringFunnel = [
    { stage: "Applied", value: 450 },
    { stage: "Screening", value: 120 },
    { stage: "Technical", value: 45 },
    { stage: "Final", value: 12 },
    { stage: "Offer", value: 5 },
  ];

  return NextResponse.json({
    stats: [], // Simplified for API response
    headcountByDept,
    hiringFunnel,
    attendanceTrend: [],
    payrollTrend: [],
  });
}
