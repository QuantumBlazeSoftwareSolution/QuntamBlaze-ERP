"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Pencil, 
  Trash2, 
  Clock, 
  User, 
  MessageSquare,
  CheckCircle2,
  Paperclip,
  Share2,
  MoreVertical,
  ChevronRight,
  Plus
} from 'lucide-react';
import { useTaskPanel } from '@/hooks/useTaskPanel';
import { IDChip } from '@/components/ui/IDChip';
import { cn } from '@/lib/utils';

export function TaskDetailPanel() {
  const { selectedTaskId, closeTask } = useTaskPanel();
  const [activeTab, setActiveTab] = useState<'details' | 'activity'>('details');

  if (!selectedTaskId) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeTask}
        className="fixed inset-0 bg-slate-900/20 backdrop-blur-[1px] z-[110]"
      />

      {/* Slide-over Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 h-full w-[480px] bg-white border-l border-[#E2E8F0] shadow-2xl z-[120] flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#F1F5F9] flex items-center justify-between">
          <div className="flex items-center gap-3">
             <IDChip id={selectedTaskId} variant="accent" className="bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]" />
             <div className="flex items-center gap-1 text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">
                PRJ-26-005 <ChevronRight className="w-3 h-3" /> CLI-GOOG-01
             </div>
          </div>
          <div className="flex items-center gap-2">
             <button className="p-2 rounded-lg hover:bg-[#F8FAFC] text-[#94A3B8] hover:text-[#0F172A] transition-all">
                <Share2 className="w-4 h-4" />
             </button>
             <button 
                onClick={closeTask}
                className="p-2 rounded-lg hover:bg-[#F8FAFC] text-[#94A3B8] hover:text-[#0F172A] transition-all"
             >
                <X className="w-4 h-4" />
             </button>
          </div>
        </div>

        {/* Title Area */}
        <div className="px-6 py-8">
           <div className="group relative">
              <h2 className="text-2xl font-black text-[#0F172A] leading-tight outline-none focus:border-b-2 focus:border-[#10B981] pb-1 cursor-text" contentEditable spellCheck={false}>
                 Cloud Infrastructure Audit & Scalability Review
              </h2>
           </div>
        </div>

        {/* Tabs */}
        <div className="px-6 border-b border-[#F1F5F9] flex items-center gap-6">
           <button 
             onClick={() => setActiveTab('details')}
             className={cn(
               "pb-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative",
               activeTab === 'details' ? "text-[#10B981]" : "text-[#94A3B8] hover:text-[#475569]"
             )}
           >
              Task Parameters
              {activeTab === 'details' && <motion.div layoutId="taskTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#10B981]" />}
           </button>
           <button 
             onClick={() => setActiveTab('activity')}
             className={cn(
               "pb-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative",
               activeTab === 'activity' ? "text-[#10B981]" : "text-[#94A3B8] hover:text-[#475569]"
             )}
           >
              Activity Feed
              {activeTab === 'activity' && <motion.div layoutId="taskTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#10B981]" />}
           </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
           {activeTab === 'details' ? (
             <div className="p-6 space-y-10">
                {/* Meta Grid */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                   <MetaItem label="Operational Status" icon={<CheckCircle2 className="w-3.5 h-3.5" />}>
                      <div className="flex items-center gap-2 text-xs font-bold text-[#10B981] bg-[#ECFDF5] px-2 py-1 rounded-lg border border-[#A7F3D0] w-fit">
                         <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                         IN PROGRESS
                      </div>
                   </MetaItem>
                   <MetaItem label="Strategic Priority" icon={<AlertTriangle />}>
                      <div className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-lg border border-red-100 w-fit">
                         CRITICAL
                      </div>
                   </MetaItem>
                   <MetaItem label="Designated Owner" icon={<User />}>
                      <div className="flex items-center gap-2">
                         <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px] font-black border-2 border-white shadow-sm">JD</div>
                         <span className="text-xs font-bold text-[#0F172A]">John Doe</span>
                      </div>
                   </MetaItem>
                   <MetaItem label="Target Deadline" icon={<Clock />}>
                      <span className="text-xs font-bold text-[#0F172A]">May 24, 2026</span>
                   </MetaItem>
                </div>

                {/* Description */}
                <div className="space-y-4">
                   <h4 className="text-[10px] font-black text-[#94A3B8] uppercase tracking-[0.2em] flex items-center justify-between">
                      Scope & Deliverables
                      <Pencil className="w-3 h-3 cursor-pointer hover:text-[#10B981]" />
                   </h4>
                   <p className="text-sm text-[#475569] leading-relaxed">
                      Comprehensive audit of the existing multi-region cluster configuration. Focus on identifying latency bottlenecks in the API Gateway and potential security gaps in the VPC peering layer. Deliverable: PDF Audit Report.
                   </p>
                </div>

                {/* Subtasks */}
                <div className="space-y-4">
                   <h4 className="text-[10px] font-black text-[#94A3B8] uppercase tracking-[0.2em] flex items-center justify-between">
                      Operational Checkpoints
                      <span className="text-[#10B981] font-black">2/4</span>
                   </h4>
                   <div className="space-y-2">
                      <SubTaskItem id="STSK-01" label="VPC Peering Review" completed />
                      <SubTaskItem id="STSK-02" label="IAM Role Audit" completed />
                      <SubTaskItem id="STSK-03" label="Latency Profiling" />
                      <SubTaskItem id="STSK-04" label="Report Generation" />
                      <button className="flex items-center gap-2 text-[10px] font-black text-[#10B981] uppercase tracking-widest mt-2 hover:translate-x-1 transition-transform">
                         <Plus className="w-3 h-3" /> Add Checkpoint
                      </button>
                   </div>
                </div>
             </div>
           ) : (
             <div className="flex flex-col h-full bg-[#F8FAFC]">
                <div className="flex-1 p-6 space-y-6">
                   <ActivityItem 
                     user="JD" 
                     color="bg-emerald-500" 
                     action="Updated priority to Critical" 
                     time="2 hours ago" 
                   />
                   <ActivityItem 
                     user="AL" 
                     color="bg-blue-500" 
                     action="Attached Audit_Preliminary.pdf" 
                     time="5 hours ago" 
                   />
                   <CommentItem 
                     user="AL" 
                     name="Alice Lee" 
                     color="bg-blue-500" 
                     text="I've noticed a significant lag in the US-EAST-1 region during the initial ping. Can someone verify the ingress rules?" 
                     time="10:42 AM" 
                   />
                </div>
                <div className="p-4 bg-white border-t border-[#F1F5F9]">
                   <div className="relative group">
                      <input 
                        placeholder="Add a comment or @mention..."
                        className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl h-11 pl-4 pr-12 text-sm font-bold text-[#0F172A] focus:outline-none focus:border-[#10B981] transition-all"
                      />
                      <button className="absolute right-2 top-1.5 p-1.5 rounded-lg bg-[#10B981] text-white shadow-lg shadow-[#10B981]/20">
                         <ChevronRight className="w-4 h-4" />
                      </button>
                   </div>
                </div>
             </div>
           )}
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-[#F1F5F9] flex items-center justify-between bg-white">
           <button className="flex items-center gap-2 text-[10px] font-black text-red-500 uppercase tracking-[0.2em] hover:bg-red-50 px-3 py-2 rounded-lg transition-all">
              <Trash2 className="w-3.5 h-3.5" />
              Terminate Task
           </button>
           <div className="flex items-center gap-4">
              <Paperclip className="w-4 h-4 text-[#94A3B8] cursor-pointer hover:text-[#475569]" />
              <div className="h-4 w-[1px] bg-[#E2E8F0]" />
              <button 
                onClick={closeTask}
                className="bg-[#0F172A] text-white text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2.5 rounded-xl shadow-lg hover:scale-105 transition-all"
              >
                 Finalize Edits
              </button>
           </div>
        </div>
      </motion.div>
    </>
  );
}

