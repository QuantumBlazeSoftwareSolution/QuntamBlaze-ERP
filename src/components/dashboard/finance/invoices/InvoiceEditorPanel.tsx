"use client";

import { UseFormReturn } from "react-hook-form";
import { ChevronDown } from "lucide-react";
import { InvoiceFormData } from "@/types/invoice";
import { MOCK_PROJECTS } from "@/lib/mockData/projects";
import { LineItemsTable } from "../shared/LineItemsTable";

interface InvoiceEditorPanelProps {
  form: UseFormReturn<InvoiceFormData>;
}

export function InvoiceEditorPanel({ form }: InvoiceEditorPanelProps) {
  const { register, control, watch, setValue } = form;

  const handleProjectChange = (projectId: string) => {
    const project = MOCK_PROJECTS.find((p) => p.id === projectId);
    if (project) {
      setValue("projectId", project.id);
      setValue("clientName", project.clientName);
      setValue("clientId", project.clientId);
      setValue("billingAddress", "1010 Silicon Valley, CA, USA"); // Mock address
    }
  };

  return (
    <div className="flex-1 bg-bg-primary p-8 overflow-y-auto custom-scrollbar border-r border-border">
      <div className="max-w-3xl mx-auto space-y-10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-text-primary tracking-tight">Invoice Editor</h2>
          <div className="px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/30 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-[11px] font-mono font-bold text-accent">
              {watch("invoiceId")}
            </span>
          </div>
        </div>

        {/* Project Selection */}
        <div className="space-y-4">
          <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest">
            Project Selection
          </label>
          <div className="relative group">
            <select
              {...register("projectId")}
              onChange={(e) => handleProjectChange(e.target.value)}
              className="w-full bg-bg-card border border-border rounded-xl px-5 py-4 text-[14px] text-text-primary appearance-none focus:outline-none focus:border-accent/50 transition-all cursor-pointer"
            >
              <option value="">Select a project...</option>
              {MOCK_PROJECTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.id})
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-hover:text-accent transition-colors pointer-events-none" />
          </div>
        </div>

        {/* Client Info Grid */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
              Client Name
            </label>
            <input
              {...register("clientName")}
              readOnly
              className="w-full bg-white/5 border border-border rounded-lg px-4 py-3 text-[14px] text-text-secondary outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
              CLI-ID
            </label>
            <input
              {...register("clientId")}
              readOnly
              className="w-full bg-white/5 border border-border rounded-lg px-4 py-3 text-[14px] text-text-secondary outline-none font-mono"
            />
          </div>
        </div>

        {/* Line Items */}
        <div className="space-y-6">
          <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest">
            Line Items
          </label>
          <LineItemsTable control={control} register={register} watch={watch} />
        </div>
      </div>
    </div>
  );
}
