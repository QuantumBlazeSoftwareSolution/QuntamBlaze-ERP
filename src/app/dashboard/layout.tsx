import { LayoutDashboard, Settings, Users, Box, PenTool, Shield, HelpCircle, Grid } from "lucide-react";
import { GlobalSearchBar } from "@/components/dashboard/GlobalSearchBar";
import { SearchProvider } from "@/hooks/useSearchOverlay";
import { GlobalSearchOverlay } from "@/components/search/GlobalSearchOverlay";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { NotificationsPanel } from "@/components/layout/NotificationsPanel";
import { NewProjectModal } from "@/components/projects/NewProjectModal";
import { TaskDetailPanel } from "@/components/tasks/TaskDetailPanel";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SearchProvider>
      <div className="min-h-screen bg-bg-primary font-sans text-text-primary antialiased selection:bg-accent/20 selection:text-accent overflow-x-hidden">
        {/* Grid Texture */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 bg-[radial-gradient(#3c494e_1px,transparent_1px)] [background-size:20px_20px] [background-position:-10px_-10px]" />

        {/* SideNavBar */}
        <nav className="fixed left-0 top-0 bottom-0 z-40 flex-col py-6 bg-bg-surface w-64 border-r border-border hidden md:flex shadow-2xl">
          <div className="px-6 mb-10">
            <h1 className="text-2xl font-black text-accent tracking-tighter">Quantum Blaze</h1>
            <p className="text-[11px] font-bold tracking-[0.1em] text-text-secondary uppercase mt-1">Ops Control v4.2</p>
          </div>

          <div className="flex flex-col gap-1 flex-1 overflow-y-auto px-4">
            <a href="#" className="flex items-center gap-4 px-4 py-2.5 rounded-md text-accent bg-accent/10 border-r-2 border-accent shadow-[0_0_12px_rgba(0,229,255,0.15)] group transition-all">
              <LayoutDashboard className="w-5 h-5 fill-current" />
              <span className="text-[11px] font-bold tracking-[0.1em] uppercase">Dashboard</span>
            </a>
            <a href="#" className="flex items-center gap-4 px-4 py-2.5 rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-card transition-all duration-300 group">
              <PenTool className="w-5 h-5" />
              <span className="text-[11px] font-bold tracking-[0.1em] uppercase">Operations</span>
            </a>
            <a href="#" className="flex items-center gap-4 px-4 py-2.5 rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-card transition-all duration-300 group">
              <Box className="w-5 h-5" />
              <span className="text-[11px] font-bold tracking-[0.1em] uppercase">Logistics</span>
            </a>
            <a href="#" className="flex items-center gap-4 px-4 py-2.5 rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-card transition-all duration-300 group">
              <Grid className="w-5 h-5" />
              <span className="text-[11px] font-bold tracking-[0.1em] uppercase">Analytics</span>
            </a>
            <a href="#" className="flex items-center gap-4 px-4 py-2.5 rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-card transition-all duration-300 group">
              <Users className="w-5 h-5" />
              <span className="text-[11px] font-bold tracking-[0.1em] uppercase">Workforce</span>
            </a>
            <a href="#" className="flex items-center gap-4 px-4 py-2.5 rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-card transition-all duration-300 group">
              <Shield className="w-5 h-5" />
              <span className="text-[11px] font-bold tracking-[0.1em] uppercase">Audit</span>
            </a>
          </div>

          <div className="px-4 mt-auto flex flex-col gap-1">
            <a href="#" className="flex items-center gap-4 px-4 py-2.5 rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-card transition-all duration-300 group">
              <HelpCircle className="w-5 h-5" />
              <span className="text-[11px] font-bold tracking-[0.1em] uppercase">Support</span>
            </a>
            <a href="#" className="flex items-center gap-4 px-4 py-2.5 rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-card transition-all duration-300 group">
              <Settings className="w-5 h-5" />
              <span className="text-[11px] font-bold tracking-[0.1em] uppercase">Settings</span>
            </a>
          </div>
        </nav>

        {/* TopAppBar */}
        <header className="fixed top-0 right-0 left-0 z-30 flex items-center justify-between px-8 h-16 md:pl-[288px] bg-bg-surface/80 backdrop-blur-md border-b border-border">
          <div className="flex items-center gap-4 md:hidden">
            <span className="text-2xl font-black tracking-tighter text-accent">Quantum Blaze</span>
          </div>

          <div className="flex-1 flex items-center max-w-2xl hidden md:flex">
            <GlobalSearchBar />
          </div>

          <div className="flex items-center gap-6">
            <NotificationBell />
            <button className="text-text-secondary hover:bg-bg-card transition-colors duration-200 p-2 rounded-full">
              <Grid className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-border ml-2 bg-bg-card flex items-center justify-center text-xs font-bold text-text-secondary uppercase">
              AJ
            </div>
          </div>
        </header>

        {/* Main Content Stage */}
        <main className="relative z-10 pt-24 pb-8 px-8 md:pl-[calc(256px+32px)]">
          {children}
        </main>
      </div>
      <GlobalSearchOverlay />
      <NotificationsPanel />
      <NewProjectModal />
      <TaskDetailPanel />
    </SearchProvider>
  );
}
