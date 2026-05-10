"use client";

import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { MOCK_FORECAST_DATA } from "@/lib/mockData/intelligence";
import { TrendingUp, Sparkles } from "lucide-react";

export function MarketForecastChart() {
  return (
    <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="px-5 py-4 border-b border-divider bg-page-bg flex items-center justify-between">
        <h3 className="text-text-primary font-bold text-sm uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent" />
          AI Market Projection
        </h3>
        <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest">
          <span className="flex items-center gap-1.5 text-text-secondary"><div className="w-2 h-2 rounded-full bg-text-muted" /> Actual</span>
          <span className="flex items-center gap-1.5 text-accent"><div className="w-2 h-2 rounded-full bg-accent animate-pulse" /> Predicted</span>
        </div>
      </div>
      
      <div className="p-5 flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={MOCK_FORECAST_DATA}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#94A3B8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis 
              dataKey="month" 
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
            <ReferenceLine x="Jun" stroke="#10B981" strokeDasharray="3 3" />
            <Area 
              type="monotone" 
              dataKey="actual" 
              stroke="#94A3B8" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorActual)" 
              connectNulls 
            />
            <Area 
              type="monotone" 
              dataKey="predicted" 
              stroke="#10B981" 
              strokeWidth={3}
              strokeDasharray="5 5"
              fillOpacity={1} 
              fill="url(#colorPredicted)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="px-5 py-4 border-t border-divider bg-page-bg">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/5 border border-accent/10">
          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent shrink-0">
            <TrendingUp className="w-4 h-4" />
          </div>
          <p className="text-sm text-text-primary">
            Quantum AI predicts a <span className="font-bold text-accent">+25% growth</span> trajectory over the next quarter based on current leads and pipeline velocity.
          </p>
        </div>
      </div>
    </div>
  );
}
