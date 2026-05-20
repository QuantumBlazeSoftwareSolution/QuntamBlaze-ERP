"use client";

import { useState, useEffect } from "react";
import { Plus, X, ShieldCheck, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { previewClientIdAction, createClientAction } from "@/app/actions/clients";
import { useRouter } from "next/navigation";

export function AddClientButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [industry, setIndustry] = useState("Technology");
  const [customIndustry, setCustomIndustry] = useState("");
  const [name, setName] = useState("");
  
  const [previewId, setPreviewId] = useState("CLI-NEW-XX-0XX");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();

  // Debounced effect to fetch preview ID
  useEffect(() => {
    if (!isOpen) return;
    
    const timeoutId = setTimeout(async () => {
      const id = await previewClientIdAction(name);
      setPreviewId(id);
    }, 500); // 500ms debounce
    
    return () => clearTimeout(timeoutId);
  }, [name, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Company name is required.");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    const formData = new FormData();
    formData.append("name", name);
    formData.append("industry", industry);
    if (customIndustry) {
      formData.append("customIndustry", customIndustry);
    }
    
    const result = await createClientAction(formData);
    
    if (result.success) {
      // Reset and close
      setIsOpen(false);
      setName("");
      setIndustry("Technology");
      setCustomIndustry("");
      router.refresh();
    } else {
      setError(result.error || "An error occurred");
    }
    
    setIsSubmitting(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white font-bold text-[13px] rounded hover:bg-accent-hover transition-all shadow-sm"
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
              className="absolute inset-0 bg-text-primary/20 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-surface-white border border-border rounded-2xl overflow-hidden shadow-xl"
            >
              <div className="p-6 border-b border-border flex items-center justify-between bg-surface-white">
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

              <form onSubmit={handleSubmit}>
                <div className="p-8 space-y-6">
                  {error && (
                    <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm">
                      {error}
                    </div>
                  )}
                  
                  {/* ID Preview */}
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-accent-light border border-accent-border">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-accent-text uppercase tracking-[0.2em] mb-1">
                        Preview CLI-ID
                      </p>
                      <p className="text-lg font-mono font-bold text-text-primary tracking-tighter transition-all">
                        {previewId}
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
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. SpaceX"
                        required
                        className="w-full bg-page-bg border border-border rounded-lg p-3 text-sm text-text-primary focus:border-accent focus:ring-1 focus:ring-accent transition-colors outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-text-secondary uppercase tracking-widest">
                        Industry
                      </label>
                      <select 
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className="w-full bg-page-bg border border-border rounded-lg p-3 text-sm text-text-primary focus:border-accent focus:ring-1 focus:ring-accent transition-colors outline-none appearance-none"
                      >
                        <option value="Technology">Technology</option>
                        <option value="Aerospace">Aerospace</option>
                        <option value="Finance">Finance</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    
                    <AnimatePresence>
                      {industry === "Other" && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2 overflow-hidden"
                        >
                          <label className="text-[11px] font-bold text-text-secondary uppercase tracking-widest">
                            Custom Industry
                          </label>
                          <input
                            type="text"
                            value={customIndustry}
                            onChange={(e) => setCustomIndustry(e.target.value)}
                            placeholder="Please specify"
                            required={industry === "Other"}
                            className="w-full bg-page-bg border border-border rounded-lg p-3 text-sm text-text-primary focus:border-accent focus:ring-1 focus:ring-accent transition-colors outline-none"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="p-6 border-t border-border bg-page-bg flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 rounded-lg font-bold text-[13px] text-text-primary hover:bg-border transition-colors border border-border disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 rounded-lg bg-accent text-white font-bold text-[13px] hover:bg-accent-hover transition-all flex items-center justify-center disabled:opacity-70 gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Onboarding...
                      </>
                    ) : (
                      "Onboard Client"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
