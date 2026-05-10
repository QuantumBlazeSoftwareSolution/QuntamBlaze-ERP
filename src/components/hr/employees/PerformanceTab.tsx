"use client";

import React from 'react';
import { SkillsMatrix } from './SkillsMatrix';
import { GrowthRoadmap } from './GrowthRoadmap';
import { CertificationWall } from './CertificationWall';
import { Employee } from '@/types/hr';

interface PerformanceTabProps {
  employee: Employee;
}

export function PerformanceTab({ employee }: PerformanceTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column: Skills & Certs */}
      <div className="space-y-8">
        <SkillsMatrix />
        <CertificationWall />
      </div>

      {/* Right Column: Roadmap & Career Path */}
      <div className="space-y-8">
        <GrowthRoadmap />
        
        {/* Additional Performance Context (Optional) */}
        <div className="bg-[#0F172A] rounded-3xl p-8 text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full" />
           <h4 className="text-lg font-black mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              Performance Summary
           </h4>
           <p className="text-sm text-slate-300 leading-relaxed mb-6">
              {employee.name} has consistently exceeded expectations in technical delivery. Currently transitioning into a Lead Engineer role with a focus on cross-team architecture and mentorship.
           </p>
           <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">KPI Score</p>
                 <p className="text-xl font-black">4.8 / 5.0</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Review Cycle</p>
                 <p className="text-xl font-black italic">Q1 2024</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
