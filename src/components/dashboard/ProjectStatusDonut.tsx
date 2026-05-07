"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { MOCK_DISTRIBUTION } from "@/lib/mockData/dashboard";

export function ProjectStatusDonut() {
  const total = MOCK_DISTRIBUTION.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-bg-card border border-border rounded-xl p-6">
      <h3 className="text-[11px] font-bold tracking-[0.1em] text-text-secondary uppercase mb-6">
        Project Distribution
      </h3>
      
      <div className="relative w-full h-48 mx-auto flex items-center justify-center mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={MOCK_DISTRIBUTION}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              isAnimationActive={true}
            >
              {MOCK_DISTRIBUTION.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  style={{
                    filter: `drop-shadow(0 0 8px ${entry.color}66)` // Add subtle glow
                  }}
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: "#0A0A0A", borderColor: "#1A1A1A", borderRadius: "8px", fontSize: "13px" }}
              itemStyle={{ color: "#F0F0F0" }}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-2xl font-bold text-text-primary">{total}</div>
          <div className="text-[10px] font-bold tracking-[0.1em] text-text-secondary uppercase">Total</div>
        </div>
      </div>

      <div className="space-y-3 font-mono text-[13px]">
        {MOCK_DISTRIBUTION.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-text-primary">{item.name}</span>
            </div>
            <span className="text-text-secondary">{Math.round((item.value / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
