"use client";

import { motion } from "framer-motion";
import { Edit3, Globe, MapPin, User, ChevronRight } from "lucide-react";
import { ClientDetail } from "@/types/client";
import { IDChip } from "@/components/ui/IDChip";
import { getColorFromString, getInitials } from "@/lib/utils/colorHash";
import { cn } from "@/lib/utils";

interface ClientProfileHeaderProps {
  client: ClientDetail;
}

export function ClientProfileHeader({ client }: ClientProfileHeaderProps) {
  return (
    <div className="w-full bg-bg-card/50 border-b border-border p-8 mb-8 rounded-t-2xl">
      <div className="flex flex-col md:flex-row items-start justify-between gap-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Logo / Avatar */}
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black text-[#050505] shadow-[0_10px_30px_rgba(0,0,0,0.3)] border border-white/10"
            style={{ backgroundColor: getColorFromString(client.name) }}
          >
            {getInitials(client.name)}
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <IDChip
                id={client.id}
                className="text-[12px] px-3 py-1.5 bg-accent/5 border-accent/20 text-accent"
              />
              <span
                className={cn(
                  "px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                  client.status === "Active"
                    ? "border-success/30 text-success bg-success/5"
                    : "border-text-muted/30 text-text-muted bg-white/5"
                )}
              >
                <span
                  className={cn(
                    "inline-block w-1.5 h-1.5 rounded-full mr-1.5",
                    client.status === "Active"
                      ? "bg-success shadow-[0_0_8px_rgba(0,200,150,0.5)]"
                      : "bg-text-muted"
                  )}
                />
                {client.status}
              </span>
            </div>

            <div>
              <h1 className="text-4xl font-bold text-text-primary tracking-tight">{client.name}</h1>
              <div className="flex items-center gap-6 mt-3">
                <div className="flex items-center gap-2 text-text-secondary text-[14px]">
                  <Globe className="w-4 h-4 text-accent" />
                  <span>{client.industry}</span>
                </div>
                <div className="flex items-center gap-2 text-text-secondary text-[14px]">
                  <MapPin className="w-4 h-4 text-text-muted" />
                  <span>{client.billingAddress}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-4">
          <div className="bg-bg-primary/50 border border-border rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.15em]">
                Account Manager
              </p>
              <p className="text-[14px] font-bold text-text-primary">
                {client.accountManager.name}
              </p>
            </div>
          </div>

          <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-border text-text-primary font-bold text-[13px] rounded-lg hover:bg-white/10 transition-all group">
            <Edit3 className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}
