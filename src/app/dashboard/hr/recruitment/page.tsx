"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusCircle,
  UserPlus,
  LayoutGrid,
  Table as TableIcon,
  Search,
  Filter,
  ChevronDown,
  RefreshCw,
  Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { JobsTable } from "@/components/hr/recruitment/JobsTable";
import { RecruitmentPipeline } from "@/components/hr/recruitment/RecruitmentPipeline";
import { NewJobModal } from "@/components/hr/recruitment/NewJobModal";
import { NewCandidateModal } from "@/components/hr/recruitment/NewCandidateModal";
import { ManageJobsModal } from "@/components/hr/recruitment/ManageJobsModal";
import { HRNavbar } from "@/components/hr/HRNavbar";
import { getRecruitmentDashboardDataAction } from "@/app/actions/hrActions";
import { Candidate, Job, Employee } from "@/types/hr";

export default function RecruitmentPage() {
  const [view, setView] = useState<"pipeline" | "table">("pipeline");
  const [isNewJobModalOpen, setIsNewJobModalOpen] = useState(false);
  const [isNewCandidateModalOpen, setIsNewCandidateModalOpen] = useState(false);
  const [isManageJobsModalOpen, setIsManageJobsModalOpen] = useState(false);

  // Live database states
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch recruitment board dataset
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getRecruitmentDashboardDataAction();
      if (res.success && res.candidates && res.jobs && res.employees) {
        setCandidates(res.candidates);
        setJobs(res.jobs);
        setEmployees(res.employees);
      } else {
        console.error("Failed to load recruitment DB dataset:", res.error);
      }
    } catch (err) {
      console.error("Error retrieving recruitment records:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="flex-1 bg-[#F8FAFC] min-h-screen flex flex-col">
      <HRNavbar />

      <div className="p-8 max-w-[1600px] mx-auto w-full flex-1">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-[#0F172A] text-2xl font-bold">Recruitment</h1>
            <p className="text-[#475569] text-sm mt-1">
              Manage job openings and track candidate progress across the pipeline.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsNewCandidateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm font-bold text-[#475569] hover:bg-[#F1F5F9] transition-all bg-white cursor-pointer active:scale-[0.98]"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Candidate</span>
            </button>
            <button
              onClick={() => setIsManageJobsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm font-bold text-[#475569] hover:bg-[#F1F5F9] transition-all bg-white cursor-pointer active:scale-[0.98]"
            >
              <Briefcase className="w-4 h-4 text-[#10B981]" />
              <span>Manage Openings</span>
            </button>
            <button
              onClick={() => setIsNewJobModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#10B981] text-white text-sm font-bold shadow-lg shadow-[#10B981]/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
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
              onClick={() => setView("pipeline")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer",
                view === "pipeline"
                  ? "bg-[#10B981] text-white shadow-md shadow-[#10B981]/20"
                  : "text-[#64748B] hover:bg-[#F8FAFC]"
              )}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Pipeline</span>
            </button>
            <button
              onClick={() => setView("table")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer",
                view === "table"
                  ? "bg-[#10B981] text-white shadow-md shadow-[#10B981]/20"
                  : "text-[#64748B] hover:bg-[#F8FAFC]"
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
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-sm font-bold text-[#64748B] hover:bg-[#F8FAFC] transition-all cursor-pointer">
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              <ChevronDown className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] bg-white/50 border border-[#E2E8F0] rounded-2xl shadow-sm">
            <RefreshCw className="w-10 h-10 text-[#10B981] animate-spin mb-4" />
            <p className="text-sm font-bold text-[#64748B] uppercase tracking-wider animate-pulse">
              Loading Live Recruitment Dashboard...
            </p>
          </div>
        ) : (
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {view === "pipeline" ? (
              <RecruitmentPipeline candidates={candidates} />
            ) : (
              <JobsTable data={jobs} />
            )}
          </motion.div>
        )}
      </div>

      {/* Dynamic Action Modals */}
      <NewJobModal
        isOpen={isNewJobModalOpen}
        onClose={() => setIsNewJobModalOpen(false)}
        onSuccess={loadData}
        employees={employees}
      />
      <NewCandidateModal
        isOpen={isNewCandidateModalOpen}
        onClose={() => setIsNewCandidateModalOpen(false)}
        onSuccess={loadData}
        jobs={jobs}
        employees={employees}
      />
      <ManageJobsModal
        isOpen={isManageJobsModalOpen}
        onClose={() => setIsManageJobsModalOpen(false)}
        onSuccess={loadData}
        jobs={jobs}
      />
    </div>
  );
}
