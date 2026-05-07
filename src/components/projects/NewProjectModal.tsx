"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, Plus, Users, Calendar, DollarSign, FileText } from "lucide-react";
import { projectSchema, ProjectFormData } from "@/lib/schemas/projectSchema";
import { useModalStore } from "@/store/modalStore";
import { ProjectIDPreview } from "./ProjectIDPreview";
import { generateProjectId } from "@/lib/idEngine";
import { MOCK_CLIENTS } from "@/lib/mockData/clients";
import { MOCK_TEAM } from "@/lib/mockData/team";
import { MOCK_PROJECTS } from "@/lib/mockData/projects";
import { cn } from "@/lib/utils";

export function NewProjectModal() {
  const { activeModal, closeModal } = useModalStore();
  const isOpen = activeModal === "newProject";

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      projectType: "Fixed Price",
      teamMembers: [],
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedClient = watch("clientName");
  const [generatedId, setGeneratedId] = useState<string | null>(null);

  useEffect(() => {
    if (selectedClient) {
      const existingCount = MOCK_PROJECTS.filter(p => p.clientName === selectedClient).length;
      const newId = generateProjectId(selectedClient, existingCount);
      setGeneratedId(newId);
    } else {
      setGeneratedId(null);
    }
  }, [selectedClient]);

  const onSubmit = async (data: ProjectFormData) => {
    console.log("[ID ENGINE] Creating Project:", { ...data, id: generatedId });
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    closeModal();
    reset();
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
          onClick={closeModal}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          className="relative w-full max-w-[680px] max-h-[90vh] bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="px-8 py-6 border-b border-[#1A1A1A] flex items-center justify-between bg-[#0D0D0D]">
            <div>
              <h2 className="text-xl font-semibold text-text-primary tracking-tight">Initiate Project</h2>
              <p className="text-sm text-text-secondary mt-1">Configure parameters for new operational deployment.</p>
            </div>
            <button
              onClick={closeModal}
              className="p-2 hover:bg-white/5 rounded-full transition-colors text-text-secondary hover:text-text-primary"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
            {/* Project ID Preview */}
            <ProjectIDPreview projectId={generatedId} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/* Project Name */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-[11px] font-bold tracking-[0.1em] text-text-secondary uppercase">Project Name</label>
                <div className="relative">
                  <input
                    {...register("name")}
                    placeholder="Enter operation designation..."
                    className={cn(
                      "w-full bg-[#0F0F0F] border border-[#1A1A1A] rounded-lg px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/30 focus:outline-none focus:border-accent transition-all",
                      errors.name && "border-danger/50 focus:border-danger"
                    )}
                  />
                  {errors.name && <p className="text-[10px] text-danger mt-1">{errors.name.message}</p>}
                </div>
              </div>

              {/* Client Selection */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold tracking-[0.1em] text-text-secondary uppercase">Client Entity</label>
                <div className="relative">
                  <select
                    {...register("clientName")}
                    className={cn(
                      "w-full bg-[#0F0F0F] border border-[#1A1A1A] rounded-lg px-4 py-3 text-sm text-text-primary appearance-none focus:outline-none focus:border-accent transition-all",
                      errors.clientName && "border-danger/50 focus:border-danger"
                    )}
                  >
                    <option value="">Select client...</option>
                    {MOCK_CLIENTS.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
                  {errors.clientName && <p className="text-[10px] text-danger mt-1">{errors.clientName.message}</p>}
                </div>
              </div>

              {/* Project Type */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold tracking-[0.1em] text-text-secondary uppercase">Deployment Type</label>
                <Controller
                  name="projectType"
                  control={control}
                  render={({ field }) => (
                    <div className="flex bg-[#0F0F0F] border border-[#1A1A1A] rounded-lg p-1 h-[46px]">
                      {["Fixed Price", "Retainer", "T&M"].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => field.onChange(type)}
                          className={cn(
                            "flex-1 text-[10px] font-bold tracking-[0.05em] uppercase rounded-md transition-all",
                            field.value === type
                              ? "bg-accent text-[#050505] shadow-lg shadow-accent/20"
                              : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                          )}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  )}
                />
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold tracking-[0.1em] text-text-secondary uppercase">Start Cycle</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
                  <input
                    type="date"
                    {...register("startDate")}
                    className={cn(
                      "w-full bg-[#0F0F0F] border border-[#1A1A1A] rounded-lg pl-11 pr-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent transition-all",
                      errors.startDate && "border-danger/50 focus:border-danger"
                    )}
                  />
                  {errors.startDate && <p className="text-[10px] text-danger mt-1">{errors.startDate.message}</p>}
                </div>
              </div>

              {/* Deadline */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold tracking-[0.1em] text-text-secondary uppercase">Termination Cycle</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
                  <input
                    type="date"
                    {...register("deadline")}
                    className={cn(
                      "w-full bg-[#0F0F0F] border border-[#1A1A1A] rounded-lg pl-11 pr-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent transition-all",
                      errors.deadline && "border-danger/50 focus:border-danger"
                    )}
                  />
                  {errors.deadline && <p className="text-[10px] text-danger mt-1">{errors.deadline.message}</p>}
                </div>
              </div>

              {/* Budget */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold tracking-[0.1em] text-text-secondary uppercase">Resource Allocation</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
                  <input
                    type="number"
                    step="0.01"
                    {...register("budget", { valueAsNumber: true })}
                    placeholder="0.00"
                    className={cn(
                      "w-full bg-[#0F0F0F] border border-[#1A1A1A] rounded-lg pl-11 pr-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent transition-all",
                      errors.budget && "border-danger/50 focus:border-danger"
                    )}
                  />
                  {errors.budget && <p className="text-[10px] text-danger mt-1">{errors.budget.message}</p>}
                </div>
              </div>

              {/* Operatives (Team Selection) */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold tracking-[0.1em] text-text-secondary uppercase flex items-center justify-between">
                  Operatives
                  <Users className="w-3.5 h-3.5" />
                </label>
                <Controller
                  name="teamMembers"
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-wrap gap-2 p-2 bg-[#0F0F0F] border border-[#1A1A1A] rounded-lg min-h-[46px]">
                      {MOCK_TEAM.map((member) => (
                        <button
                          key={member.id}
                          type="button"
                          onClick={() => {
                            const current = field.value || [];
                            const next = current.includes(member.id)
                              ? current.filter(id => id !== member.id)
                              : [...current, member.id];
                            field.onChange(next);
                          }}
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all border-2",
                            field.value?.includes(member.id)
                              ? "border-accent scale-110 shadow-[0_0_10px_rgba(0,229,255,0.3)]"
                              : "border-transparent opacity-40 grayscale hover:opacity-100 hover:grayscale-0",
                            member.color
                          )}
                          title={member.name}
                        >
                          {member.initials}
                        </button>
                      ))}
                      <button 
                        type="button"
                        className="w-8 h-8 rounded-full border border-dashed border-[#3A3A3A] flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-text-secondary transition-all"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                />
                {errors.teamMembers && <p className="text-[10px] text-danger mt-1">{errors.teamMembers.message}</p>}
              </div>

              {/* Description */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-[11px] font-bold tracking-[0.1em] text-text-secondary uppercase flex items-center justify-between">
                  Operation Manifesto
                  <FileText className="w-3.5 h-3.5" />
                </label>
                <textarea
                  {...register("description")}
                  rows={4}
                  placeholder="Detail mission objectives, scope, and deliverables..."
                  className={cn(
                    "w-full bg-[#0F0F0F] border border-[#1A1A1A] rounded-lg px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/30 focus:outline-none focus:border-accent transition-all resize-none",
                    errors.description && "border-danger/50 focus:border-danger"
                  )}
                />
                {errors.description && <p className="text-[10px] text-danger mt-1">{errors.description.message}</p>}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 flex items-center justify-end gap-4 border-t border-[#1A1A1A]">
              <button
                type="button"
                onClick={closeModal}
                className="px-6 py-2.5 rounded-lg text-[11px] font-bold tracking-[0.1em] uppercase text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "px-8 py-2.5 rounded-lg text-[11px] font-bold tracking-[0.1em] uppercase bg-accent text-[#050505] shadow-lg shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2",
                  isSubmitting && "opacity-50 cursor-not-allowed"
                )}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-[#050505]/30 border-t-[#050505] rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Create & Open Workspace"
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
