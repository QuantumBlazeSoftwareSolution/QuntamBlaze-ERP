"use client";

import React from 'react';
import { 
  Plus, 
  Calendar, 
  FileText, 
  Paperclip, 
  Send,
  AlertTriangle,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function LeaveRequestPortal() {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-3xl p-8 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
           <h3 className="text-[#0F172A] font-bold">Apply for Leave</h3>
           <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-widest mt-1">Submit Request for LEV-ID Generation</p>
        </div>
      </div>

      <div className="flex-1 space-y-6">
         <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
               <label className="text-[10px] font-black text-[#64748B] uppercase tracking-widest ml-1">Leave Type</label>
               <select className="w-full px-4 py-3 rounded-2xl border border-[#F1F5F9] bg-[#F8FAFC] text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer">
                  <option>Annual Leave</option>
                  <option>Sick Leave</option>
                  <option>Casual Leave</option>
               </select>
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black text-[#64748B] uppercase tracking-widest ml-1">Attachment (Optional)</label>
               <div className="w-full px-4 py-3 rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] flex items-center justify-center gap-2 cursor-pointer hover:bg-white transition-all">
                  <Paperclip className="w-4 h-4 text-[#94A3B8]" />
                  <span className="text-[10px] font-black text-[#94A3B8] uppercase">Upload PDF/JPG</span>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
               <label className="text-[10px] font-black text-[#64748B] uppercase tracking-widest ml-1">Start Date</label>
               <input type="date" className="w-full px-4 py-3 rounded-2xl border border-[#F1F5F9] bg-[#F8FAFC] text-sm font-bold focus:outline-none" />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black text-[#64748B] uppercase tracking-widest ml-1">End Date</label>
               <input type="date" className="w-full px-4 py-3 rounded-2xl border border-[#F1F5F9] bg-[#F8FAFC] text-sm font-bold focus:outline-none" />
            </div>
         </div>

         <div className="space-y-2">
            <label className="text-[10px] font-black text-[#64748B] uppercase tracking-widest ml-1">Reason for Leave</label>
            <textarea 
              rows={4} 
              placeholder="Brief description of your leave..."
              className="w-full px-4 py-3 rounded-2xl border border-[#F1F5F9] bg-[#F8FAFC] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all resize-none"
            />
         </div>

         <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex gap-4">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[10px] text-amber-800 leading-relaxed font-medium">
               <span className="font-black">Conflict Warning:</span> Sarah Jenkins (HR) is also on leave during these dates. Approval may be delayed.
            </p>
         </div>
      </div>

      <button className="w-full mt-10 py-4 rounded-2xl bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2">
         <Send className="w-4 h-4" />
         Submit Request
      </button>
    </div>
  );
}
