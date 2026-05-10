import { Metadata } from "next";
import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Quantum Blaze - System Access",
  description: "Secure login portal for Quantum Blaze ERP",
};

export default function LoginPage() {
  return (
    <AuthSplitLayout 
      title="Welcome back" 
      subtitle="Sign in to your account to continue"
    >
      <LoginForm />
    </AuthSplitLayout>
  );
}
