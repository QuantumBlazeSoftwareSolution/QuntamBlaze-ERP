"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Receipt, Search, Calendar, CreditCard, Hash } from "lucide-react";
import { useForm } from "react-hook-form";
import { generateReceiptId } from "@/lib/idEngine";

interface LogReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLog: (data: any) => void;
}

export function LogReceiptModal({ isOpen, onClose, onLog }: LogReceiptModalProps) {
  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      invoiceId: "",
      amount: 0,
      paymentDate: new Date().toISOString().split('T')[0],
      method: "Bank Transfer",
      referenceNumber: "",
    }
  });

  const nextRctId = generateReceiptId(90); // Mock seq 90

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
          className="relative w-full max-w-lg bg-bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-border flex items-center justify-between bg-bg-surface/50">
             <div className="space-y-1">
                <h3 className="text-xl font-bold text-text-primary">Log New Receipt</h3>
                <p className="text-[11px] font-mono text-accent uppercase tracking-widest">Assigning ID: {nextRctId}</p>
             </div>
             <button onClick={onClose} className="p-2 text-text-muted hover:text-text-primary transition-colors">
               <X className="w-5 h-5" />
             </button>
          </div>

          <form onSubmit={handleSubmit(onLog)} className="p-8 space-y-6">
            <div className="space-y-4">
               <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest">Select Invoice</label>
               <div className="relative group">
                  <select 
                    {...register("invoiceId")}
                    className="w-full bg-bg-primary border border-border rounded-xl px-12 py-4 text-[14px] text-text-primary appearance-none focus:outline-none focus:border-accent/50 transition-all"
                  >
                    <option value="">Select INV-ID...</option>
                    <option value="INV-9921">INV-9921 (Astra Corp) - $45,000</option>
                    <option value="INV-9918">INV-9918 (Nexus Gen) - $12,450</option>
                  </select>
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Amount Received</label>
                <div className="relative">
                  <input 
                    type="number"
                    {...register("amount")}
                    className="w-full bg-bg-primary border border-border rounded-xl pl-10 pr-4 py-3 text-[14px] text-text-primary focus:outline-none focus:border-accent/50"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">$</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Payment Date</label>
                <div className="relative">
                   <input 
                    type="date"
                    {...register("paymentDate")}
                    className="w-full bg-bg-primary border border-border rounded-xl pl-10 pr-4 py-3 text-[14px] text-text-primary focus:outline-none focus:border-accent/50"
                  />
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Payment Method</label>
                <div className="relative">
                  <select 
                    {...register("method")}
                    className="w-full bg-bg-primary border border-border rounded-xl pl-10 pr-4 py-3 text-[14px] text-text-primary appearance-none focus:outline-none"
                  >
                    <option>Bank Transfer</option>
                    <option>Card</option>
                    <option>Cheque</option>
                    <option>PayPal</option>
                  </select>
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Ref / Transaction #</label>
                <div className="relative">
                   <input 
                    {...register("referenceNumber")}
                    placeholder="e.g. TXN-12345"
                    className="w-full bg-bg-primary border border-border rounded-xl pl-10 pr-4 py-3 text-[14px] text-text-primary focus:outline-none focus:border-accent/50"
                  />
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-accent text-[#050505] font-bold rounded-xl shadow-[0_0_20px_rgba(0,229,255,0.2)] hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all flex items-center justify-center gap-2"
            >
              <Receipt className="w-4 h-4" />
              Log Receipt
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
