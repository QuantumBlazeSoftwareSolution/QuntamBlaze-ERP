"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus, HelpCircle, MapPin, DollarSign, Users, Info, Sparkles, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { createCandidateAction } from "@/app/actions/hrActions";
import { Employee, Job } from "@/types/hr";

interface NewCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  jobs: Job[];
  employees: Employee[];
}

const SOURCES = ["LinkedIn", "Referral", "Website", "Agency", "Direct", "Job Board"];
const PIPELINE_STAGES = ["Applied", "Screening", "Technical", "Final", "Offer"];

export function NewCandidateModal({ isOpen, onClose, onSuccess, jobs, employees }: NewCandidateModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [jobId, setJobId] = useState("");
  const [source, setSource] = useState("LinkedIn");
  const [currentStage, setCurrentStage] = useState("Applied");
  const [referredById, setReferredById] = useState("");
  const [assignedToId, setAssignedToId] = useState("");
  const [expectedSalary, setExpectedSalary] = useState("");
  const [noticePeriodDays, setNoticePeriodDays] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Auto-set the first job and employee if available
  useEffect(() => {
    if (jobs.length > 0 && !jobId) {
      setJobId(jobs[0].id);
    }
    if (employees.length > 0 && !assignedToId) {
      setAssignedToId(employees[0].id);
    }
  }, [jobs, employees, jobId, assignedToId]);

  // Reset referredBy if source changes from Referral
  useEffect(() => {
    if (source !== "Referral") {
      setReferredById("");
    }
  }, [source]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !jobId || !source) {
      setError("Please fill out all required fields.");
      setLoading(false);
      return;
    }

    try {
      const res = await createCandidateAction({
        jobId,
        firstName,
        lastName,
        email,
        phone: phone.trim() || undefined,
        source,
        currentStage,
        referredById: source === "Referral" && referredById ? referredById : undefined,
        assignedToId: assignedToId || undefined,
        expectedSalary: expectedSalary ? parseFloat(expectedSalary) : undefined,
        noticePeriodDays: noticePeriodDays ? parseInt(noticePeriodDays) : undefined,
        notes: notes.trim() || undefined,
      });

      if (res.success) {
        setSuccessMsg("Candidate added successfully!");
        setTimeout(() => {
          onSuccess();
          onClose();
          // Reset form fields
          setFirstName("");
          setLastName("");
          setEmail("");
          setPhone("");
          setSource("LinkedIn");
          setCurrentStage("Applied");
          setReferredById("");
          setExpectedSalary("");
          setNoticePeriodDays("");
          setNotes("");
          setSuccessMsg("");
        }, 1500);
      } else {
        setError(res.error || "Failed to add new candidate.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

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

        {/* Modal Container */}
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
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-[#0F172A] text-lg font-bold">Add New Candidate</h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-bold text-[#10B981] bg-[#ECFDF5] px-1.5 py-0.5 rounded border border-[#A7F3D0] uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" /> Pipeline Entry
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#E2E8F0] rounded-full transition-colors text-[#64748B] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto flex flex-col">
            {/* Body */}
            <div className="p-8 space-y-6 flex-1 scrollbar-hide">
              {/* Alert Banners */}
              {error && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm font-bold animate-pulse">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              {successMsg && (
                <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 text-emerald-600 p-4 rounded-xl text-sm font-bold">
                  <Check className="w-4 h-4 flex-shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Personal Info Grid */}
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest px-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Marcus"
                    className="w-full h-11 px-4 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest px-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Thorne"
                    className="w-full h-11 px-4 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest px-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. marcus.t@gmail.com"
                    className="w-full h-11 px-4 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest px-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +94 77 123 4567"
                    className="w-full h-11 px-4 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all"
                  />
                </div>
              </div>

              {/* Assignment Grid */}
              <div className="grid grid-cols-2 gap-5 pt-4 border-t border-[#F1F5F9]">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest px-1">
                    Job Opportunity <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={jobId}
                    onChange={(e) => setJobId(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all bg-white cursor-pointer"
                  >
                    {jobs.length === 0 ? (
                      <option value="">No Active Job Openings Available</option>
                    ) : (
                      jobs.map((j) => (
                        <option key={j.id} value={j.id}>
                          {j.title} ({j.department})
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest px-1">
                    Candidate Source <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all bg-white cursor-pointer"
                  >
                    {SOURCES.map((src) => (
                      <option key={src} value={src}>
                        {src}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest px-1">
                    Pipeline Stage
                  </label>
                  <select
                    value={currentStage}
                    onChange={(e) => setCurrentStage(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all bg-white cursor-pointer"
                  >
                    {PIPELINE_STAGES.map((stg) => (
                      <option key={stg} value={stg}>
                        {stg}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest px-1">
                    Assigned Recruiter
                  </label>
                  <select
                    value={assignedToId}
                    onChange={(e) => setAssignedToId(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all bg-white cursor-pointer"
                  >
                    <option value="">Unassigned</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} ({emp.role})
                      </option>
                    ))}
                  </select>
                </div>

                {source === "Referral" && (
                  <div className="col-span-2 space-y-1.5 animate-fadeIn">
                    <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest px-1">
                      Referred By (Active Employee)
                    </label>
                    <select
                      value={referredById}
                      onChange={(e) => setReferredById(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all bg-white cursor-pointer"
                    >
                      <option value="">Select Employee</option>
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name} — {emp.department}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Salary and Schedule Section */}
              <div className="space-y-4 pt-4 border-t border-[#F1F5F9]">
                <div className="flex items-center gap-2 text-[#64748B]">
                  <Info className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    Compensation & Timeline
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1.5 relative">
                    <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest px-1">
                      Expected Annual Salary
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3.5 w-4 h-4 text-[#94A3B8]" />
                      <input
                        type="number"
                        placeholder="e.g. 85000"
                        value={expectedSalary}
                        onChange={(e) => setExpectedSalary(e.target.value)}
                        className="w-full h-11 pl-9 pr-4 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5 relative">
                    <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest px-1">
                      Notice Period (Days)
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-3.5 w-4 h-4 text-[#94A3B8]" />
                      <input
                        type="number"
                        placeholder="e.g. 30"
                        value={noticePeriodDays}
                        onChange={(e) => setNoticePeriodDays(e.target.value)}
                        className="w-full h-11 pl-9 pr-4 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest px-1">
                  Private Candidate Notes
                </label>
                <textarea
                  placeholder="Describe your initial thoughts, candidate skills, experience level or interview recommendations..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full p-4 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all resize-none font-sans text-[#475569]"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-[#F1F5F9] bg-[#F8FAFC] flex justify-end gap-3 mt-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-[#64748B] hover:bg-[#E2E8F0] transition-all cursor-pointer"
              >
                Discard
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-2.5 rounded-xl text-sm font-bold bg-[#10B981] text-white shadow-lg shadow-[#10B981]/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Adding Candidate..." : "Add Candidate"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
