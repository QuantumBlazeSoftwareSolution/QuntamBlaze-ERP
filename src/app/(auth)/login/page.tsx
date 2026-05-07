import { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { LogoMark } from "@/components/auth/LogoMark";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Quantum Blaze - System Access",
  description: "Secure login portal for Quantum Blaze ERP",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-bg-primary bg-grid-pattern">
      {/* Background radial gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-dim rounded-full blur-[120px] pointer-events-none" />

      {/* Main Content */}
      <main className="z-10 flex flex-col items-center w-full px-4 relative">
        <LogoMark />
        <AuthCard>
          <LoginForm />
        </AuthCard>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 w-full flex justify-between items-center px-8 py-4 z-40 bg-bg-elevated border-t border-border text-[11px] font-bold tracking-[0.1em] uppercase">
        <div className="text-accent">
          Quantum Blaze v1.0 — Secure Access
        </div>
        <div className="hidden md:flex gap-6">
          <a href="#" className="text-text-muted hover:text-accent transition-colors">
            System Status
          </a>
          <a href="#" className="text-text-muted hover:text-accent transition-colors">
            Security Registry
          </a>
        </div>
      </footer>
    </div>
  );
}
