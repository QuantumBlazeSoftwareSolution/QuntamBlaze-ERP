import { Metadata } from "next";

import { ForgotPasswordCard } from "@/components/auth/ForgotPasswordCard";

export const metadata: Metadata = {
  title: "Quantum Blaze - Reset Access",
  description: "Reset your Quantum Blaze ERP account password",
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-bg-primary bg-grid-pattern">
      {/* Background radial gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-dim rounded-full blur-[120px] pointer-events-none" />

      {/* Main Content Container */}
      <main className="z-10 flex flex-col items-center w-full px-4 relative max-w-md my-12">
        
        {/* Logo / Brand Anchor */}
        <div className="mb-10 flex flex-col items-center justify-center">
          {/* Using a text-based logo matching our theme since we don't have the image asset */}
          <div className="w-12 h-12 rounded bg-bg-surface flex items-center justify-center border-t border-l border-border shadow-[inset_1px_1px_0_rgba(255,255,255,0.05)] mb-3 opacity-90">
            <span className="text-xl font-bold text-accent tracking-tighter">QB</span>
          </div>
          <h1 className="text-[28px] font-black tracking-tighter text-accent">
            Quantum Blaze
          </h1>
        </div>

        {/* The Card */}
        <ForgotPasswordCard />

        {/* Footer utilities */}
        <div className="mt-8 w-full flex justify-between items-center text-text-secondary/50 font-mono text-[10px] max-w-[420px]">
          <span>SYS.STAT: ONLINE</span>
          <span>SEC.LVL: OMEGA</span>
        </div>
      </main>
    </div>
  );
}
