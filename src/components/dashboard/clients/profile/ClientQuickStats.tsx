"use client";

import { Wallet, Briefcase, Calendar, ArrowRight, AlertTriangle } from "lucide-react";
import { ClientDetail } from "@/types/client";
import { cn } from "@/lib/utils";

interface ClientQuickStatsProps {
  client: ClientDetail;
}

export function ClientQuickStats({ client }: ClientQuickStatsProps) {
  const hasOutstanding = client.outstandingBalance > 0;

  return (
    <div className="space-y-6 sticky top-24">
      {/* Main Stats Card */}
      <div className="bg-bg-card border border-border rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
        {/* Subtle Accent Glow */}
        <div className="absolute -right-20 -top-20 w-40 h-40 bg-accent/5 rounded-full blur-[80px]" />

        <div className="flex items-center gap-2 mb-8 relative z-10">
          <div className="w-2 h-2 rounded-full bg-accent" />
          <h3 className="text-[11px] font-bold text-text-secondary uppercase tracking-[0.2em]">
            Client Intel
          </h3>
        </div>

        <div className="space-y-8 relative z-10">
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
              Total Billed (YTD)
            </p>
            <p className="text-4xl font-bold text-text-primary tracking-tighter">
              ${(client.totalBilled / 1000000).toFixed(1)}M
            </p>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-accent w-[72%] shadow-[0_0_10px_rgba(0,229,255,0.5)]" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-border">
              <div className="flex items-center gap-2 text-text-secondary mb-2">
                <Briefcase className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Projects</span>
              </div>
              <p className="text-2xl font-bold text-text-primary">{client.activeProjects.length}</p>
              <p className="text-[9px] font-medium text-text-muted mt-1">Total Active</p>
            </div>

            <div
              className={cn(
                "p-4 rounded-xl border",
                hasOutstanding ? "bg-danger/5 border-danger/20" : "bg-white/5 border-border"
              )}
            >
              <div
                className={cn(
                  "flex items-center gap-2 mb-2",
                  hasOutstanding ? "text-danger" : "text-text-secondary"
                )}
              >
                <Wallet className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Outstanding</span>
              </div>
              <div className="flex items-center gap-2">
                <p
                  className={cn(
                    "text-2xl font-bold",
                    hasOutstanding ? "text-danger" : "text-text-primary"
                  )}
                >
                  ${(client.outstandingBalance / 1000).toFixed(0)}k
                </p>
                {hasOutstanding && <AlertTriangle className="w-4 h-4 text-danger animate-pulse" />}
              </div>
              <p className="text-[9px] font-medium text-text-muted mt-1">Net Balance</p>
            </div>
          </div>

          {client.nextInvoiceDue && (
            <div className="pt-6 border-t border-border/50">
              <div className="flex items-center gap-2 text-accent mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Next Invoice Due
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-[15px] font-bold text-text-primary">
                  {client.nextInvoiceDue.date}
                </p>
                <p className="text-[12px] text-text-secondary">
                  {client.nextInvoiceDue.id} • ${client.nextInvoiceDue.amount.toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>

        <button className="w-full mt-10 py-4 bg-white/5 hover:bg-white/10 border-t border-border flex items-center justify-center gap-2 text-[11px] font-bold text-text-secondary hover:text-text-primary transition-all rounded-b-2xl -mx-6 -mb-6">
          VIEW FULL HISTORY
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
