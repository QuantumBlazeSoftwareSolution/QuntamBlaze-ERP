"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PAYROLL_TREND_DATA } from '@/lib/mockData/hr';

export function PayrollTrendLine() {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 h-[350px]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[#0F172A] font-bold">Payroll Trend</h3>
        <span className="text-[#94A3B8] text-[11px] font-semibold uppercase tracking-widest">Yearly</span>
      </div>

      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={PAYROLL_TREND_DATA}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748B', fontSize: 12 }}
            />
            <YAxis hide />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
            />
            <Legend verticalAlign="top" align="right" iconType="circle" />
            <Line 
              type="monotone" 
              dataKey="gross" 
              name="Gross"
              stroke="#3B82F6" 
              strokeWidth={2}
              dot={{ r: 4, fill: '#3B82F6', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="net" 
              name="Net"
              stroke="#10B981" 
              strokeWidth={2}
              dot={{ r: 4, fill: '#10B981', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
