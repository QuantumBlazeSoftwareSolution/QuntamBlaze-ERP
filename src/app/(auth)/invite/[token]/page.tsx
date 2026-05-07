import { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { InviteHeader } from "@/components/auth/InviteHeader";
import { StepIndicator } from "@/components/auth/StepIndicator";
import { InviteForm } from "@/components/auth/InviteForm";
import { Terminal } from "lucide-react";

export const metadata: Metadata = {
  title: "Quantum Blaze - Account Setup",
  description: "Set up your Quantum Blaze ERP account",
};

// Next.js 14 dynamic route params type
interface InvitePageProps {
  params: {
    token: string;
  };
}

export default function InvitePage({ params }: InvitePageProps) {
  // In a real app, you would decode the JWT/token here
  // Mocking the decode process based on the token
  const mockEmail = params.token ? `executive@quantumblaze.co` : "unknown@quantumblaze.co";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-bg-primary bg-grid-pattern">
      {/* Background radial gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-dim rounded-full blur-[120px] pointer-events-none" />

      {/* Main Content Container */}
      <main className="z-10 flex flex-col items-center w-full px-4 relative max-w-md my-12">
        <InviteHeader email={mockEmail} />
        
        <AuthCard>
          <StepIndicator currentStep={1} totalSteps={2} title="Details & Security" />
          <InviteForm />
        </AuthCard>

        {/* Footer Badge matching the mock */}
        <div className="mt-8 flex items-center justify-center gap-1.5 opacity-50">
          <Terminal className="w-3.5 h-3.5 text-text-secondary" />
          <span className="text-[11px] font-bold tracking-[0.1em] text-text-secondary uppercase">
            Powered by Quantum Blaze ERP
          </span>
        </div>
      </main>
    </div>
  );
}
