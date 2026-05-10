"use client";

import { motion } from "framer-motion";
import { 
  PanelLeftClose, 
  PanelLeftOpen, 
  Settings, 
  Bell, 
  LogOut,
  ChevronRight
} from "lucide-react";
import { SidebarNavItem } from "./SidebarNavItem";
import { NAV_CONFIG } from "@/lib/navigation/navConfig";
import { useSidebarStore } from "@/store/sidebarStore";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function Sidebar() {
  const { isCollapsed, toggleCollapse } = useSidebarStore();

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 72 : 260 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className="h-screen bg-sidebar-bg border-r border-sidebar-border flex flex-col relative z-50 shrink-0"
    >
      {/* Header / Logo */}
      <div className="h-20 flex items-center px-6 gap-3 overflow-hidden">
        <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
          <div className="w-4 h-4 bg-accent rounded-sm rotate-45" />
        </div>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col"
          >
            <span className="text-lg font-black text-text-primary tracking-tighter leading-none">Quantum Blaze</span>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mt-0.5">Ops Control v4.2</span>
          </motion.div>
        )}
      </div>

      {/* Navigation Scroll Area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar space-y-8">
        {NAV_CONFIG.map((section) => (
          <div key={section.label} className="space-y-1">
            {!isCollapsed && (
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-3 text-[10px] font-bold text-sidebar-text uppercase tracking-[0.2em] mb-3"
              >
                {section.label}
              </motion.h3>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <SidebarNavItem key={item.label} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="p-3 border-t border-sidebar-border space-y-2">
        <Link href="/dashboard/settings" className="block">
           <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-text hover:text-white hover:bg-white/[0.03] transition-all">
              <Settings className="w-[18px] h-[18px] shrink-0" />
              {!isCollapsed && <span className="text-[13px] font-medium">System Settings</span>}
           </div>
        </Link>

        {/* User Profile / Collapse Toggle */}
        <div className={cn(
          "bg-white/[0.03] border border-white/5 rounded-xl transition-all",
          isCollapsed ? "p-2" : "p-3"
        )}>
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center text-[10px] font-bold text-accent shrink-0 relative">
                 AM
                 <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#00E5FF] border-2 border-[#0A0A0A] rounded-full" />
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                   <p className="text-[13px] font-bold text-text-primary truncate">A. Mercer</p>
                   <p className="text-[10px] text-accent font-bold uppercase tracking-widest">Cmdr</p>
                </div>
              )}
              <button 
                onClick={toggleCollapse}
                className="p-1.5 text-[#3A3A3A] hover:text-text-primary transition-colors"
              >
                {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
              </button>
           </div>
        </div>
      </div>
    </motion.aside>
  );
}
