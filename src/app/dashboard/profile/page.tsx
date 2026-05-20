import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getPersonalTasksAction } from "@/app/actions/personalTaskActions";
import ProfileClient from "@/components/profile/ProfileClient";

export const metadata = {
  title: "My Profile & Personal Dashboard | Quantum Blaze ERP",
  description: "Access your authorized profile details, credentials, and manage personal action checklists securely.",
};

export default async function ProfileDashboardPage() {
  const session = await getSession();
  if (!session || !session.userId) {
    redirect("/login");
  }

  const tasksResponse = await getPersonalTasksAction();
  const initialTasks = tasksResponse.success ? tasksResponse.tasks : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-text-primary tracking-tight font-outfit">
          Account Profile & Board
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Review credentials, active system authorization role, and track your personal task management items.
        </p>
      </div>

      <ProfileClient session={session} initialTasks={initialTasks || []} />
    </div>
  );
}
