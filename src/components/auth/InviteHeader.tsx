import { Lock } from "lucide-react";

interface InviteHeaderProps {
  email: string;
}

export function InviteHeader({ email }: InviteHeaderProps) {
  return (
    <div className="flex flex-col items-center mb-8">
      <div className="w-16 h-16 rounded-xl bg-bg-surface flex items-center justify-center border-t border-l border-border shadow-[inset_1px_1px_0_rgba(255,255,255,0.05)] mb-4">
        <span className="text-2xl font-bold text-accent tracking-tighter">QB</span>
      </div>
      <h1 className="text-2xl font-medium text-text-primary tracking-tight">
        Account Setup
      </h1>
      <p className="text-sm text-text-secondary mt-2 mb-6">
        You&apos;ve been invited to Quantum Blaze
      </p>

      {/* Read-only Email Field */}
      <div className="w-full flex flex-col gap-1.5 text-left">
        <label className="text-[11px] font-bold tracking-[0.1em] text-text-secondary uppercase">
          Email Address
        </label>
        <div className="flex items-center bg-[#0A0A0A] border border-[#252525] px-4 py-3 rounded-md text-[#8A8A8A] cursor-not-allowed w-full">
          <Lock className="w-[18px] h-[18px] text-[#8A8A8A] mr-3" />
          <span className="text-sm font-mono">{email}</span>
        </div>
      </div>
    </div>
  );
}
