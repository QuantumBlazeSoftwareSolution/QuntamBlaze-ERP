"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface TopClientEntry {
  name: string;
  clientId: string;
  revenue: number;
}

interface TopClientsBarProps {
  data: TopClientEntry[];
}

const formatM = (value: number) =>
  value >= 1000000 ? `$${(value / 1000000).toFixed(1)}M` : `$${(value / 1000).toFixed(0)}K`;

const COLORS = ["#10B981", "#34D399", "#6EE7B7", "#A7F3D0", "#D1FAE5"];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload as TopClientEntry;
    return (
      <div className="bg-white border border-border rounded-xl p-4 shadow-lg">
        <p className="text-[12px] font-bold text-text-primary mb-1">{d.name}</p>
        <p className="text-[10px] font-mono text-text-muted mb-2">{d.clientId}</p>
        <p className="text-[13px] font-bold font-mono text-accent">{formatM(d.revenue)}</p>
      </div>
    );
  }
  return null;
};

export function TopClientsBar({ data }: TopClientsBarProps) {
  return (
    <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-sm font-bold text-text-primary">Top Clients by Revenue</h3>
        <p className="text-[12px] text-text-muted mt-0.5">
          Cumulative billing across all active engagements
        </p>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
          barSize={16}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
          <XAxis
            type="number"
            tickFormatter={formatM}
            tick={{ fontSize: 10, fill: "#94A3B8" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 11, fill: "#475569", fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
            width={110}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F8FAFC" }} />
          <Bar dataKey="revenue" radius={[0, 6, 6, 0]}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="mt-4 space-y-2">
        {data.map((client, index) => (
          <div key={client.clientId} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-[11px] font-medium text-text-secondary truncate max-w-[140px]">
                {client.name}
              </span>
            </div>
            <span className="text-[11px] font-bold font-mono text-text-primary">
              {formatM(client.revenue)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
