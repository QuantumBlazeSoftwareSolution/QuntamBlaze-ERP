"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard/hr" },
  { label: "Recruitment", href: "/dashboard/hr/recruitment" },
  { label: "Employees", href: "/dashboard/hr/employees" },
  { label: "Attendance", href: "/dashboard/hr/attendance" },
  { label: "Leave", href: "/dashboard/hr/leave" },
  { label: "Payroll", href: "/dashboard/hr/payroll" },
  { label: "Performance", href: "/dashboard/hr/performance" },
];

export function HRNavbar() {
  const pathname = usePathname();

  return (
    <div className="bg-white border-b border-[#E2E8F0] px-8 flex items-center h-14 sticky top-0 z-30">
      <div className="flex gap-8 h-full">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard/hr" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "h-full px-1 text-sm font-bold transition-all border-b-2 flex items-center",
                isActive
                  ? "border-[#10B981] text-[#10B981]"
                  : "border-transparent text-[#94A3B8] hover:text-[#475569]"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
