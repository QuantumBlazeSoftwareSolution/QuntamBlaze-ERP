import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  // If user already has an active session, redirect to the dashboard
  const session = await getSession();
  if (session) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
