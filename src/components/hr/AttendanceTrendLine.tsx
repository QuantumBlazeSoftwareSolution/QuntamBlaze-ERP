"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ATTENDANCE_TREND_DATA } from "@/lib/mockData/hr";

export function AttendanceTrendLine() {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 h-[350px]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[#0F172A] font-bold">Attendance Trend</h3>
        <span className="text-[#94A3B8] text-[11px] font-semibold uppercase tracking-widest">
          30D Rolling
        </span>
      </div>

      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={ATTENDANCE_TREND_DATA}>
            <defs>
              <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis dataKey="day" hide />
            <YAxis domain={[80, 100]} hide />
            <Tooltip
              contentStyle={{ borderRadius: "8px", border: "1px solid #E2E8F0" }}
              labelFormatter={(day) => `Day ${day}`}
              formatter={(value: any) => [`${parseFloat(value).toFixed(1)}%`, "Attendance"]}
            />
            <Area
              type="monotone"
              dataKey="rate"
              stroke="#10B981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRate)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
