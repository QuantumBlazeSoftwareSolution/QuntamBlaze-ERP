"use client";

import React from 'react';
import { 
  Download, 
  Calendar as CalendarIcon, 
  Filter,
  PlusCircle,
  FileText,
  Clock,
  ArrowRightLeft
} from 'lucide-react';
import { HRNavbar } from '@/components/hr/HRNavbar';
import { cn } from '@/lib/utils';
import { AttendanceStats } from '@/components/hr/attendance/AttendanceStats';
import { LivePresenceTracker } from '@/components/hr/attendance/LivePresenceTracker';
import { AttendanceHeatmap } from '@/components/hr/attendance/AttendanceHeatmap';
import { ShiftRotationMatrix } from '@/components/hr/attendance/ShiftRotationMatrix';
import { SwapRequestPortal } from '@/components/hr/attendance/SwapRequestPortal';
import { ShiftRuleConfig } from '@/components/hr/attendance/ShiftRuleConfig';

export default function AttendanceDashboardPage() {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'shifts' | 'swaps' | 'rules'>('overview');

  return (
    <div className="flex-1 bg-[#F8FAFC] min-h-screen flex flex-col">
      <HRNavbar />

      <div className="p-8 max-w-[1600px] mx-auto w-full flex-1">
        {/* Sub-Tabs for Attendance/Shifts */}
        <div className="flex items-center gap-1 bg-[#F1F5F9] p-1.5 rounded-2xl border border-[#E2E8F0] w-fit mb-8 shadow-sm">
           <TabButton 
             active={activeTab === 'overview'} 
             onClick={() => setActiveTab('overview')} 
             label="Presence Overview" 
           />
           <TabButton 
             active={activeTab === 'shifts'} 
             onClick={() => setActiveTab('shifts')} 
             label="Shift Rotations" 
           />
           <TabButton 
             active={activeTab === 'swaps'} 
             onClick={() => setActiveTab('swaps')} 
             label="Swap Portal" 
           />
           <TabButton 
             active={activeTab === 'rules'} 
             onClick={() => setActiveTab('rules')} 
             label="Global Rules" 
           />
        </div>
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
               <h1 className="text-[#0F172A] text-2xl font-bold">Attendance & Presence</h1>
               <div className="bg-[#10B981]/10 text-[#10B981] text-[10px] font-bold px-2 py-0.5 rounded border border-[#10B981]/20 uppercase tracking-widest flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  Live Sync
               </div>
            </div>
            <p className="text-[#475569] text-sm mt-1">Monitor workforce real-time presence and shift compliance.</p>
          </div>

          <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm font-bold text-[#475569] hover:bg-[#F1F5F9] transition-all bg-white shadow-sm">
                <Download className="w-4 h-4 text-[#94A3B8]" />
                <span>Download Logs</span>
             </button>
             <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F172A] text-white text-sm font-bold shadow-lg shadow-[#0F172A]/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                <CalendarIcon className="w-4 h-4" />
                <span>Manage Shifts</span>
             </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
           {activeTab === 'overview' && (
             <>
               {/* Attendance KPI Cards */}
               <AttendanceStats />

               <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  {/* Left: Heatmap Analysis */}
                  <div className="xl:col-span-2">
                     <AttendanceHeatmap />
                  </div>

                  {/* Right: Live Monitor */}
                  <div className="xl:col-span-1">
                     <LivePresenceTracker />
                  </div>
               </div>

               {/* Bottom Section: Alerts & Quick Actions */}
               <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <AlertCard 
                    title="High Absenteeism Alert" 
                    description="Engineering dept shows 15% absenteeism in the last 3 days."
                    type="red"
                  />
                  <AlertCard 
                    title="Shift Overlap Detected" 
                    description="Possible conflict in SH-ENG-26-04 between Night & Morning shifts."
                    type="amber"
                  />
                  <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 flex flex-col items-center justify-center text-center">
                     <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-3">
                        <FileText className="w-6 h-6" />
                     </div>
                     <h4 className="text-sm font-bold text-[#0F172A]">Run Attendance Audit</h4>
                     <p className="text-[11px] text-[#94A3B8] mt-1 mb-4">Validate ATT- logs vs approved leaves.</p>
                     <button className="text-[10px] font-black text-blue-600 hover:underline uppercase tracking-widest">
                        START AUDIT
                     </button>
                  </div>
               </div>
             </>
           )}

           {activeTab === 'shifts' && <ShiftRotationMatrix />}
           {activeTab === 'swaps' && (
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                   <SwapRequestPortal />
                </div>
                <div className="bg-white border border-[#E2E8F0] rounded-3xl p-8 h-fit">
                   <h4 className="text-sm font-black text-[#0F172A] mb-4 flex items-center gap-2">
                      <ArrowRightLeft className="w-4 h-4 text-[#10B981]" />
                      Swap Guidelines
                   </h4>
                   <ul className="space-y-4">
                      <GuidelineItem text="Swaps must be requested at least 24h in advance." />
                      <GuidelineItem text="Both parties must belong to the same department." />
                      <GuidelineItem text="Swap partners must have similar seniority levels." />
                      <GuidelineItem text="Final approval rests with the Department Head." />
                   </ul>
                </div>
             </div>
           )}
           {activeTab === 'rules' && <ShiftRuleConfig />}
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
        active 
          ? "bg-[#0F172A] text-white shadow-lg shadow-[#0F172A]/20" 
          : "text-[#64748B] hover:text-[#0F172A]"
      )}
    >
      {label}
    </button>
  );
}

function GuidelineItem({ text }: { text: string }) {
  return (
    <li className="flex gap-3 items-start">
       <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
       <p className="text-[11px] font-medium text-[#64748B] leading-relaxed">{text}</p>
    </li>
  );
}

function AlertCard({ title, description, type }: { title: string, description: string, type: 'red' | 'amber' }) {
  return (
    <div className={cn(
      "p-6 rounded-3xl border flex flex-col justify-between",
      type === 'red' ? "bg-red-50 border-red-100" : "bg-amber-50 border-amber-100"
    )}>
       <div>
          <h4 className={cn(
            "text-sm font-black mb-1",
            type === 'red' ? "text-red-900" : "text-amber-900"
          )}>{title}</h4>
          <p className={cn(
            "text-xs leading-relaxed",
            type === 'red' ? "text-red-700" : "text-amber-700"
          )}>{description}</p>
       </div>
       <button className={cn(
         "w-fit mt-4 text-[10px] font-black uppercase tracking-widest hover:underline",
         type === 'red' ? "text-red-600" : "text-amber-600"
       )}>
          Investigate
       </button>
    </div>
  );
}
