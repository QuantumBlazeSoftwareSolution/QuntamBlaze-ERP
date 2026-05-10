"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusCircle, 
  UserPlus, 
  LayoutGrid, 
  Table as TableIcon, 
  Search, 
  Filter,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { JobsTable } from '@/components/hr/recruitment/JobsTable';
import { RecruitmentPipeline } from '@/components/hr/recruitment/RecruitmentPipeline';
import { NewJobModal } from '@/components/hr/recruitment/NewJobModal';
import { HRNavbar } from "@/components/hr/HRNavbar";
import { MOCK_JOBS, MOCK_CANDIDATES } from '@/lib/mockData/hr';

export default function RecruitmentPage() {
  const [view, setView] = useState<'pipeline' | 'table'>('pipeline');
  const [isNewJobModalOpen, setIsNewJobModalOpen] = useState(false);

  return (
    <div className="flex-1 bg-[#F8FAFC] min-h-screen flex flex-col">
      <HRNavbar />

      <div className="p-8 max-w-[1600px] mx-auto w-full flex-1">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-[#0F172A] text-2xl font-bold">Recruitment</h1>
            <p className="text-[#475569] text-sm mt-1">Manage job openings and track candidate progress across the pipeline.</p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm font-bold text-[#475569] hover:bg-[#F1F5F9] transition-all bg-white">
              <UserPlus className="w-4 h-4" />
              <span>Add Candidate</span>
            </button>
            <button 
              onClick={() => setIsNewJobModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#10B981] text-white text-sm font-bold shadow-lg shadow-[#10B981]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Job Opening</span>
            </button>
          </div>
        </div>

        {/* Toolbar Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-[#E2E8F0] shadow-sm w-fit">
            <button
              onClick={() => setView('pipeline')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
                view === 'pipeline' ? "bg-[#10B981] text-white shadow-md shadow-[#10B981]/20" : "text-[#64748B] hover:bg-[#F8FAFC]"
              )}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Pipeline</span>
            </button>
            <button
              onClick={() => setView('table')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
                view === 'table' ? "bg-[#10B981] text-white shadow-md shadow-[#10B981]/20" : "text-[#64748B] hover:bg-[#F8FAFC]"
              )}
            >
              <TableIcon className="w-4 h-4" />
              <span>Job Table</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] group-focus-within:text-[#10B981] transition-colors" />
              <input 
                type="text" 
                placeholder="Search candidates or jobs..."
                className="pl-10 pr-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-sm font-bold text-[#64748B] hover:bg-[#F8FAFC] transition-all">
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              <ChevronDown className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>

        {/* Content Section */}
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {view === 'pipeline' ? (
            <RecruitmentPipeline candidates={MOCK_CANDIDATES} />
          ) : (
            <JobsTable data={MOCK_JOBS} />
          )}
        </motion.div>
      </div>

      <NewJobModal 
        isOpen={isNewJobModalOpen} 
        onClose={() => setIsNewJobModalOpen(false)} 
      />
    </div>
  );
}
