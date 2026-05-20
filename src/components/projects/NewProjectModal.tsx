"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { X, Wand2, AlertCircle, Plus, Calendar, Search } from "lucide-react";
import { projectSchema, ProjectFormData } from "@/lib/schemas/projectSchema";
import { useModalStore } from "@/store/modalStore";
import { previewProjectIdAction, createProjectAction } from "@/app/actions/projects";
import { cn } from "@/lib/utils";
import { searchClientsAction } from "@/app/actions/clients";

const formatNumberWithCommas = (value: string) => {
  const cleanValue = value.replace(/\D/g, "");
  if (!cleanValue) return "";
  return Number(cleanValue).toLocaleString("en-US");
};

const TEAM_MEMBERS = [
  { id: "USR-JD-01", name: "John Doe", initials: "JD", color: "bg-emerald-500" },
  { id: "USR-AL-02", name: "Alice Lee", initials: "AL", color: "bg-blue-500" },
  { id: "USR-MK-03", name: "Mike King", initials: "MK", color: "bg-amber-500" },
];

export function NewProjectModal() {
  const { isNewProjectModalOpen, closeNewProjectModal } = useModalStore();
  const [generatedId, setGeneratedId] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  // Client search state
  const [clientSearchQuery, setClientSearchQuery] = useState("");
  const [clientResults, setClientResults] = useState<{id: string, name: string}[]>([]);
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [selectedClientName, setSelectedClientName] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let active = true;
    const fetchClients = async () => {
      const res = await searchClientsAction(clientSearchQuery);
      if (active && res.success && res.clients) {
        setClientResults(res.clients);
      }
    };
    const timer = setTimeout(fetchClients, 300);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [clientSearchQuery]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema) as any,
    defaultValues: {
      type: "Fixed Price",
      teamMembers: [],
      budget: "" as any,
    },
  });

  const { onChange: onBudgetChange, ...budgetRest } = register("budget");

  const selectedClientId = watch("clientId");
  const selectedTeamMembers = watch("teamMembers");

  const [submitError, setSubmitError] = useState<string | null>(null);

  // Reactively generate PRJ-ID when client changes
  useEffect(() => {
    if (selectedClientId && selectedClientName) {
      const getPreviewId = async () => {
        const nextId = await previewProjectIdAction(selectedClientName);
        setGeneratedId(nextId);
      };
      getPreviewId();
    } else {
      setGeneratedId("");
    }
  }, [selectedClientId, selectedClientName]);

  const onSubmit = async (data: ProjectFormData) => {
    setSubmitError(null);
    try {
      const res = await createProjectAction(data);
      if (res.success) {
        reset();
        setSelectedClientName("");
        setClientSearchQuery("");
        closeNewProjectModal();
      } else {
        setSubmitError(res.error || "Failed to initiate project.");
      }
    } catch (err: any) {
      console.error(err);
      setSubmitError("An unexpected error occurred.");
    }
  };

  const toggleTeamMember = (memberId: string) => {
    const current = [...selectedTeamMembers];
    const index = current.indexOf(memberId);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(memberId);
    }
    setValue("teamMembers", current);
  };

  if (!isNewProjectModalOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeNewProjectModal}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white border border-[#E2E8F0] rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-full"
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-[#F1F5F9] flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-[#0F172A] tracking-tight uppercase">
              Initiate New Project
            </h2>
            <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest mt-1">
              Project Execution Framework v4.0
            </p>
          </div>
          <button
            onClick={closeNewProjectModal}
            className="p-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#94A3B8] hover:text-[#0F172A] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <form id="new-project-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* PRJ-ID Preview */}
            <AnimatePresence>
              {generatedId && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-2xl p-4 flex items-center justify-between overflow-hidden"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#10B981] flex items-center justify-center text-white shadow-lg shadow-[#10B981]/20">
                      <Wand2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-[#065F46] uppercase tracking-widest">
                        System Generated ID
                      </p>
                      <p className="font-mono text-sm font-bold text-[#065F46]">{generatedId}</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-white/50 border border-[#A7F3D0] text-[9px] font-black text-[#065F46] uppercase tracking-widest">
                    Valid Structure
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-[#0F172A] uppercase tracking-widest ml-1">
                  Project Identifier Name
                </label>
                <input
                  {...register("name")}
                  placeholder="e.g. Nexus Core Migration"
                  className={cn(
                    "w-full h-12 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 text-sm font-bold text-[#0F172A] focus:outline-none focus:ring-4 focus:ring-[#10B981]/10 focus:border-[#10B981] transition-all",
                    errors.name && "border-red-300 ring-red-50"
                  )}
                />
                {errors.name && (
                  <p className="text-[10px] font-bold text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#0F172A] uppercase tracking-widest ml-1">
                  Client Attribution
                </label>
                <div className="relative">
                  <div 
                    className={cn(
                      "w-full h-12 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 text-sm font-bold text-[#0F172A] focus-within:ring-4 focus-within:ring-[#10B981]/10 focus-within:border-[#10B981] transition-all flex items-center cursor-pointer",
                      errors.clientId && "border-red-300 ring-red-50"
                    )}
                    onClick={() => setIsClientDropdownOpen(true)}
                  >
                    {selectedClientName && !isClientDropdownOpen ? (
                      <div className="flex-1 flex items-center justify-between" onClick={() => setIsClientDropdownOpen(true)}>
                        <span>{selectedClientName}</span>
                        <Search className="w-4 h-4 text-[#94A3B8]" />
                      </div>
                    ) : (
                      <div className="flex-1 flex items-center gap-2">
                        <Search className="w-4 h-4 text-[#94A3B8]" />
                        <input 
                          className="w-full bg-transparent outline-none placeholder-[#94A3B8]"
                          placeholder="Search clients..."
                          value={clientSearchQuery}
                          onChange={(e) => {
                            setClientSearchQuery(e.target.value);
                            setIsClientDropdownOpen(true);
                          }}
                          onFocus={() => setIsClientDropdownOpen(true)}
                          onBlur={() => setTimeout(() => setIsClientDropdownOpen(false), 200)}
                        />
                      </div>
                    )}
                  </div>
                  
                  <AnimatePresence>
                    {isClientDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute z-10 w-full mt-2 bg-white border border-[#E2E8F0] rounded-xl shadow-xl max-h-48 overflow-y-auto custom-scrollbar"
                      >
                        {clientResults.length > 0 ? (
                          clientResults.map((client) => (
                            <div
                              key={client.id}
                              className="px-4 py-3 hover:bg-[#F8FAFC] cursor-pointer border-b border-[#F1F5F9] last:border-0"
                              onClick={() => {
                                setValue("clientId", client.id, { shouldValidate: true });
                                setSelectedClientName(client.name);
                                setIsClientDropdownOpen(false);
                                setClientSearchQuery("");
                              }}
                            >
                              <p className="text-sm font-bold text-[#0F172A]">{client.name}</p>
                              <p className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">{client.id}</p>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-sm font-bold text-[#94A3B8]">
                            {clientSearchQuery ? "No clients found." : "Type to search..."}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {/* Hidden input to register with react-hook-form */}
                  <input type="hidden" {...register("clientId")} />
                </div>
                {errors.clientId && (
                  <p className="text-[10px] font-bold text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.clientId.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#0F172A] uppercase tracking-widest ml-1">
                  Engagement Model
                </label>
                <div className="flex bg-[#F1F5F9] p-1 rounded-xl border border-[#E2E8F0] h-12">
                  {["Fixed Price", "Retainer", "T&M"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setValue("type", type as any)}
                      className={cn(
                        "flex-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                        watch("type") === type
                          ? "bg-white text-[#10B981] shadow-sm"
                          : "text-[#94A3B8] hover:text-[#475569]"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#0F172A] uppercase tracking-widest ml-1">
                  Operational Start
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                  <input
                    type="date"
                    {...register("startDate")}
                    className="w-full h-12 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-12 pr-4 text-sm font-bold text-[#0F172A] focus:outline-none focus:border-[#10B981]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#0F172A] uppercase tracking-widest ml-1">
                  Target Deadline
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                  <input
                    type="date"
                    {...register("deadline")}
                    className="w-full h-12 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-12 pr-4 text-sm font-bold text-[#0F172A] focus:outline-none focus:border-[#10B981]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#0F172A] uppercase tracking-widest ml-1">
                  Budget Allocation
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-[#94A3B8] uppercase tracking-widest select-none pointer-events-none">
                    LKR
                  </span>
                  <input
                    type="text"
                    {...budgetRest}
                    onChange={(e) => {
                      const formatted = formatNumberWithCommas(e.target.value);
                      e.target.value = formatted;
                      onBudgetChange(e);
                    }}
                    placeholder="0"
                    className="w-full h-12 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-14 pr-4 text-sm font-bold text-[#0F172A] focus:outline-none focus:border-[#10B981] transition-all"
                  />
                </div>
                {errors.budget && (
                  <p className="text-[10px] font-bold text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.budget.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#0F172A] uppercase tracking-widest ml-1">
                  Project Squad
                </label>
                <div className="flex flex-wrap gap-2 p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl min-h-[48px]">
                  {TEAM_MEMBERS.map((member) => (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => toggleTeamMember(member.id)}
                      className={cn(
                        "flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border transition-all",
                        selectedTeamMembers.includes(member.id)
                          ? "bg-[#10B981] border-[#10B981] text-white"
                          : "bg-white border-[#E2E8F0] text-[#475569] hover:border-[#CBD5E1]"
                      )}
                    >
                      <div
                        className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white",
                          member.color
                        )}
                      >
                        {member.initials}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {member.name}
                      </span>
                    </button>
                  ))}
                </div>
                {errors.teamMembers && (
                  <p className="text-[10px] font-bold text-red-500 mt-1">
                    {errors.teamMembers.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-[#0F172A] uppercase tracking-widest ml-1">
                  Strategic Scope & Description
                </label>
                <textarea
                  {...register("description")}
                  rows={4}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 text-sm font-bold text-[#0F172A] focus:outline-none focus:border-[#10B981] resize-none"
                  placeholder="Describe the project's technical scope and core deliverables..."
                />
                {errors.description && (
                  <p className="text-[10px] font-bold text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.description.message}
                  </p>
                )}
            </div>
          </div>

          {submitError && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3 animate-pulse">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-xs font-bold text-red-800">{submitError}</p>
            </div>
          )}
        </form>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-[#F1F5F9] bg-[#F8FAFC] flex justify-end gap-3">
          <button
            type="button"
            onClick={closeNewProjectModal}
            className="px-6 py-3 rounded-xl border border-[#E2E8F0] text-xs font-black text-[#475569] uppercase tracking-widest hover:bg-[#F1F5F9] transition-all"
          >
            Discard
          </button>
          <button
            type="submit"
            form="new-project-form"
            disabled={isSubmitting}
            className="px-8 py-3 rounded-xl bg-[#10B981] text-white text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-[#10B981]/20 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100 flex items-center gap-3"
          >
            {isSubmitting ? "Calibrating..." : "Initiate Project"}
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}
