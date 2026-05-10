"use client";

import React from 'react';
import { 
  Laptop, 
  ShieldCheck, 
  Users, 
  FileText, 
  CreditCard,
  CheckSquare,
  Square,
  Clock,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const CATEGORIES = [
  { id: 'IT', label: 'Hardware & Access', icon: Laptop, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'HR', label: 'Documents & Compliance', icon: FileText, color: 'text-violet-500', bg: 'bg-violet-50' },
  { id: 'Finance', label: 'Payroll & Benefits', icon: CreditCard, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { id: 'Team', label: 'Social & Team', icon: Users, color: 'text-amber-500', bg: 'bg-amber-50' },
];

const MOCK_TASKS = [
  { id: 1, title: 'Provision Workstation (M3 Max Laptop)', category: 'IT', isCompleted: false, dueDate: 'May 14', priority: 'High' },
  { id: 2, title: 'Signed Employment Contract', category: 'HR', isCompleted: true, dueDate: 'May 10', priority: 'Critical' },
  { id: 3, title: 'Setup GitHub & Slack Access', category: 'IT', isCompleted: false, dueDate: 'May 15', priority: 'High' },
  { id: 4, title: 'Introductory Team Coffee Chat', category: 'Team', isCompleted: false, dueDate: 'May 16', priority: 'Medium' },
  { id: 5, title: 'Direct Deposit Form Submission', category: 'Finance', isCompleted: false, dueDate: 'May 15', priority: 'High' },
];

export function OnboardingTasklist() {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
           <h3 className="text-[#0F172A] font-bold">Requirement Checklist</h3>
           <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-widest mt-1">Onboarding Plan: ONB-EMP-ENG-26-001-01</p>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-[10px] font-bold text-[#64748B]">Progress:</span>
           <div className="w-32 h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
              <div className="h-full bg-[#10B981] w-1/5 rounded-full" />
           </div>
           <span className="text-[10px] font-bold text-[#10B981]">20%</span>
        </div>
      </div>

      <div className="space-y-6 flex-1 overflow-y-auto scrollbar-hide">
        {CATEGORIES.map((cat) => {
          const catTasks = MOCK_TASKS.filter(t => t.category === cat.id);
          const Icon = cat.icon;

          return (
            <div key={cat.id} className="space-y-3">
              <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-lg border border-transparent w-fit", cat.bg)}>
                 <Icon className={cn("w-3.5 h-3.5", cat.color)} />
                 <span className={cn("text-[10px] font-bold uppercase tracking-wider", cat.color)}>{cat.label}</span>
              </div>

              <div className="space-y-2 ml-2">
                {catTasks.map(task => (
                  <div 
                    key={task.id} 
                    className="flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-[#F1F5F9] hover:bg-[#F8FAFC] transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                       <button className={cn(
                         "p-0.5 rounded transition-colors",
                         task.isCompleted ? "text-[#10B981]" : "text-[#CBD5E1] group-hover:text-[#94A3B8]"
                       )}>
                          {task.isCompleted ? <CheckSquare className="w-5 h-5 fill-current text-white bg-[#10B981] rounded" /> : <Square className="w-5 h-5" />}
                       </button>
                       <div>
                          <p className={cn(
                            "text-sm font-semibold transition-all",
                            task.isCompleted ? "text-[#94A3B8] line-through" : "text-[#475569]"
                          )}>
                            {task.title}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                             <div className="flex items-center gap-1 text-[10px] text-[#94A3B8]">
                                <Clock className="w-3 h-3" />
                                {task.dueDate}
                             </div>
                             <span className={cn(
                               "text-[9px] font-black uppercase tracking-tighter px-1 rounded",
                               task.priority === 'Critical' ? "text-red-500 bg-red-50" : task.priority === 'High' ? "text-amber-500 bg-amber-50" : "text-blue-500 bg-blue-50"
                             )}>
                               {task.priority}
                             </span>
                          </div>
                       </div>
                    </div>

                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="text-[10px] font-bold text-[#3B82F6] hover:underline">Assign to Dept</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-[#F1F5F9]">
         <button className="w-full py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] text-xs font-bold hover:bg-[#F1F5F9] transition-all">
            + Custom Onboarding Task
         </button>
      </div>
    </div>
  );
}
