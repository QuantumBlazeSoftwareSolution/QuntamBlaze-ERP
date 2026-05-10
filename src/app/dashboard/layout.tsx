"use client";

import { GlobalSearchBar } from "@/components/dashboard/GlobalSearchBar";
import { SearchProvider } from "@/hooks/useSearchOverlay";
import { GlobalSearchOverlay } from "@/components/search/GlobalSearchOverlay";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { NotificationsPanel } from "@/components/layout/NotificationsPanel";
import { Sidebar } from "@/components/layout/Sidebar";
import { useSidebarStore } from "@/store/sidebarStore";
import { AuditLogDrawer } from "@/components/layout/AuditLogDrawer";
import { cn } from "@/lib/utils";
import { Grid } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebarStore();

  return (
    <SearchProvider>
      <div className="h-screen bg-page-bg font-sans text-text-primary antialiased selection:bg-accent/20 selection:text-accent overflow-hidden flex">
        {/* New Sidebar */}
        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0 relative">
          {/* TopAppBar */}
          <header
            className={cn(
              "fixed top-0 right-0 z-30 flex items-center justify-between px-8 h-16 bg-white/80 backdrop-blur-md border-b border-divider transition-all duration-300",
              isCollapsed ? "left-[72px]" : "left-[260px]"
            )}
          >
            <div className="flex-1 flex items-center max-w-2xl hidden md:flex">
              <GlobalSearchBar />
            </div>

            <div className="flex items-center gap-6">
              <NotificationBell />
              <button className="text-text-secondary hover:bg-page-bg transition-colors duration-200 p-2 rounded-full">
                <Grid className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 rounded-full overflow-hidden border border-border ml-2 bg-accent-light flex items-center justify-center text-xs font-bold text-accent uppercase">
                AM
              </div>
            </div>
          </header>

          {/* Main Content Stage */}
          <main
            className={cn(
              "relative z-10 pt-24 pb-12 px-8 flex-1 overflow-y-auto custom-scrollbar transition-all duration-300",
              isCollapsed ? "ml-0" : "ml-0"
            )}
          >
            {children}
          </main>
        </div>
      </div>
      <GlobalSearchOverlay />
      <NotificationsPanel />
      <AuditLogDrawer />
    </SearchProvider>
  );
}
