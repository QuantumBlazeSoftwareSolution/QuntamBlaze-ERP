"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";
import { TrendingUp } from "lucide-react";

interface RevenueDataPoint {
  month: string;
  revenue: number;
  target: number;
}

interface RevenueAreaChartProps {
  data: RevenueDataPoint[];
}

const formatK = (value: number) => `$${(value / 1000).toFixed(0)}K`;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-border rounded-xl p-4 shadow-lg min-w-[160px]">
        <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-2">
          {label}
        </p>
        {payload.map((entry: any) => (
          <div key={entry.name} className="flex items-center justify-between gap-4 mb-1">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-[12px] text-text-secondary capitalize">{entry.name}</span>
            </div>
            <span className="text-[12px] font-bold font-mono text-text-primary">
              {formatK(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function RevenueAreaChart({ data }: RevenueAreaChartProps) {
  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
  const lastMonth = data[data.length - 1];
  const prevMonth = data[data.length - 2];
  const growth = (((lastMonth.revenue - prevMonth.revenue) / prevMonth.revenue) * 100).toFixed(1);
  const isPositive = lastMonth.revenue >= prevMonth.revenue;

  return (
    <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-sm font-bold text-text-primary">Revenue vs Target</h3>
          <p className="text-[12px] text-text-muted mt-0.5">Last 12 months performance</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
              12M Total
            </p>
            <p className="text-lg font-bold text-text-primary">{formatK(totalRevenue)}</p>
          </div>
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold ${isPositive ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}
          >
            <TrendingUp className="w-3 h-3" />
            {isPositive ? "+" : ""}
            {growth}%
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="targetGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#94A3B8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 10, fill: "#94A3B8", fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
            dy={8}
          />
          <YAxis
            tickFormatter={formatK}
            tick={{ fontSize: 10, fill: "#94A3B8" }}
            axisLine={false}
            tickLine={false}
            dx={-4}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: "11px", fontWeight: 600, paddingTop: "16px" }}
            formatter={(value) => <span className="text-text-secondary capitalize">{value}</span>}
          />
          <Area
            type="monotone"
            dataKey="target"
            name="target"
            stroke="#CBD5E1"
            strokeWidth={2}
            strokeDasharray="4 4"
            fill="url(#targetGrad)"
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            name="revenue"
            stroke="#10B981"
            strokeWidth={2.5}
            fill="url(#revenueGrad)"
            dot={{ fill: "#10B981", strokeWidth: 2, r: 3, stroke: "#fff" }}
            activeDot={{ r: 5, stroke: "#10B981", strokeWidth: 2, fill: "#fff" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
