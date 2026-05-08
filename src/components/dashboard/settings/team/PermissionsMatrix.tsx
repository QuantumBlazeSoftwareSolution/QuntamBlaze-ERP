"use client";

import { useTeamStore } from "@/store/useTeamStore";
import { Role, ModulePermissions, PermissionSet } from "@/types/team";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const MODULES: (keyof ModulePermissions)[] = ["projects", "finance", "leads", "docs", "settings", "admin"];
const ROLES: Role[] = ["Admin", "PM", "Developer", "Finance", "Client"];

function PermissionToggle({ 
  active, 
  onChange, 
  label 
}: { 
  active: boolean; 
  onChange: (val: boolean) => void;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
       <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest">{label}</span>
       <button 
         onClick={() => onChange(!active)}
         className={cn(
           "w-[28px] h-[16px] rounded-full relative transition-all duration-300",
           active ? "bg-accent" : "bg-[#1A1A1A]"
         )}
       >
         <motion.div 
           animate={{ x: active ? 13 : 2 }}
           className="w-[12px] h-[12px] bg-white rounded-full absolute top-[2px] shadow-sm"
           transition={{ type: "spring", stiffness: 500, damping: 30 }}
         />
       </button>
    </div>
  );
}

export function PermissionsMatrix() {
  const { rolePermissions, updatePermission } = useTeamStore();

  return (
    <div className="bg-bg-card border border-border rounded-2xl overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-bg-surface/50 border-b border-border">
              <th className="px-8 py-6 text-[11px] font-bold text-text-muted uppercase tracking-[0.2em] border-r border-border">Permission Role</th>
              {MODULES.map((mod, idx) => (
                <th 
                  key={mod} 
                  className={cn(
                    "px-6 py-6 text-[11px] font-bold text-text-muted uppercase tracking-[0.2em] text-center",
                    idx % 2 === 0 ? "bg-[#0A0A0A]" : "bg-[#050505]"
                  )}
                >
                  {mod}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROLES.map((role) => (
              <tr key={role} className="border-b border-border/50 hover:bg-white/[0.01] transition-colors">
                <td className="px-8 py-6 border-r border-border">
                  <div className="flex flex-col">
                    <span className="text-[14px] font-bold text-text-primary">{role}</span>
                    <span className="text-[10px] text-text-muted uppercase tracking-widest mt-1">Default Template</span>
                  </div>
                </td>
                {MODULES.map((mod, idx) => (
                  <td 
                    key={mod} 
                    className={cn(
                      "px-6 py-6",
                      idx % 2 === 0 ? "bg-[#0A0A0A]/50" : "bg-[#050505]/50"
                    )}
                  >
                    <div className="flex items-center justify-center gap-4">
                      <PermissionToggle 
                        label="R"
                        active={rolePermissions[role][mod].read}
                        onChange={(val) => updatePermission(role, mod, "read", val)}
                      />
                      <PermissionToggle 
                        label="W"
                        active={rolePermissions[role][mod].write}
                        onChange={(val) => updatePermission(role, mod, "write", val)}
                      />
                      <PermissionToggle 
                        label="A"
                        active={rolePermissions[role][mod].admin}
                        onChange={(val) => updatePermission(role, mod, "admin", val)}
                      />
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
