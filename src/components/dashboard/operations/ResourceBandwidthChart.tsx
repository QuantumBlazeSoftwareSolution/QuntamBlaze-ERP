"use client";

import { motion } from "framer-motion";
import { Users, Cpu, Database, Zap } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { MOCK_RESOURCE_ALLOCATION } from "@/lib/mockData/operations";

export function ResourceBandwidthChart() {
  return (
    <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="px-5 py-4 border-b border-divider bg-page-bg flex items-center justify-between">
        <h3 className="text-text-primary font-bold text-sm uppercase tracking-wider flex items-center gap-2">
          <Zap className="w-4 h-4 text-accent" />
          Resource Allocation
        </h3>
      </div>
      
      <div className="p-5 flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={MOCK_RESOURCE_ALLOCATION}
            margin={{ top: 20, right: 30, left: -20, bottom: 5 }}
            barSize={32}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis 
              dataKey="department" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748B', fontSize: 11, fontWeight: 600 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748B', fontSize: 11, fontWeight: 600 }} 
            />
            <Tooltip 
              cursor={{ fill: '#F8FAFC' }}
              contentStyle={{ 
                backgroundColor: '#050505', 
                border: '1px solid #1A1A1A',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 500,
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
              }}
              itemStyle={{ color: '#E2E8F0', padding: '2px 0' }}
            />
            <Legend 
              wrapperStyle={{ fontSize: '11px', fontWeight: 600, color: '#64748B', paddingTop: '20px' }}
              iconType="circle"
              iconSize={8}
            />
            <Bar dataKey="compute" name="Compute (%)" stackId="a" fill="#10B981" radius={[0, 0, 4, 4]} />
            <Bar dataKey="storage" name="Storage (%)" stackId="a" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="px-5 py-4 border-t border-divider bg-page-bg grid grid-cols-3 gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-text-muted">
            <Cpu className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Compute</span>
          </div>
          <span className="text-sm font-bold text-text-primary">42.5 TH/s</span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-text-muted">
            <Database className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Storage</span>
          </div>
          <span className="text-sm font-bold text-text-primary">128.4 TB</span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-text-muted">
            <Users className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Personnel</span>
          </div>
          <span className="text-sm font-bold text-text-primary">
            {MOCK_RESOURCE_ALLOCATION.reduce((acc, curr) => acc + curr.personnel, 0)} Active
          </span>
        </div>
      </div>
    </div>
  );
}
