"use client";

import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
interface SparklinePoint {
  value: number;
}

interface StatTileProps {
  label: string;
  value: string;
  trend: number;
  sparkline: SparklinePoint[];
}

export const StatTile = ({ label, value, trend, sparkline }: StatTileProps) => {
  const isPositive = trend >= 0;

  return (
    <div className="bg-white border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-text-secondary text-sm font-medium mb-1">{label}</p>
          <h3 className="text-text-primary text-2xl font-bold">{value}</h3>
        </div>
        <div
          className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${
            isPositive
              ? "text-success bg-success/10 border-success/20"
              : "text-danger bg-danger/10 border-danger/20"
          }`}
        >
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span>{Math.abs(trend)}%</span>
        </div>
      </div>

      <div className="h-10 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sparkline}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={isPositive ? "#10B981" : "#EF4444"}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
