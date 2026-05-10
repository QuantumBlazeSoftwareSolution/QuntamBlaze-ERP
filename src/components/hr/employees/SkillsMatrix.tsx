"use client";

import React from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { 
  Zap, 
  Target, 
  TrendingUp, 
  Award,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const MOCK_SKILLS_DATA = [
  { subject: 'Frontend', A: 95, B: 100, fullMark: 100 },
  { subject: 'Backend', A: 88, B: 95, fullMark: 100 },
  { subject: 'Leadership', A: 75, B: 90, fullMark: 100 },
  { subject: 'DevOps', A: 82, B: 85, fullMark: 100 },
  { subject: 'System Design', A: 90, B: 95, fullMark: 100 },
  { subject: 'Soft Skills', A: 85, B: 90, fullMark: 100 },
];

export function SkillsMatrix() {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-3xl p-8 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
           <h3 className="text-[#0F172A] font-bold">Skills Matrix</h3>
           <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-widest mt-1">Competency Analysis vs. Role Goals</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-[10px] font-bold text-[#64748B] uppercase">Current</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-[10px] font-bold text-[#64748B] uppercase">Target (Lead)</span>
           </div>
        </div>
      </div>

      <div className="flex-1 min-h-[300px] w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height={320}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={MOCK_SKILLS_DATA}>
            <PolarGrid stroke="#F1F5F9" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }}
            />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              name="Current"
              dataKey="A"
              stroke="#3B82F6"
              fill="#3B82F6"
              fillOpacity={0.5}
            />
            <Radar
              name="Target"
              dataKey="B"
              stroke="#10B981"
              fill="#10B981"
              fillOpacity={0.2}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '12px', 
                border: '1px solid #E2E8F0',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">
         <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
               <TrendingUp className="w-4 h-4 text-blue-600" />
               <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Strength</span>
            </div>
            <p className="text-sm font-bold text-blue-900">Expert Frontend Architecture</p>
         </div>
         <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
            <div className="flex items-center gap-2 mb-2">
               <AlertCircle className="w-4 h-4 text-amber-600" />
               <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Growth Area</span>
            </div>
            <p className="text-sm font-bold text-amber-900">Strategic Team Leadership</p>
         </div>
      </div>
    </div>
  );
}
