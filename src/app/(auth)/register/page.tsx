import { Metadata } from "next";
import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Quantum Blaze - Sign Up",
  description: "Create an account for Quantum Blaze ERP",
};

export default function RegisterPage() {
  return (
    <AuthSplitLayout title="Create an account" subtitle="Join Quantum Blaze today">
      <RegisterForm />
    </AuthSplitLayout>
  );
}