function MetaItem({ label, icon, children }: { label: string, icon: React.ReactElement, children: React.ReactNode }) {
  return (
    <div className="space-y-2 group cursor-default">
       <div className="flex items-center gap-2 text-[9px] font-black text-[#94A3B8] uppercase tracking-[0.15em]">
          {React.cloneElement(icon, { className: "w-3 h-3" } as any)}
          {label}
       </div>
       {children}
    </div>
  );
}

function SubTaskItem({ id, label, completed }: { id: string, label: string, completed?: boolean }) {
  return (
    <div className="flex items-center gap-3 group">
       <div className={cn(
         "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer",
         completed ? "bg-[#10B981] border-[#10B981]" : "bg-white border-[#E2E8F0] hover:border-[#10B981]"
       )}>
          {completed && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><CheckCircle2 className="w-3 h-3 text-white" /></motion.div>}
       </div>
       <div className="flex flex-col">
          <span className={cn(
            "text-xs font-bold transition-all",
            completed ? "text-[#94A3B8] line-through" : "text-[#475569] group-hover:text-[#0F172A]"
          )}>
             {label}
          </span>
          <span className="text-[8px] font-mono text-[#94A3B8]">{id}</span>
       </div>
    </div>
  );
}

function ActivityItem({ user, color, action, time }: { user: string, color: string, action: string, time: string }) {
  return (
    <div className="flex items-center gap-3">
       <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center text-white text-[9px] font-black", color)}>{user}</div>
       <div className="flex flex-col">
          <p className="text-xs font-bold text-[#475569]">{action}</p>
          <p className="text-[9px] font-medium text-[#94A3B8]">{time}</p>
       </div>
    </div>
  );
}

function CommentItem({ user, name, color, text, time }: { user: string, name: string, color: string, text: string, time: string }) {
  return (
    <div className="space-y-2">
       <div className="flex items-center gap-2">
          <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center text-white text-[9px] font-black", color)}>{user}</div>
          <span className="text-[11px] font-black text-[#0F172A] uppercase">{name}</span>
          <span className="text-[9px] font-medium text-[#94A3B8] ml-auto">{time}</span>
       </div>
       <div className="bg-white border border-[#E2E8F0] p-3 rounded-2xl rounded-tl-none shadow-sm ml-8">
          <p className="text-xs font-medium text-[#475569] leading-relaxed">{text}</p>
       </div>
    </div>
  );
}

function AlertTriangle({ className }: { className?: string }) {
  return (
    <svg 
      className={className}
      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}
