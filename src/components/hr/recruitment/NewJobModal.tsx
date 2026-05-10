"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Briefcase, Plus, MapPin, DollarSign, Users, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Department, SeniorityLevel, WorkLocationType } from '@/types/hr';

interface NewJobModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEPARTMENTS: Department[] = ["Engineering", "Finance", "Design", "Marketing", "Operations", "HR", "Sales"];
const SENIORITY: SeniorityLevel[] = ["Junior", "Mid", "Senior", "Lead", "Director"];
const EMPLOYMENT_TYPES = ["Full-Time", "Part-Time", "Contract", "Internship"];
const LOCATIONS: WorkLocationType[] = ["Remote", "Hybrid", "On-Site"];

export function NewJobModal({ isOpen, onClose }: NewJobModalProps) {
  const [dept, setDept] = useState<Department>("Engineering");
  const [jobId, setJobId] = useState("");

  useEffect(() => {
    // Simulate ID Engine logic: JOB-[Dept]-YY-Seq
    const deptCode = dept.substring(0, 3).toUpperCase();
    const seq = "012"; // Mock sequence
    setJobId(`JOB-${deptCode}-26-${seq}`);
  }, [dept]);

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
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-[#F1F5F9] flex items-center justify-between bg-[#F8FAFC]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#10B981] flex items-center justify-center text-white">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-[#0F172A] text-lg font-bold">Create Job Opening</h2>
                <div className="flex items-center gap-2 mt-0.5">
                   <span className="text-[10px] font-bold text-[#10B981] bg-[#ECFDF5] px-1.5 py-0.5 rounded border border-[#A7F3D0]">
                     {jobId}
                   </span>
                   <span className="text-[#94A3B8] text-[10px] font-medium uppercase tracking-wider">Draft Mode</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-[#E2E8F0] rounded-full transition-colors text-[#64748B]">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-8 overflow-y-auto space-y-8 scrollbar-hide">
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2 space-y-1.5">
                <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest px-1">Job Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Senior Software Engineer"
                  className="w-full h-11 px-4 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest px-1">Department</label>
                <select 
                  value={dept}
                  onChange={(e) => setDept(e.target.value as Department)}
                  className="w-full h-11 px-4 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all bg-white"
                >
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest px-1">Employment Type</label>
                <div className="flex bg-[#F1F5F9] p-1 rounded-xl gap-1">
                  {EMPLOYMENT_TYPES.slice(0, 3).map(type => (
                    <button 
                      key={type}
                      className={cn(
                        "flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all",
                        type === "Full-Time" ? "bg-white text-[#10B981] shadow-sm" : "text-[#64748B] hover:text-[#475569]"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest px-1">Seniority Level</label>
                <select className="w-full h-11 px-4 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all bg-white">
                  {SENIORITY.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest px-1">Location Type</label>
                <div className="flex bg-[#F1F5F9] p-1 rounded-xl gap-1">
                  {LOCATIONS.map(type => (
                    <button 
                      key={type}
                      className={cn(
                        "flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all",
                        type === "Remote" ? "bg-white text-[#10B981] shadow-sm" : "text-[#64748B] hover:text-[#475569]"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-[#F1F5F9]">
              <div className="flex items-center gap-2 text-[#64748B]">
                <Info className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Salary & Openings</span>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-1.5 relative">
                  <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest px-1">Min Salary</label>
                  <DollarSign className="absolute left-3 bottom-3.5 w-4 h-4 text-[#94A3B8]" />
                  <input type="number" placeholder="0" className="w-full h-11 pl-9 pr-4 rounded-xl border border-[#E2E8F0] text-sm" />
                </div>
                <div className="space-y-1.5 relative">
                  <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest px-1">Max Salary</label>
                  <DollarSign className="absolute left-3 bottom-3.5 w-4 h-4 text-[#94A3B8]" />
                  <input type="number" placeholder="0" className="w-full h-11 pl-9 pr-4 rounded-xl border border-[#E2E8F0] text-sm" />
                </div>
                <div className="space-y-1.5 relative">
                  <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest px-1">Openings</label>
                  <Users className="absolute left-3 bottom-3.5 w-4 h-4 text-[#94A3B8]" />
                  <input type="number" placeholder="1" className="w-full h-11 pl-9 pr-4 rounded-xl border border-[#E2E8F0] text-sm" />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest px-1">Job Description</label>
              <div className="w-full rounded-xl border border-[#E2E8F0] min-h-[120px] p-4 text-sm text-[#475569] italic bg-[#F8FAFC]">
                Tiptap Rich Text Editor would be initialized here...
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-[#F1F5F9] bg-[#F8FAFC] flex justify-end gap-3">
            <button 
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-[#64748B] hover:bg-[#E2E8F0] transition-all"
            >
              Discard
            </button>
            <button 
              className="px-8 py-2.5 rounded-xl text-sm font-bold bg-[#10B981] text-white shadow-lg shadow-[#10B981]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Post Opening
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
