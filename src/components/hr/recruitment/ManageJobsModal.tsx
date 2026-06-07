"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Briefcase,
  Search,
  AlertCircle,
  Check,
  Power,
  RefreshCw,
  FolderOpen,
  MapPin,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Job, JobStatus } from "@/types/hr";
import { IDChip } from "@/components/ui/IDChip";
import { updateJobStatusAction } from "@/app/actions/hrActions";

interface ManageJobsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  jobs: Job[];
}

const deptColorMap: Record<string, string> = {
  Engineering: "bg-blue-50 text-blue-600 border-blue-100",
  Finance: "bg-amber-50 text-amber-600 border-amber-100",
  Design: "bg-violet-50 text-violet-600 border-violet-100",
  Marketing: "bg-pink-50 text-pink-600 border-pink-100",
  Operations: "bg-teal-50 text-teal-600 border-teal-100",
  HR: "bg-cyan-50 text-cyan-600 border-cyan-100",
  Sales: "bg-red-50 text-red-600 border-red-100",
};

export function ManageJobsModal({ isOpen, onClose, onSuccess, jobs }: ManageJobsModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"Active" | "Inactive">("Active");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleToggleStatus = async (jobId: string, currentStatus: JobStatus) => {
    setUpdatingId(jobId);
    setError("");
    setSuccessMsg("");

    const newStatus: JobStatus = currentStatus === "Active" ? "Closed" : "Active";

    try {
      const res = await updateJobStatusAction(jobId, newStatus);
      if (res.success) {
        setSuccessMsg(`Job position status updated to ${newStatus.toUpperCase()} successfully!`);
        onSuccess();
        setTimeout(() => setSuccessMsg(""), 2000);
      } else {
        setError(res.error || "Failed to update job status.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter jobs by tab (Active vs Inactive [Closed, Paused, Draft]) and search term
  const filteredJobs = jobs.filter((job) => {
    const matchesTab =
      activeTab === "Active"
        ? job.status === "Active"
        : job.status === "Closed" || job.status === "Paused" || job.status === "Draft";

    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-sm"
        />

        {/* Modal Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-[#F1F5F9] flex items-center justify-between bg-[#F8FAFC]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 border border-[#10B981]/25 flex items-center justify-center text-[#10B981]">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-[#0F172A] text-lg font-bold">Manage Job Openings</h2>
                <p className="text-[#64748B] text-xs">
                  Review active positions and toggle recruitment statuses.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#E2E8F0] rounded-full transition-colors text-[#64748B] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search and Tabs Controller */}
          <div className="p-6 border-b border-[#F1F5F9] space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              {/* Custom Tabs */}
              <div className="flex bg-[#F1F5F9] p-1 rounded-xl w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab("Active")}
                  className={cn(
                    "flex-1 sm:flex-initial px-6 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap",
                    activeTab === "Active"
                      ? "bg-white text-[#10B981] shadow-sm font-extrabold"
                      : "text-[#64748B] hover:text-[#475569]"
                  )}
                >
                  Active Openings ({jobs.filter((j) => j.status === "Active").length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("Inactive")}
                  className={cn(
                    "flex-1 sm:flex-initial px-6 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap",
                    activeTab === "Inactive"
                      ? "bg-white text-rose-500 shadow-sm font-extrabold"
                      : "text-[#64748B] hover:text-[#475569]"
                  )}
                >
                  Closed / Paused ({jobs.filter((j) => j.status !== "Active").length})
                </button>
              </div>

              {/* Search input */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input
                  type="text"
                  placeholder="Filter by job ID, title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-[#E2E8F0] rounded-xl text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#10B981]/25 focus:border-[#10B981] transition-all"
                />
              </div>
            </div>

            {/* Alert banners */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-600 p-3.5 rounded-xl text-xs font-bold"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
              {successMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 text-emerald-600 p-3.5 rounded-xl text-xs font-bold"
                >
                  <Check className="w-4 h-4 flex-shrink-0" />
                  <span>{successMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Open Jobs List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[45vh] min-h-[300px] custom-scrollbar bg-slate-50/50">
            {filteredJobs.length === 0 ? (
              <div className="text-center py-16 text-text-muted flex flex-col items-center justify-center gap-3">
                <FolderOpen className="w-12 h-12 stroke-[1.2] text-[#94A3B8]" />
                <h4 className="font-bold text-sm text-[#475569]">No positions found</h4>
                <p className="text-xs text-[#94A3B8] max-w-[280px]">
                  No job positions match the selected filter criteria or search query.
                </p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {filteredJobs.map((job) => {
                  const isJobActive = job.status === "Active";
                  const isUpdating = updatingId === job.id;

                  return (
                    <motion.div
                      layout
                      key={job.id}
                      className={cn(
                        "bg-white border rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-[#10B981]/25 hover:shadow-sm",
                        !isJobActive && "border-dashed opacity-80"
                      )}
                    >
                      <div className="space-y-2 max-w-[70%]">
                        <div className="flex flex-wrap items-center gap-2">
                          <IDChip id={job.id} size="xs" />
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider",
                              deptColorMap[job.department] || "bg-gray-50 text-gray-600 border-gray-100"
                            )}
                          >
                            {job.department}
                          </span>
                          <span className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider bg-slate-100 px-1.5 py-0.5 rounded">
                            {job.seniorityLevel}
                          </span>
                        </div>

                        <h3 className="font-bold text-[#0F172A] text-sm md:text-base leading-tight">
                          {job.title}
                        </h3>

                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[#64748B] text-xs">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#94A3B8]" />
                            <span>
                              {job.locationType}
                              {job.city ? ` (${job.city})` : ""}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-[#94A3B8]" />
                            <span>{job.pipelineCount} in Pipeline</span>
                          </div>
                        </div>
                      </div>

                      {/* Action toggle button */}
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => handleToggleStatus(job.id, job.status)}
                        className={cn(
                          "px-4 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer border shadow-sm active:scale-95 disabled:opacity-50 select-none w-full md:w-auto h-10 shrink-0",
                          isJobActive
                            ? "bg-rose-50 border-rose-100 text-rose-600 hover:bg-rose-100/70"
                            : "bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100/70"
                        )}
                      >
                        {isUpdating ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Power className="w-3.5 h-3.5" />
                        )}
                        <span>{isJobActive ? "Disable Job" : "Enable Job"}</span>
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-[#F1F5F9] bg-[#F8FAFC] flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-sm font-bold bg-[#64748B] hover:bg-[#475569] text-white transition-all cursor-pointer active:scale-[0.98] shadow-md"
            >
              Close Panel
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
