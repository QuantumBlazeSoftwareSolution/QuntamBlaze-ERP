"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Briefcase, Plus, MapPin, DollarSign, Users, Info, AlertCircle, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Department, SeniorityLevel, WorkLocationType, Employee } from "@/types/hr";
import { createJobAction } from "@/app/actions/hrActions";

interface NewJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  employees: Employee[];
}

const DEPARTMENTS: Department[] = [
  "Engineering",
  "Finance",
  "Design",
  "Marketing",
  "Operations",
  "HR",
  "Sales",
];
const SENIORITY: SeniorityLevel[] = ["Junior", "Mid", "Senior", "Lead", "Director"];
const EMPLOYMENT_TYPES = ["Full-Time", "Part-Time", "Contract", "Internship"];
const LOCATIONS: WorkLocationType[] = ["Remote", "Hybrid", "On-Site"];

export function NewJobModal({ isOpen, onClose, onSuccess, employees }: NewJobModalProps) {
  const [title, setTitle] = useState("");
  const [dept, setDept] = useState<Department>("Engineering");
  const [employmentType, setEmploymentType] = useState("Full-Time");
  const [seniorityLevel, setSeniorityLevel] = useState<SeniorityLevel>("Mid");
  const [workLocationType, setWorkLocationType] = useState<WorkLocationType>("Remote");
  const [city, setCity] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [openings, setOpenings] = useState("1");
  const [description, setDescription] = useState("");
  const [hiringManagerId, setHiringManagerId] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [jobId, setJobId] = useState("");

  // Simulate ID engine prefix for visual guidance
  useEffect(() => {
    const deptCode = dept.substring(0, 3).toUpperCase();
    const year = new Date().getFullYear().toString().substring(2);
    setJobId(`JOB-${deptCode}-${year}-XXX`);
  }, [dept]);

  // Set default hiring manager
  useEffect(() => {
    if (employees.length > 0 && !hiringManagerId) {
      setHiringManagerId(employees[0].id);
    }
  }, [employees, hiringManagerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    if (!title.trim() || !dept || !employmentType || !seniorityLevel || !workLocationType) {
      setError("Please fill out all required fields.");
      setLoading(false);
      return;
    }

    try {
      const res = await createJobAction({
        title: title.trim(),
        department: dept,
        employmentType,
        seniorityLevel,
        workLocationType,
        city: workLocationType !== "Remote" && city.trim() ? city.trim() : undefined,
        salaryMin: salaryMin ? parseFloat(salaryMin) : undefined,
        salaryMax: salaryMax ? parseFloat(salaryMax) : undefined,
        openings: openings ? parseInt(openings) : 1,
        description: description.trim() || undefined,
        hiringManagerId: hiringManagerId || undefined,
      });

      if (res.success) {
        setSuccessMsg(`Job opening ${res.jobId} created successfully!`);
        setTimeout(() => {
          onSuccess();
          onClose();
          // Reset form fields
          setTitle("");
          setDept("Engineering");
          setEmploymentType("Full-Time");
          setSeniorityLevel("Mid");
          setWorkLocationType("Remote");
          setCity("");
          setSalaryMin("");
          setSalaryMax("");
          setOpenings("1");
          setDescription("");
          setSuccessMsg("");
        }, 1500);
      } else {
        setError(res.error || "Failed to create job opening.");
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

        {/* Modal Panel */}
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
                  <span className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-wider">
                    Draft Mode
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

              {/* Title and Job parameters */}
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2 space-y-1.5">
                  <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest px-1">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Senior Software Engineer"
                    className="w-full h-11 px-4 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest px-1">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={dept}
                    onChange={(e) => setDept(e.target.value as Department)}
                    className="w-full h-11 px-4 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all bg-white cursor-pointer"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest px-1">
                    Seniority Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={seniorityLevel}
                    onChange={(e) => setSeniorityLevel(e.target.value as SeniorityLevel)}
                    className="w-full h-11 px-4 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all bg-white cursor-pointer"
                  >
                    {SENIORITY.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest px-1">
                    Employment Type <span className="text-red-500">*</span>
                  </label>
                  <div className="flex bg-[#F1F5F9] p-1 rounded-xl gap-1">
                    {EMPLOYMENT_TYPES.map((type) => (
                      <button
                        type="button"
                        key={type}
                        onClick={() => setEmploymentType(type)}
                        className={cn(
                          "flex-1 py-2 text-[10px] font-bold rounded-lg transition-all cursor-pointer",
                          employmentType === type
                            ? "bg-white text-[#10B981] shadow-sm"
                            : "text-[#64748B] hover:text-[#475569]"
                        )}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest px-1">
                    Location Type <span className="text-red-500">*</span>
                  </label>
                  <div className="flex bg-[#F1F5F9] p-1 rounded-xl gap-1">
                    {LOCATIONS.map((type) => (
                      <button
                        type="button"
                        key={type}
                        onClick={() => setWorkLocationType(type)}
                        className={cn(
                          "flex-1 py-2 text-[10px] font-bold rounded-lg transition-all cursor-pointer",
                          workLocationType === type
                            ? "bg-white text-[#10B981] shadow-sm"
                            : "text-[#64748B] hover:text-[#475569]"
                        )}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {workLocationType !== "Remote" && (
                  <div className="col-span-2 space-y-1.5 animate-fadeIn">
                    <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest px-1">
                      City / Location Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-[#94A3B8]" />
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Colombo, Sri Lanka"
                        className="w-full h-11 pl-9 pr-4 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all"
                      />
                    </div>
                  </div>
                )}

                <div className="col-span-2 space-y-1.5">
                  <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest px-1">
                    Hiring Manager
                  </label>
                  <select
                    value={hiringManagerId}
                    onChange={(e) => setHiringManagerId(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all bg-white cursor-pointer"
                  >
                    <option value="">Select hiring manager...</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} ({emp.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Salary & Openings Grid */}
              <div className="space-y-4 pt-4 border-t border-[#F1F5F9]">
                <div className="flex items-center gap-2 text-[#64748B]">
                  <Info className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    Salary & Openings
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-5">
                  <div className="space-y-1.5 relative">
                    <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest px-1">
                      Min Salary ($ / yr)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3.5 w-4 h-4 text-[#94A3B8]" />
                      <input
                        type="number"
                        placeholder="e.g. 50000"
                        value={salaryMin}
                        onChange={(e) => setSalaryMin(e.target.value)}
                        className="w-full h-11 pl-9 pr-4 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5 relative">
                    <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest px-1">
                      Max Salary ($ / yr)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3.5 w-4 h-4 text-[#94A3B8]" />
                      <input
                        type="number"
                        placeholder="e.g. 90000"
                        value={salaryMax}
                        onChange={(e) => setSalaryMax(e.target.value)}
                        className="w-full h-11 pl-9 pr-4 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5 relative">
                    <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest px-1">
                      Openings
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-3.5 w-4 h-4 text-[#94A3B8]" />
                      <input
                        type="number"
                        placeholder="1"
                        value={openings}
                        onChange={(e) => setOpenings(e.target.value)}
                        className="w-full h-11 pl-9 pr-4 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest px-1">
                  Job Description
                </label>
                <textarea
                  placeholder="Describe details regarding this job role, key responsibilities, daily work, necessary backgrounds and other conditions..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
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
                className="px-8 py-2.5 rounded-xl text-sm font-bold bg-[#10B981] text-white shadow-lg shadow-[#10B981]/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? "Posting Job..." : "Post Opening"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
