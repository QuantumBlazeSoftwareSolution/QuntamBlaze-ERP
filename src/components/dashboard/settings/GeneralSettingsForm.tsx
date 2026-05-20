"use client";

import { useForm } from "react-hook-form";
import { Globe, Upload, Save } from "lucide-react";
import { motion } from "framer-motion";

export function GeneralSettingsForm() {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      companyName: "Quantum Blaze Logistics Corp.",
    },
  });

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Company Identity */}
      <div className="bg-white border border-border rounded-2xl p-8 space-y-6 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <Globe className="w-5 h-5 text-accent" />
          <h3 className="text-xl font-bold text-text-primary">Company Identity</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest">
              Company Name
            </label>
            <input
              {...register("companyName")}
              className="w-full bg-white border border-border rounded-xl px-4 py-4 text-[14px] text-text-primary focus:border-accent transition-all focus:ring-1 focus:ring-accent outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest">
              Corporate Logomark
            </label>
            <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center gap-2 hover:border-accent/50 cursor-pointer transition-all bg-page-bg hover:bg-page-bg/80">
              <Upload className="w-6 h-6 text-text-muted" />
              <p className="text-[12px] text-text-muted text-center">
                Drag & Drop or <span className="text-accent underline">Browse</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button className="px-8 py-4 text-[14px] font-bold text-text-muted hover:text-text-primary transition-colors">
          Discard Changes
        </button>
        <button className="flex items-center gap-2 px-10 py-4 bg-accent/10 border border-accent/30 text-accent font-bold rounded-xl hover:bg-accent/20 transition-all">
          <Save className="w-4 h-4" />
          Save Configuration
        </button>
      </div>
    </div>
  );
}
