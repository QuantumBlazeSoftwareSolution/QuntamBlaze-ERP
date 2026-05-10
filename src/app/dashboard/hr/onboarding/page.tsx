"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, 
  Search, 
  Filter, 
  ChevronDown, 
  PlusCircle, 
  LayoutGrid, 
  List,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { OnboardingKanban } from '@/components/hr/onboarding/OnboardingKanban';
import { OnboardingTasklist } from '@/components/hr/onboarding/OnboardingTasklist';
import { WelcomeKitStatus } from '@/components/hr/onboarding/WelcomeKitStatus';

const TABS = ["Overview", "Recruitment", "Employees", "Attendance", "Leave", "Payroll"];

export default function OnboardingPage() {
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const activeTab = "Employees"; // Onboarding is usually under Employee management

  return (
    <div className="flex-1 bg-[#F8FAFC] min-h-screen flex flex-col">
      {/* Sub-navigation bar */}
      <div className="bg-white border-b border-[#E2E8F0] px-8 flex items-center h-14 sticky top-0 z-30">
        <div className="flex gap-8 h-full">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={cn(
                "h-full px-1 text-sm font-bold transition-all border-b-2 flex items-center",
                activeTab === tab
                  ? "border-[#10B981] text-[#10B981]"
                  : "border-transparent text-[#94A3B8] hover:text-[#475569]"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="p-8 max-w-[1600px] mx-auto w-full flex-1">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
               <h1 className="text-[#0F172A] text-2xl font-bold">Onboarding Hub</h1>
               <div className="bg-[#10B981]/10 text-[#10B981] text-[10px] font-bold px-2 py-0.5 rounded border border-[#10B981]/20 uppercase tracking-widest flex items-center gap-1.5">
                  <Rocket className="w-3 h-3" />
                  12 Active Hires
               </div>
            </div>
            <p className="text-[#475569] text-sm">Managing the first 90 days of employee excellence.</p>
          </div>

          <div className="flex items-center gap-3">
             <div className="flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-xl border border-[#E2E8F0]">
                <button 
                  onClick={() => setView('kanban')}
                  className={cn(
                    "p-2 rounded-lg transition-all",
                    view === 'kanban' ? "bg-white text-[#10B981] shadow-sm" : "text-[#94A3B8] hover:text-[#475569]"
                  )}
                >
                   <LayoutGrid className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setView('list')}
                  className={cn(
                    "p-2 rounded-lg transition-all",
                    view === 'list' ? "bg-white text-[#10B981] shadow-sm" : "text-[#94A3B8] hover:text-[#475569]"
                  )}
                >
                   <List className="w-4 h-4" />
                </button>
             </div>
             <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#10B981] text-white text-sm font-bold shadow-lg shadow-[#10B981]/20 hover:scale-[1.02] transition-all">
                <PlusCircle className="w-4 h-4" />
                <span>New Onboarding</span>
             </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
           <StatCard label="Avg. Readiness" value="92%" trend="+4%" icon={TrendingUp} color="text-emerald-500" bg="bg-emerald-50" />
           <StatCard label="Pre-arrival Tasks" value="48/52" trend="On Track" icon={CheckCircle2} color="text-blue-500" bg="bg-blue-50" />
           <StatCard label="90-Day Retention" value="98.4%" trend="+0.2%" icon={Sparkles} color="text-violet-500" bg="bg-violet-50" />
           <StatCard label="Hiring Velocity" value="14 Days" trend="-2 Days" icon={Users} color="text-amber-500" bg="bg-amber-50" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
           <div className="xl:col-span-3">
              <OnboardingKanban />
           </div>
           <div className="xl:col-span-1 space-y-8">
              <WelcomeKitStatus />
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
                 <h3 className="text-[#0F172A] font-bold text-sm mb-4">Upcoming Milestones</h3>
                 <div className="space-y-4">
                    <MilestoneItem label="30-Day Check" person="Alex Mercer" date="June 15" />
                    <MilestoneItem label="60-Day Review" person="Marcus Thorne" date="July 20" />
                    <MilestoneItem label="Welcome Lunch" person="Elena Vance" date="May 12" isToday />
                 </div>
                 <button className="w-full mt-6 flex items-center justify-center gap-2 text-[#3B82F6] text-xs font-bold hover:underline">
                    View All Milestones
                    <ArrowRight className="w-3 h-3" />
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, trend, icon: Icon, color, bg }: any) {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
       <div className="flex items-center justify-between mb-4">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", bg, color)}>
             <Icon className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold text-[#10B981] px-2 py-0.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0]">
             {trend}
          </span>
       </div>
       <p className="text-[#94A3B8] text-xs font-bold uppercase tracking-widest">{label}</p>
       <h3 className="text-[#0F172A] text-2xl font-black mt-1">{value}</h3>
    </div>
  );
}

function MilestoneItem({ label, person, date, isToday }: any) {
  return (
    <div className={cn(
      "p-3 rounded-xl border transition-all flex items-center justify-between",
      isToday ? "bg-emerald-50 border-emerald-100" : "bg-[#F8FAFC] border-[#F1F5F9]"
    )}>
       <div className="min-w-0">
          <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">{label}</p>
          <p className="text-xs font-bold text-[#475569] truncate">{person}</p>
       </div>
       <div className="text-right">
          <p className={cn("text-xs font-bold", isToday ? "text-[#10B981]" : "text-[#475569]")}>{date}</p>
          {isToday && <p className="text-[8px] font-black text-[#10B981] uppercase">Today</p>}
       </div>
    </div>
  );
}

function CheckCircle2({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
