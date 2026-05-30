"use client";

import { useState } from "react";
import { X, Building2, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { updateClientAction } from "@/app/actions/clients";

interface EditClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client: any;
}

const INDUSTRIES = ["Technology", "Healthcare", "Finance", "Manufacturing", "Retail", "Other"];

export function EditClientModal({ isOpen, onClose, client }: EditClientModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCustomIndustry, setShowCustomIndustry] = useState(
    !INDUSTRIES.includes(client?.industry) && client?.industry !== "Unknown"
  );

  if (!isOpen || !client) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await updateClientAction(client.id, formData);

    if (result.success) {
      onClose();
    } else {
      setError(result.error || "Failed to update client.");
    }

    setIsLoading(false);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-text-primary/20 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-full max-w-[600px] bg-surface-white rounded-2xl shadow-xl border border-divider flex flex-col max-h-[90vh]"
          >
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-divider bg-surface-white rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-text-primary">Edit Client Profile</h2>
                  <p className="text-sm text-text-secondary mt-0.5">
                    Update details for {client.name}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 -mr-2 text-text-muted hover:text-text-primary hover:bg-page-bg rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-surface-white">
                {error && (
                  <div className="p-4 bg-error/10 border border-error/20 text-error rounded-xl text-sm font-medium">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                      Company Name *
                    </label>
                    <input
                      name="name"
                      required
                      defaultValue={client.name}
                      className="w-full px-4 py-3 rounded-xl bg-page-bg border border-border text-text-primary text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                      placeholder="e.g. Quantum Innovations"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                      Industry
                    </label>
                    <select
                      name="industry"
                      defaultValue={
                        INDUSTRIES.includes(client.industry) ? client.industry : "Other"
                      }
                      onChange={(e) => setShowCustomIndustry(e.target.value === "Other")}
                      className="w-full px-4 py-3 rounded-xl bg-page-bg border border-border text-text-primary text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all appearance-none"
                    >
                      {INDUSTRIES.map((ind) => (
                        <option key={ind} value={ind}>
                          {ind}
                        </option>
                      ))}
                    </select>
                  </div>

                  <AnimatePresence>
                    {showCustomIndustry && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="col-span-2 overflow-hidden"
                      >
                        <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                          Specify Industry
                        </label>
                        <input
                          name="customIndustry"
                          defaultValue={
                            !INDUSTRIES.includes(client.industry) ? client.industry : ""
                          }
                          required={showCustomIndustry}
                          className="w-full px-4 py-3 rounded-xl bg-page-bg border border-border text-text-primary text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                          placeholder="e.g. Aerospace"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                      Contact Person
                    </label>
                    <input
                      name="contactPerson"
                      defaultValue={client.contactPerson}
                      className="w-full px-4 py-3 rounded-xl bg-page-bg border border-border text-text-primary text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                      placeholder="e.g. Jane Doe"
                    />
                  </div>

                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                      Contact Email
                    </label>
                    <input
                      name="contactEmail"
                      type="email"
                      defaultValue={client.contactEmail}
                      className="w-full px-4 py-3 rounded-xl bg-page-bg border border-border text-text-primary text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                      placeholder="e.g. jane@quantum.com"
                    />
                  </div>

                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                      Contact Phone
                    </label>
                    <input
                      name="contactPhone"
                      defaultValue={client.contactPhone}
                      className="w-full px-4 py-3 rounded-xl bg-page-bg border border-border text-text-primary text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      defaultValue={client.status}
                      className="w-full px-4 py-3 rounded-xl bg-page-bg border border-border text-text-primary text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all appearance-none"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                      Billing Address
                    </label>
                    <textarea
                      name="billingAddress"
                      defaultValue={client.billingAddress}
                      rows={2}
                      className="w-full px-4 py-3 rounded-xl bg-page-bg border border-border text-text-primary text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all resize-none"
                      placeholder="Full billing address..."
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                      Payment Terms
                    </label>
                    <select
                      name="paymentTerms"
                      defaultValue={client.paymentTerms || "Net 30"}
                      className="w-full px-4 py-3 rounded-xl bg-page-bg border border-border text-text-primary text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all appearance-none"
                    >
                      <option value="Net 15">Net 15</option>
                      <option value="Net 30">Net 30</option>
                      <option value="Net 45">Net 45</option>
                      <option value="Net 60">Net 60</option>
                      <option value="Due on Receipt">Due on Receipt</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-divider bg-page-bg rounded-b-2xl flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-lg text-sm font-bold text-text-secondary hover:text-text-primary hover:bg-border transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2.5 rounded-lg text-sm font-bold bg-accent text-white hover:bg-accent-hover transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
