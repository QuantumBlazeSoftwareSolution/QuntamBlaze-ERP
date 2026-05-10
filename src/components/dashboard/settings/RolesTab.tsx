"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Users, Shield, ShieldCheck, ShieldX, Plus, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_ROLES, MODULES, ALL_PERMISSIONS, Role, Permission } from "@/lib/mockData/roles";

const PERMISSION_LABELS: Record<Permission, { label: string; color: string }> = {
  read: { label: "Read", color: "bg-blue-100 text-blue-700 border-blue-200" },
  write: { label: "Write", color: "bg-amber-100 text-amber-700 border-amber-200" },
  delete: { label: "Delete", color: "bg-red-100 text-red-700 border-red-200" },
  admin: { label: "Admin", color: "bg-accent/10 text-accent border-accent/20" },
};

function PermissionToggle({
  active,
  disabled,
  onClick,
}: {
  active: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-9 h-5 rounded-full relative transition-colors duration-200",
        active ? "bg-accent" : "bg-border",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <motion.div
        animate={{ x: active ? 16 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm"
      />
    </button>
  );
}

function RoleCard({ role }: { role: Role }) {
  const [expanded, setExpanded] = useState(false);
  const [permissions, setPermissions] = useState<Role["permissions"]>({ ...role.permissions });

  const totalPerms = Object.values(permissions).flat().length;
  const totalPossible = MODULES.length * ALL_PERMISSIONS.length;

  const togglePermission = (module: string, perm: Permission) => {
    if (role.isSystem) return;
    setPermissions((prev) => {
      const current = prev[module] ?? [];
      const has = current.includes(perm);
      return {
        ...prev,
        [module]: has ? current.filter((p) => p !== perm) : [...current, perm],
      };
    });
  };

  return (
    <motion.div
      layout
      className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden"
    >
      {/* Card Header */}
      <div
        className="p-6 cursor-pointer hover:bg-page-bg transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center border"
              style={{ backgroundColor: `${role.color}15`, borderColor: `${role.color}30` }}
            >
              <Shield className="w-5 h-5" style={{ color: role.color }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-text-primary">{role.name}</h3>
                {role.isSystem && (
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-accent/10 text-accent border border-accent/20 rounded">
                    System
                  </span>
                )}
              </div>
              <p className="text-[12px] text-text-muted mt-0.5 max-w-xs">{role.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-1.5 text-text-muted">
              <Users className="w-3.5 h-3.5" />
              <span className="text-[12px] font-medium">{role.memberCount}</span>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                Access Level
              </p>
              <p className="text-[12px] font-bold text-text-primary mt-0.5">
                {totalPerms}/{totalPossible} perms
              </p>
            </div>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-text-muted transition-transform duration-200",
                expanded && "rotate-180"
              )}
            />
          </div>
        </div>

        {/* Permission Summary Pills */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {Object.entries(permissions)
            .filter(([_, perms]) => perms.length > 0)
            .map(([mod, perms]) => (
              <div
                key={mod}
                className="flex items-center gap-1 px-2 py-0.5 bg-page-bg border border-divider rounded-lg"
              >
                <span className="text-[10px] font-bold text-text-secondary capitalize">{mod}</span>
                <span className="text-[9px] text-text-muted">·</span>
                <span className="text-[10px] font-bold text-text-muted">{perms.length}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Expanded Permission Grid */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-divider">
              {role.isSystem && (
                <div className="flex items-center gap-2 px-6 py-3 bg-accent/5 border-b border-divider">
                  <Lock className="w-3.5 h-3.5 text-accent" />
                  <p className="text-[11px] font-bold text-accent">
                    System roles cannot be modified.
                  </p>
                </div>
              )}

              {/* Header Row */}
              <div className="grid grid-cols-[1fr_repeat(4,_64px)] gap-x-2 px-6 py-3 bg-page-bg border-b border-divider">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                  Module
                </span>
                {ALL_PERMISSIONS.map((p) => (
                  <span
                    key={p}
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-wider text-center",
                      PERMISSION_LABELS[p].color.split(" ")[1]
                    )}
                  >
                    {PERMISSION_LABELS[p].label}
                  </span>
                ))}
              </div>

              {/* Permission Rows */}
              <div className="divide-y divide-divider">
                {MODULES.map((mod) => {
                  const modPerms = permissions[mod.id] ?? [];
                  return (
                    <div
                      key={mod.id}
                      className="grid grid-cols-[1fr_repeat(4,_64px)] gap-x-2 px-6 py-3.5 items-center hover:bg-page-bg/50 transition-colors"
                    >
                      <span className="text-[13px] font-medium text-text-secondary capitalize">
                        {mod.label}
                      </span>
                      {ALL_PERMISSIONS.map((perm) => (
                        <div key={perm} className="flex justify-center">
                          <PermissionToggle
                            active={modPerms.includes(perm)}
                            disabled={role.isSystem}
                            onClick={() => togglePermission(mod.id, perm)}
                          />
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              {!role.isSystem && (
                <div className="px-6 py-4 bg-page-bg border-t border-divider flex items-center justify-end gap-3">
                  <button className="px-4 py-2 text-[12px] font-bold text-text-muted hover:text-text-primary transition-colors">
                    Reset to Default
                  </button>
                  <button className="px-5 py-2 bg-accent text-white text-[12px] font-bold rounded-lg hover:bg-accent/90 transition-all shadow-sm">
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function RolesTab() {
  const [roles, setRoles] = useState(MOCK_ROLES);

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[13px] text-text-muted">
            {roles.length} roles configured · {roles.reduce((acc, r) => acc + r.memberCount, 0)}{" "}
            total members
          </p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white text-[13px] font-bold rounded-xl hover:bg-accent/90 transition-all shadow-sm shadow-accent/20">
          <Plus className="w-4 h-4" />
          New Role
        </button>
      </div>

      {/* Role Cards */}
      <div className="space-y-4">
        {roles.map((role) => (
          <RoleCard key={role.id} role={role} />
        ))}
      </div>

      {/* Info Footer */}
      <div className="flex items-center gap-3 p-4 bg-page-bg border border-divider rounded-xl">
        <ShieldCheck className="w-5 h-5 text-accent shrink-0" />
        <p className="text-[12px] text-text-secondary leading-relaxed">
          Permissions are applied in real-time. System roles (Admin) are protected and cannot be
          modified to ensure at least one administrator always has full access.
        </p>
      </div>
    </div>
  );
}
