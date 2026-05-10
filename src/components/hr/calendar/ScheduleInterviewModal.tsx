"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Calendar, 
  Clock, 
  Video, 
  User, 
  Users, 
  AlertCircle, 
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Link as LinkIcon,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { IDChip } from '@/components/ui/IDChip';

interface ScheduleInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INTERVIEW_TYPES = [
  "Phone Screen",
  "Technical Interview",
  "Culture Fit",
  "Final Round",
  "HR Round"
];

const DURATIONS = [
  { label: '30 min', value: 30 },
  { label: '45 min', value: 45 },
  { label: '60 min', value: 60 },
  { label: '90 min', value: 90 },
];

export function ScheduleInterviewModal({ isOpen, onClose }: ScheduleInterviewModalProps) {
  const [intId, setIntId] = useState("");
  const [showConflict, setShowConflict] = useState(false);

  useEffect(() => {
    // INT-YY-Seq
    setIntId(`INT-26-052`);
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-[#F1F5F9] flex items-center justify-between bg-[#F8FAFC]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#10B981] flex items-center justify-center text-white">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-[#0F172A] text-lg font-bold">Schedule Interview</h2>
                <div className="flex items-center gap-2 mt-0.5">
                   <span className="text-[10px] font-bold text-[#10B981] bg-[#ECFDF5] px-1.5 py-0.5 rounded border border-[#A7F3D0]">
                     {intId}
                   </span>
                   <span className="text-[#94A3B8] text-[10px] font-medium uppercase tracking-wider">New Session</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-[#E2E8F0] rounded-full transition-colors text-[#64748B]">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-8 space-y-6 overflow-y-auto max-h-[70vh] scrollbar-hide">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest px-1">Candidate</label>
              <div className="relative group">
                 <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                 <select className="w-full h-11 pl-11 pr-4 rounded-xl border border-[#E2E8F0] text-sm appearance-none bg-white focus:ring-2 focus:ring-[#10B981]/20 transition-all">
                    <option>Search and select candidate...</option>
                    <option>Alex Mercer (CND-26-089)</option>
                    <option>Marcus Thorne (CND-26-104)</option>
                 </select>
                 <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-1.5">
                 <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest px-1">Interview Type</label>
                 <select className="w-full h-11 px-4 rounded-xl border border-[#E2E8F0] text-sm bg-white focus:ring-2 focus:ring-[#10B981]/20 transition-all">
                    {INTERVIEW_TYPES.map(t => <option key={t}>{t}</option>)}
                 </select>
               </div>
               <div className="space-y-1.5">
                 <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest px-1">Duration</label>
                 <select className="w-full h-11 px-4 rounded-xl border border-[#E2E8F0] text-sm bg-white focus:ring-2 focus:ring-[#10B981]/20 transition-all">
                    {DURATIONS.map(d => <option key={d.value}>{d.label}</option>)}
                 </select>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-1.5">
                 <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest px-1">Date</label>
                 <input type="date" className="w-full h-11 px-4 rounded-xl border border-[#E2E8F0] text-sm focus:ring-2 focus:ring-[#10B981]/20 transition-all" />
               </div>
               <div className="space-y-1.5">
                 <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest px-1">Time</label>
                 <input 
                   type="time" 
                   onChange={(e) => setShowConflict(e.target.value === "10:00")}
                   className="w-full h-11 px-4 rounded-xl border border-[#E2E8F0] text-sm focus:ring-2 focus:ring-[#10B981]/20 transition-all" 
                 />
               </div>
            </div>

            <AnimatePresence>
               {showConflict && (
                 <motion.div 
                   initial={{ opacity: 0, height: 0 }}
                   animate={{ opacity: 1, height: 'auto' }}
                   exit={{ opacity: 0, height: 0 }}
                   className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex gap-3"
                 >
                    <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                       <p className="text-xs font-bold text-amber-900">Interviewer Conflict Detected</p>
                       <p className="text-[10px] text-amber-700 mt-1 leading-relaxed">
                         Alex Mercer has another session scheduled (INT-26-047) at this time. Please select another slot or interviewer.
                       </p>
                    </div>
                 </motion.div>
               )}
            </AnimatePresence>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest px-1">Interviewers</label>
              <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-3">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">AM</div>
                       <span className="text-sm font-semibold text-[#475569]">Alex Mercer</span>
                    </div>
                    <X className="w-4 h-4 text-[#94A3B8] cursor-pointer hover:text-red-500 transition-colors" />
                 </div>
                 <button className="w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-[#E2E8F0] rounded-lg text-[10px] font-bold text-[#94A3B8] hover:bg-[#F1F5F9] transition-all">
                    <Plus
                     className="w-3 h-3" />
                    ADD INTERVIEWER
                 </button>
              </div>
            </div>

            <div className="space-y-1.5">
               <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest px-1">Meeting Details</label>
               <div className="relative group">
                 <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                 <input 
                   type="text" 
                   placeholder="https://zoom.us/j/..."
                   className="w-full h-11 pl-11 pr-4 rounded-xl border border-[#E2E8F0] text-sm focus:ring-2 focus:ring-[#10B981]/20 transition-all"
                 />
                 <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <span className="text-[10px] font-bold text-[#3B82F6] bg-blue-50 px-2 py-1 rounded cursor-pointer hover:bg-blue-100 transition-all">Auto-generate</span>
                 </div>
               </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-[#F1F5F9] bg-[#F8FAFC] flex justify-end gap-3">
            <button 
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-[#64748B] hover:bg-[#E2E8F0] transition-all"
            >
              Cancel
            </button>
            <button 
              className="px-8 py-2.5 rounded-xl text-sm font-bold bg-[#10B981] text-white shadow-lg shadow-[#10B981]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Schedule Session
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
