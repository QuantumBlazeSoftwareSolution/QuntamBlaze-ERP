"use client";

import { Mail, Phone, Globe, MapPin, CreditCard, DollarSign, User } from "lucide-react";
import { ClientDetail } from "@/types/client";

export function OverviewTab({ client }: { client: ClientDetail }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Primary Contact Card */}
      <div className="bg-bg-card/30 border border-border rounded-2xl p-8 space-y-8">
        <div className="flex items-center gap-3 pb-6 border-b border-border/50">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
            <User className="w-5 h-5" />
          </div>
          <h3 className="text-[11px] font-bold text-text-secondary uppercase tracking-[0.2em]">
            Primary Contact
          </h3>
        </div>

        <div className="space-y-6">
          <div className="space-y-1">
            <p className="text-2xl font-bold text-text-primary tracking-tight">
              {client.contactPerson}
            </p>
            <p className="text-[13px] text-accent font-medium uppercase tracking-widest opacity-80">
              Chief Executive Officer
            </p>
          </div>

          <div className="grid gap-4">
            <div className="flex items-center gap-4 text-text-secondary hover:text-text-primary transition-colors cursor-pointer group">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-accent/10 group-hover:text-accent transition-all">
                <Mail className="w-4 h-4" />
              </div>
              <span className="text-[14px]">{client.contactEmail}</span>
            </div>
            <div className="flex items-center gap-4 text-text-secondary hover:text-text-primary transition-colors cursor-pointer group">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-accent/10 group-hover:text-accent transition-all">
                <Phone className="w-4 h-4" />
              </div>
              <span className="text-[14px]">{client.contactPhone}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Billing & Terms Card */}
      <div className="bg-bg-card/30 border border-border rounded-2xl p-8 space-y-8">
        <div className="flex items-center gap-3 pb-6 border-b border-border/50">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
            <CreditCard className="w-5 h-5" />
          </div>
          <h3 className="text-[11px] font-bold text-text-secondary uppercase tracking-[0.2em]">
            Billing & Terms
          </h3>
        </div>

        <div className="space-y-8">
          <div className="space-y-3">
            <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest">
              Billing Address
            </p>
            <p className="text-[14px] text-text-secondary leading-relaxed max-w-xs">
              {client.billingAddress}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-bg-primary border border-border">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">
                Payment Terms
              </p>
              <p className="text-[15px] font-bold text-accent">{client.paymentTerms}</p>
            </div>
            <div className="p-4 rounded-xl bg-bg-primary border border-border">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">
                Currency
              </p>
              <p className="text-[15px] font-bold text-text-primary">{client.currency}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
