"use client";

import { useFieldArray, UseFormReturn } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, ChevronDown, Calendar, Type } from "lucide-react";
import { QuotationFormData } from "@/types/quotation";
import { LineItemsTable } from "../shared/LineItemsTable";
import { cn } from "@/lib/utils";

interface QuotationEditorPanelProps {
  form: UseFormReturn<QuotationFormData>;
}

export function QuotationEditorPanel({ form }: QuotationEditorPanelProps) {
  const { register, control, watch, setValue } = form;
  const {
    fields: milestones,
    append: addMilestone,
    remove: removeMilestone,
  } = useFieldArray({
    control,
    name: "milestones",
  });

  const useMilestones = watch("useMilestones");

  return (
    <div className="flex-1 bg-bg-primary p-8 overflow-y-auto custom-scrollbar border-r border-border">
      <div className="max-w-3xl mx-auto space-y-10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-text-primary tracking-tight">QTO Builder</h2>
          <div className="px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/30 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-[11px] font-mono font-bold text-accent">
              {watch("quotationId")}
            </span>
          </div>
        </div>

        {/* Client / Lead Selection */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest">
              Client / Lead Reference
            </label>
            <div className="relative group">
              <select
                {...register("referenceId")}
                className="w-full bg-bg-card border border-border rounded-xl px-5 py-4 text-[14px] text-text-primary appearance-none focus:outline-none focus:border-accent/50 transition-all cursor-pointer"
              >
                <option value="">Select entity...</option>
                <option value="CLI-8892">CLI-8892 - Nexus Corp</option>
                <option value="LED-26-034">LED-26-034 - Cyberdyne Systems</option>
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-hover:text-accent transition-colors pointer-events-none" />
            </div>
          </div>
          <div className="space-y-4">
            <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest">
              Validity Horizon
            </label>
            <div className="relative">
              <input
                type="date"
                {...register("validityDate")}
                className="w-full bg-bg-card border border-border rounded-xl px-12 py-4 text-[14px] text-text-primary focus:outline-none focus:border-accent/50 transition-all"
              />
              <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            </div>
          </div>
        </div>

        {/* Scope of Operations */}
        <div className="space-y-4">
          <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest">
            Scope of Operations
          </label>
          <div className="bg-bg-card border border-border rounded-xl overflow-hidden focus-within:border-accent/50 transition-all">
            <div className="px-4 py-2 border-b border-border bg-white/5 flex gap-4">
              <button className="p-1 text-text-muted hover:text-accent transition-colors font-bold">
                B
              </button>
              <button className="p-1 text-text-muted hover:text-accent transition-colors italic">
                I
              </button>
              <button className="p-1 text-text-muted hover:text-accent transition-colors">
                List
              </button>
            </div>
            <textarea
              {...register("scopeOfWork")}
              placeholder="Define exact operational parameters..."
              className="w-full bg-transparent p-5 text-[14px] text-text-secondary outline-none min-h-[120px] resize-none"
            />
          </div>
        </div>

        {/* Resource Allocation */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest">
              Resource Allocation (Line Items)
            </label>
          </div>
          <LineItemsTable
            control={control}
            register={register}
            watch={watch}
            showHoursColumn={true}
          />
        </div>

        {/* Milestone Structure */}
        <div className="space-y-6 pt-6 border-t border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <label className="text-[11px] font-bold text-text-primary uppercase tracking-widest">
                Milestone Structure
              </label>
              <span className="text-[11px] text-text-muted mt-1">
                Break project total into payment tranches
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" {...register("useMilestones")} className="sr-only peer" />
              <div className="w-11 h-6 bg-white/5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-text-muted after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent peer-checked:after:bg-[#050505]"></div>
            </label>
          </div>

          {useMilestones && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              {milestones.map((milestone, index) => (
                <div
                  key={milestone.id}
                  className="flex gap-4 items-center bg-accent/[0.03] border-l-2 border-accent/20 p-4 rounded-r-xl"
                >
                  <input
                    {...register(`milestones.${index}.description`)}
                    placeholder="Milestone description..."
                    className="flex-1 bg-transparent border-none text-[14px] text-text-primary focus:outline-none"
                  />
                  <div className="flex items-center gap-2 bg-bg-card border border-border rounded-lg px-3 py-1.5">
                    <input
                      type="number"
                      {...register(`milestones.${index}.percentage`, { valueAsNumber: true })}
                      className="w-12 bg-transparent border-none text-[14px] text-text-primary text-right focus:outline-none"
                    />
                    <span className="text-text-muted text-[13px]">%</span>
                  </div>
                  <button
                    onClick={() => removeMilestone(index)}
                    className="p-1.5 text-text-muted hover:text-danger"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() =>
                  addMilestone({
                    id: Math.random().toString(),
                    description: "",
                    percentage: 50,
                    amount: 0,
                  })
                }
                className="text-[11px] font-bold text-accent uppercase tracking-widest hover:underline"
              >
                + Add Milestone
              </button>
            </motion.div>
          )}
        </div>

        {/* Footer Discount Row */}
        <div className="flex justify-end pt-10 border-t border-border">
          <div className="bg-bg-card border border-border rounded-xl p-6 w-80 space-y-6">
            <div className="flex justify-between items-center text-[12px] text-text-muted uppercase tracking-widest">
              <span>Subtotal</span>
              <span className="font-mono text-text-primary">Cr 6,000.00</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-[12px] text-text-muted uppercase tracking-widest">
                  Discount
                </span>
                <input
                  type="number"
                  {...register("discount", { valueAsNumber: true })}
                  className="w-16 bg-white/5 border border-border rounded px-2 py-1 text-[13px] text-accent font-mono text-center"
                />
                <span className="text-text-muted text-[13px]">%</span>
              </div>
              <span className="text-danger font-mono text-[13px]">- Cr 600.00</span>
            </div>
            <div className="flex justify-between items-end pt-4 border-t border-border/50">
              <span className="text-[12px] font-black text-text-muted uppercase tracking-widest">
                TOTAL
              </span>
              <div className="text-right">
                <p className="text-[10px] text-accent font-mono">Cr (USD)</p>
                <p className="text-3xl font-black text-accent tracking-tighter">Cr 5,400.00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
