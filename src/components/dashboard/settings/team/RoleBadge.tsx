"use client";

import { Role } from "@/types/team";
import { cn } from "@/lib/utils";

const ROLE_CONFIG: Record<Role, string> = {
  Admin: "bg-[#FF4444]",
  PM: "bg-[#00E5FF]",
  Developer: "bg-[#00C896]",
  Finance: "bg-[#FFB800]",
  Client: "bg-[#8A8A8A]",
};

export function RoleBadge({ role }: { role: Role }) {
  return (
    <div className={cn(
      "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-[0.06em] text-[#050505] leading-none",
      ROLE_CONFIG[role]
    )}>
      {role}
    </div>
  );
}
