import { Metadata } from "next";
import { ForgotPasswordCard } from "@/components/auth/ForgotPasswordCard";

export const metadata: Metadata = {
  title: "Reset Password - Quantum Blaze",
  description: "Request a password reset link for your account",
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-page-bg flex items-center justify-center p-6">
      <ForgotPasswordCard />
    </div>
  );
}
