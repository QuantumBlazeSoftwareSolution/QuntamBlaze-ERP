"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ArrowLeft,
  UserCheck,
  UserPlus,
  Search,
  ChevronRight,
  Loader2,
  Briefcase,
  Building,
  Mail,
  Phone,
} from "lucide-react";
import { getHiredCandidatesAction } from "@/app/actions/hrActions";
import { cn } from "@/lib/utils";

interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  jobId?: string | null;
  jobTitle?: string | null;
  jobDepartment?: string | null;
}

interface EmployeeCreationSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScratch: () => void;
  onSelectCandidate: (candidateData: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    role?: string;
    department?: string;
  }) => void;
}

export function EmployeeCreationSelectorModal({
  isOpen,
  onClose,
  onSelectScratch,
  onSelectCandidate,
}: EmployeeCreationSelectorModalProps) {
  const [screen, setScreen] = useState<"selection" | "import">("selection");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isOpen) {
      setScreen("selection");
      setSearchQuery("");
      loadHiredCandidates();
    }
  }, [isOpen]);

  async function loadHiredCandidates() {
    setLoading(true);
    try {
      const res = await getHiredCandidatesAction();
      if (res.success && res.candidates) {
        setCandidates(res.candidates);
      }
    } catch (err) {
      console.error("Failed to load hired candidates:", err);
    } finally {
      setLoading(false);
    }
  }

  const filteredCandidates = candidates.filter((c) => {
    const query = searchQuery.toLowerCase();
    const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
    const email = c.email.toLowerCase();
    const job = (c.jobTitle || "").toLowerCase();
    return fullName.includes(query) || email.includes(query) || job.includes(query);
  });

  const mapDepartment = (dept: string | null | undefined): string => {
    if (!dept) return "";
    const d = dept.toUpperCase();
    const validDepts = ["ENGINEERING", "DESIGN", "PRODUCT", "MARKETING", "SALES", "HR", "FINANCE"];
    if (validDepts.includes(d)) {
      return d;
    }
    return "OTHER";
  };

  const handleCandidateClick = (candidate: Candidate) => {
    onSelectCandidate({
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      email: candidate.email,
      phone: candidate.phone || undefined,
      role: candidate.jobTitle || undefined,
      department: mapDepartment(candidate.jobDepartment),
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="fixed inset-0 m-auto h-fit w-full max-w-lg bg-white rounded-2xl shadow-2xl z-[101] flex flex-col border border-slate-100 overflow-hidden"
          >
            {/* Screen 1: Selection Dashboard */}
            {screen === "selection" && (
              <div className="flex flex-col">
                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Add New Employee</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Choose how you want to add the new team member
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Cards Body */}
                <div className="p-6 space-y-4">
                  {/* Card 1: Import Hired Candidate */}
                  <button
                    onClick={() => setScreen("import")}
                    className="w-full text-left p-5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/10 transition-all flex items-start gap-4 group cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <UserCheck className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                          Import Hired Candidate
                        </span>
                        {!loading && candidates.length > 0 && (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {candidates.length} ready
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Select a candidate who successfully passed the recruitment pipeline to
                        pre-populate employee profile fields automatically.
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all self-center" />
                  </button>

                  {/* Card 2: Create From Scratch */}
                  <button
                    onClick={onSelectScratch}
                    className="w-full text-left p-5 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/10 transition-all flex items-start gap-4 group cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <UserPlus className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0 pr-2">
                      <span className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                        Create From Scratch
                      </span>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Open the manual registration sidebar and enter all employee details from
                        scratch.
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all self-center" />
                  </button>
                </div>
              </div>
            )}

            {/* Screen 2: Candidate Import List */}
            {screen === "import" && (
              <div className="flex flex-col max-h-[600px]">
                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
                  <button
                    onClick={() => setScreen("selection")}
                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-slate-800">Import Candidate</h3>
                    <p className="text-xs text-slate-500">
                      Select a hired candidate to register
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Search input */}
                <div className="p-4 border-b border-slate-100 bg-white">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search candidates by name, email or job..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 bg-slate-50/50 focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                {/* Candidate List Container */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px] max-h-[350px] custom-scrollbar bg-slate-50/30">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
                      <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                      <span className="text-sm font-semibold">Loading hired candidates...</span>
                    </div>
                  ) : filteredCandidates.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <UserCheck className="w-12 h-12 text-slate-300 mb-3" />
                      <h4 className="text-sm font-bold text-slate-700">No candidates available</h4>
                      <p className="text-xs text-slate-400 max-w-[280px] mt-1 leading-relaxed">
                        {searchQuery
                          ? "No candidates matched your search criteria."
                          : "There are currently no candidates in the 'Hired' stage of the pipeline."}
                      </p>
                      <button
                        onClick={onSelectScratch}
                        className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        Create From Scratch
                      </button>
                    </div>
                  ) : (
                    filteredCandidates.map((candidate) => {
                      const initials = `${candidate.firstName[0] || ""}${
                        candidate.lastName[0] || ""
                      }`.toUpperCase();
                      return (
                        <button
                          key={candidate.id}
                          onClick={() => handleCandidateClick(candidate)}
                          className="w-full text-left p-4 bg-white border border-slate-200 hover:border-emerald-500 rounded-xl transition-all flex items-start gap-3.5 group shadow-sm hover:shadow-md cursor-pointer"
                        >
                          {/* Avatar */}
                          <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-700 text-sm font-black flex items-center justify-center shrink-0">
                            {initials}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <span className="font-bold text-slate-800 text-sm block group-hover:text-emerald-700 transition-colors truncate">
                              {candidate.firstName} {candidate.lastName}
                            </span>
                            <div className="flex flex-col gap-1 mt-1">
                              <div className="flex items-center gap-1.5 text-xs text-slate-500 truncate">
                                <Mail className="w-3.5 h-3.5 shrink-0" />
                                <span className="truncate">{candidate.email}</span>
                              </div>
                              {candidate.phone && (
                                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                  <Phone className="w-3.5 h-3.5 shrink-0" />
                                  <span>{candidate.phone}</span>
                                </div>
                              )}
                            </div>

                            {/* Job info badges */}
                            {candidate.jobTitle && (
                              <div className="flex flex-wrap items-center gap-2 mt-3 pt-2 border-t border-slate-100">
                                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                                  <Briefcase className="w-3 h-3" />
                                  {candidate.jobTitle}
                                </span>
                                {candidate.jobDepartment && (
                                  <span className="flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                                    <Building className="w-3 h-3" />
                                    {candidate.jobDepartment}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all self-center" />
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
