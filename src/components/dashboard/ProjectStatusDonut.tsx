"use client";

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface StatusDistribution {
  name: string;
  value: number;
  color: string;
}

export const ProjectStatusDonut = ({ data }: { data: StatusDistribution[] }) => {
  const total = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="bg-white border border-border rounded-xl p-5 shadow-sm flex flex-col">
      <h3 className="text-text-primary font-bold text-xs uppercase tracking-wider mb-4">Project Status</h3>
      
      <div className="relative h-48 w-full mx-auto">
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-text-primary">{total}</span>
          <span className="text-[9px] text-text-muted uppercase font-bold tracking-widest">Total</span>
        </div>
        
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4">
        {data.map((item) => (
          <div key={item.name} className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-text-secondary text-[11px] font-medium">{item.name}</span>
            </div>
            <span className="text-text-primary font-bold text-sm">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
