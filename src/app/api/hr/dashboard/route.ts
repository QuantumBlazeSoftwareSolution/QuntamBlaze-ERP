import { NextResponse } from "next/server";
import {
  HR_DASHBOARD_STATS,
  DEPT_HEADCOUNT_DATA,
  HIRING_FUNNEL_DATA,
  ATTENDANCE_TREND_DATA,
  PAYROLL_TREND_DATA,
} from "@/lib/mockData/hr";

export async function GET() {
  // In a real implementation, this would query the Drizzle database:
  // const headcountByDept = await db.select(...).from(employees)...

  return NextResponse.json({
    stats: HR_DASHBOARD_STATS,
    headcountByDept: DEPT_HEADCOUNT_DATA,
    hiringFunnel: HIRING_FUNNEL_DATA,
    attendanceTrend: ATTENDANCE_TREND_DATA,
    payrollTrend: PAYROLL_TREND_DATA,
  });
}
