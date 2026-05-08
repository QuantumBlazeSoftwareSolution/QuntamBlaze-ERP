"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, CreditCard, MapPin } from "lucide-react";
import { Lead } from "@/types/lead";
import { generateClientId } from "@/lib/idEngine";

interface ConvertToClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead;
  onConfirm: (data: any) => void;
}

export function ConvertToClientModal({ isOpen, onClose, lead, onConfirm }: ConvertToClientModalProps) {
  const generatedId = generateClientId(lead.companyName, 12); // Mock existing count as 12

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-bg-surface border border-border rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        >
          {/* Header */}
          <div className="p-6 border-b border-border flex items-center justify-between bg-bg-card">
            <div>
              <h2 className="text-xl font-bold text-text-primary mb-1">Convert to Client</h2>
              <p className="text-sm text-text-secondary">Establishing permanent partnership with {lead.companyName}</p>
            </div>
            <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-8 space-y-6">
            {/* Generated ID Preview */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-accent/5 border border-accent/20">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-accent uppercase tracking-[0.2em] mb-1">System Generated ID</p>
                <p className="text-2xl font-mono font-bold text-text-primary tracking-tighter">{generatedId}</p>
              </div>
            </div>

            {/* Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-text-secondary uppercase tracking-widest flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" /> Billing Address
                </label>
                <textarea 
                  placeholder="Enter primary billing address..."
                  className="w-full bg-bg-primary border border-border rounded-xl p-4 text-sm text-text-primary focus:outline-none focus:border-accent/50 transition-colors h-24 resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-text-secondary uppercase tracking-widest flex items-center gap-2">
                  <CreditCard className="w-3.5 h-3.5" /> Payment Terms
                </label>
                <select className="w-full bg-bg-primary border border-border rounded-xl p-4 text-sm text-text-primary focus:outline-none focus:border-accent/50 transition-colors appearance-none">
                  <option>Net-30 (Standard)</option>
                  <option>Net-15</option>
                  <option>Immediate</option>
                  <option>Custom Agreement</option>
                </select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 border-t border-border bg-bg-card flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 px-6 py-4 rounded-xl font-bold text-[13px] text-text-primary hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={() => onConfirm({ id: generatedId })}
              className="flex-1 px-6 py-4 rounded-xl bg-accent text-[#050505] font-bold text-[13px] shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)] transition-all"
            >
              Confirm Conversion
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
