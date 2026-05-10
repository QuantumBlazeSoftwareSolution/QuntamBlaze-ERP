"use client";

import React from "react";

/**
 * Placeholder Sidebar for Task 4
 * Full implementation will be done in Task 25
 */
const SidebarPlaceholder = () => {
  return (
    <aside className="w-64 h-screen bg-sidebar-bg border-r border-sidebar-border flex flex-col sticky top-0 shrink-0">
      <div className="p-6">
        <div className="text-accent font-bold text-xl">QB</div>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        <div className="h-10 bg-sidebar-item-active border-l-2 border-accent rounded-r-lg flex items-center px-4 text-white text-sm font-medium">
          Dashboard
        </div>
        {["Projects", "Tasks", "Finance", "Documents"].map((item) => (
          <div
            key={item}
            className="h-10 flex items-center px-4 text-sidebar-text text-sm hover:text-white transition-colors cursor-pointer"
          >
            {item}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-page-bg">
      <SidebarPlaceholder />
      <div className="flex-1 flex flex-col min-w-0">{children}</div>
    </div>
  );
}
