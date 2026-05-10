"use client";

import { useState } from "react";
import { Plus, X, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function AddClientButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-5 py-2.5 bg-accent text-[#050505] font-bold text-[13px] rounded hover:bg-accent/90 transition-all shadow-[0_0_15px_rgba(0,229,255,0.2)]"
      >
        <Plus className="w-4 h-4" />
        Add New Client
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-bg-surface border border-border rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
              <div className="p-6 border-b border-border flex items-center justify-between bg-bg-card">
                <div>
                  <h2 className="text-xl font-bold text-text-primary mb-1">Onboard New Client</h2>
                  <p className="text-sm text-text-secondary">
                    Initialize client parameters for the directory.
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-text-muted hover:text-text-primary transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 space-y-6">
                {/* ID Preview */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-accent/5 border border-accent/20">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-accent uppercase tracking-[0.2em] mb-1">
                      Preview CLI-ID
                    </p>
                    <p className="text-lg font-mono font-bold text-text-primary tracking-tighter">
                      CLI-NEW-26-0XX
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-text-secondary uppercase tracking-widest">
                      Company Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. SpaceX"
                      className="w-full bg-bg-primary border border-border rounded-lg p-3 text-sm text-text-primary focus:border-accent/50 transition-colors outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-text-secondary uppercase tracking-widest">
                      Industry
                    </label>
                    <select className="w-full bg-bg-primary border border-border rounded-lg p-3 text-sm text-text-primary focus:border-accent/50 transition-colors outline-none appearance-none">
                      <option>Technology</option>
                      <option>Aerospace</option>
                      <option>Finance</option>
                      <option>Healthcare</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-border bg-bg-card flex gap-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-3 rounded-lg font-bold text-[13px] text-text-primary hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button className="flex-1 px-4 py-3 rounded-lg bg-accent text-[#050505] font-bold text-[13px] shadow-[0_0_20px_rgba(0,229,255,0.2)] hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all">
                  Onboard Client
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
