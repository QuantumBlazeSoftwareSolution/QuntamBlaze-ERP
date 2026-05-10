"use client";

import { Calendar, Search, CreditCard, ChevronDown } from "lucide-react";

export function ReceiptFilters() {
  return (
    <div className="bg-bg-card border border-border rounded-2xl p-6 flex flex-wrap gap-6 items-end">
      <div className="flex-1 min-w-[200px] space-y-4">
        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-1">
          Filter Records
        </label>
        <div className="flex gap-4">
          <div className="flex-1 relative group">
            <input
              placeholder="Oct 01 - Oct 31"
              className="w-full bg-bg-primary border border-border rounded-xl pl-12 pr-4 py-3 text-[13px] text-text-primary focus:outline-none focus:border-accent/50 transition-all"
            />
            <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-accent transition-colors" />
          </div>
          <div className="flex-1 relative group">
            <input
              placeholder="Client (CLI-ID)"
              className="w-full bg-bg-primary border border-border rounded-xl pl-12 pr-4 py-3 text-[13px] text-text-primary focus:outline-none focus:border-accent/50 transition-all"
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-accent transition-colors" />
          </div>
          <div className="flex-1 relative group">
            <select className="w-full bg-bg-primary border border-border rounded-xl pl-12 pr-10 py-3 text-[13px] text-text-primary appearance-none focus:outline-none focus:border-accent/50 transition-all cursor-pointer">
              <option>Payment Method</option>
              <option>Bank Transfer</option>
              <option>Card</option>
              <option>Cheque</option>
              <option>PayPal</option>
            </select>
            <CreditCard className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-accent transition-colors" />
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}
