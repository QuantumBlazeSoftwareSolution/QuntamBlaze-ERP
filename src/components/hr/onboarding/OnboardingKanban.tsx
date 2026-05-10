"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  MoreHorizontal,
  Plus,
  ShieldCheck,
  Laptop
} from 'lucide-react';
import { IDChip } from '@/components/ui/IDChip';
import { cn } from '@/lib/utils';

const STAGES = [
  { id: 'pre_arrival', label: 'Pre-Arrival', color: 'bg-slate-400' },
  { id: 'day_1', label: 'Day 1', color: 'bg-blue-500' },
  { id: 'week_1', label: 'Week 1', color: 'bg-violet-500' },
  { id: 'month_1', label: '30 Days', color: 'bg-emerald-500' },
  { id: 'month_2', label: '60 Days', color: 'bg-amber-500' },
  { id: 'month_3', label: '90 Days', color: 'bg-orange-500' },
];

const MOCK_HIRES = [
  {
    id: 'ONB-EMP-ENG-26-001-01',
    name: 'Alex Mercer',
    role: 'Senior Software Engineer',
    dept: 'Engineering',
    startDate: 'May 15, 2024',
    readiness: 85,
    status: 'pre_arrival',
    missingItems: ['Laptop Setup', 'ID Badge'],
  },
  {
    id: 'ONB-EMP-DES-26-005-01',
    name: 'Elena Vance',
    role: 'UI Designer',
    dept: 'Design',
    startDate: 'May 01, 2024',
    readiness: 100,
    status: 'week_1',
    missingItems: [],
  }
];

export function OnboardingKanban() {
  return (
    <div className="flex gap-6 overflow-x-auto pb-8 h-[calc(100vh-250px)] min-h-[600px] scrollbar-hide">
      {STAGES.map((stage) => {
        const stageHires = MOCK_HIRES.filter(h => h.status === stage.id);

        return (
          <div key={stage.id} className="flex flex-col min-w-[300px] max-w-[300px] h-full">
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-2">
                <div className={cn("w-2 h-2 rounded-full", stage.color)} />
                <h3 className="text-[#0F172A] font-bold text-sm tracking-tight">{stage.label}</h3>
              </div>
              <span className="bg-[#F1F5F9] text-[#64748B] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#E2E8F0]">
                {stageHires.length}
              </span>
            </div>

            {/* Column Content */}
            <div className="flex-1 bg-white/50 border border-[#E2E8F0] rounded-2xl p-3 space-y-4 overflow-y-auto scrollbar-hide">
              {stageHires.map((hire) => (
                <div key={hire.id} className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-sm hover:shadow-md transition-all group">
                  <div className="flex items-center justify-between mb-3">
                    <IDChip id={hire.id} size="xs" />
                    <button className="text-[#94A3B8] hover:text-[#475569]">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>

                  <h4 className="text-[#0F172A] text-sm font-bold mb-1 group-hover:text-[#10B981] transition-colors">{hire.name}</h4>
                  <p className="text-[10px] text-[#94A3B8] font-medium mb-4">{hire.role} • {hire.dept}</p>

                  <div className="space-y-3 mb-4">
                     <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider">Readiness</span>
                        <span className={cn(
                          "text-[10px] font-bold",
                          hire.readiness === 100 ? "text-[#10B981]" : "text-amber-500"
                        )}>
                          {hire.readiness}%
                        </span>
                     </div>
                     <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${hire.readiness}%` }}
                          className={cn(
                            "h-full rounded-full transition-all duration-1000",
                            hire.readiness === 100 ? "bg-[#10B981]" : "bg-amber-500"
                          )}
                        />
                     </div>
                  </div>

                  {hire.missingItems.length > 0 && (
                    <div className="p-2.5 rounded-lg bg-red-50 border border-red-100 mb-4">
                       <p className="text-[9px] font-black text-red-600 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
                          <AlertCircle className="w-3 h-3" />
                          Missing Items
                       </p>
                       <div className="flex flex-wrap gap-1">
                          {hire.missingItems.map(item => (
                            <span key={item} className="text-[9px] font-bold text-red-700 bg-white px-1.5 py-0.5 rounded border border-red-200">
                              {item}
                            </span>
                          ))}
                       </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-[#F1F5F9]">
                     <div className="flex items-center gap-1.5 text-[#64748B]">
                        <Clock className="w-3 h-3" />
                        <span className="text-[10px] font-bold">Start: {hire.startDate}</span>
                     </div>
                     <div className="flex -space-x-1">
                        <div className="w-6 h-6 rounded-full bg-blue-50 border border-white flex items-center justify-center" title="IT Readiness">
                           <Laptop className="w-3 h-3 text-blue-500" />
                        </div>
                        <div className="w-6 h-6 rounded-full bg-emerald-50 border border-white flex items-center justify-center" title="HR Documents">
                           <ShieldCheck className="w-3 h-3 text-emerald-500" />
                        </div>
                     </div>
                  </div>
                </div>
              ))}

              {stageHires.length === 0 && (
                <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-[#E2E8F0] rounded-2xl text-[#94A3B8]">
                   <p className="text-[11px] font-medium italic">Empty Stage</p>
                </div>
              )}
            </div>
          </div>
      );
    })}
    </div>
  );
}
