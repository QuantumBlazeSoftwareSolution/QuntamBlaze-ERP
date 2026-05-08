"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { NavItem } from "@/types/navigation";
import { useSidebarStore } from "@/store/sidebarStore";
import { cn } from "@/lib/utils";

export function SidebarNavItem({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const { isCollapsed } = useSidebarStore();
  
  const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
  const Icon = item.icon;

  return (
    <Link href={item.href} className="block relative group">
      <div className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 relative",
        isActive 
          ? "bg-[#00E5FF0D] text-[#F0F0F0]" 
          : "text-[#8A8A8A] hover:text-[#F0F0F0] hover:bg-white/[0.03]"
      )}>
        {/* Active Indicator */}
        {isActive && (
          <motion.div 
            layoutId="active-nav"
            className="absolute left-0 top-2 bottom-2 w-0.5 bg-[#00E5FF] rounded-full"
          />
        )}

        <Icon className={cn("w-[18px] h-[18px] shrink-0", isActive && "text-[#00E5FF]")} />
        
        {!isCollapsed && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 flex items-center justify-between overflow-hidden"
          >
            <span className="text-[13px] font-medium whitespace-nowrap">{item.label}</span>
            {item.badge && (
              <span className={cn(
                "px-1.5 py-0.5 rounded-full text-[10px] font-bold min-w-[18px] text-center",
                item.badge.color,
                item.badge.textColor
              )}>
                {item.badge.count}
              </span>
            )}
          </motion.div>
        )}

        {/* Collapsed Tooltip */}
        {isCollapsed && (
          <div className="absolute left-full ml-4 px-3 py-1.5 bg-bg-card border border-border rounded text-[12px] font-medium text-text-primary whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-2xl">
            {item.label}
            {item.badge && ` (${item.badge.count})`}
          </div>
        )}
      </div>
    </Link>
  );
}
