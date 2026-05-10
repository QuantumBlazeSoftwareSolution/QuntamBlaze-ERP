"use client";

import { TeamMember } from "@/types/team";
import { IDChip } from "@/components/ui/IDChip";
import { RoleBadge } from "./RoleBadge";
import { MoreHorizontal, Mail, ExternalLink, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function TeamMembersTable({ members }: { members: TeamMember[] }) {
  return (
    <div className="bg-bg-card border border-border rounded-2xl overflow-hidden shadow-xl mb-12">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-bg-surface/50 border-b border-border">
              <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-widest">
                Operative
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-widest">
                USR-ID
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-widest">
                Role
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-widest">
                Active Vectors
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-widest">
                Last Synced
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-widest">
                Status
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-widest">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr
                key={member.id}
                className="border-b border-border/50 hover:bg-white/[0.02] transition-colors group"
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white/5 border border-border flex items-center justify-center overflow-hidden">
                      {member.avatar ? (
                        <img src={member.avatar} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] font-bold text-text-muted">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[14px] font-bold text-text-primary tracking-tight">
                        {member.name}
                      </span>
                      <span className="text-[11px] text-text-muted">{member.email}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 font-mono">
                  <IDChip
                    id={member.id}
                    className="bg-transparent border-none p-0 text-text-muted text-[12px]"
                  />
                </td>
                <td className="px-6 py-5">
                  <RoleBadge role={member.role} />
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    {member.activeProjects.slice(0, 1).map((pId) => (
                      <IDChip key={pId} id={pId} className="bg-white/5 border-border text-[10px]" />
                    ))}
                    {member.activeProjects.length > 1 && (
                      <span className="text-[10px] font-bold text-accent">
                        +{member.activeProjects.length - 1}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="text-[12px] text-text-muted font-mono">{member.lastActive}</span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        member.status === "Active"
                          ? "bg-accent shadow-[0_0_8px_rgba(0,229,255,0.5)]"
                          : "bg-text-muted"
                      )}
                    />
                    <span
                      className={cn(
                        "text-[12px] font-medium",
                        member.status === "Active" ? "text-text-primary" : "text-text-muted"
                      )}
                    >
                      {member.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <button className="p-2 text-text-muted hover:text-text-primary transition-all">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
