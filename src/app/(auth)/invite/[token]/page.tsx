import { Metadata } from "next";
import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { InviteForm } from "@/components/auth/InviteForm";

export const metadata: Metadata = {
  title: "Accept Invite - Quantum Blaze",
  description: "Set up your Quantum Blaze ERP account",
};

export default function InvitePage() {
  const onboardingIllustration = (
    <div className="w-full flex justify-center items-center">
      <div className="relative w-64 h-64">
        {/* Abstract geometric shapes in Teal */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-accent/20 rounded-full blur-xl" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-accent/30 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-4 border-accent rotate-45 opacity-80" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-accent/50 -rotate-12 opacity-60" />
        <div className="absolute top-1/4 right-1/4 w-8 h-8 bg-accent rounded-sm rotate-12" />
        <div className="absolute bottom-1/4 left-1/4 w-4 h-4 bg-accent rounded-full" />
      </div>
    </div>
  );

  return (
    <AuthSplitLayout 
      title="Join your team" 
      subtitle="Complete your account setup to access Quantum Blaze."
      leftContent={onboardingIllustration}
    >
      <InviteForm />
    </AuthSplitLayout>
  );
}
