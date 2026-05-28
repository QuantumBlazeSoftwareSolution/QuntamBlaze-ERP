import { DevelopmentClient } from "@/components/dashboard/development/DevelopmentClient";
import {
  getGithubStatusAction,
  getPersonalGithubStatusAction,
  getDevelopmentDashboardDataAction,
} from "@/app/actions/githubActions";
import { Suspense } from "react";
import { RefreshCw } from "lucide-react";

export default async function DevelopmentDashboardPage() {
  const statusRes = await getGithubStatusAction();
  const personalStatusRes = await getPersonalGithubStatusAction();
  const dataRes = await getDevelopmentDashboardDataAction();

  const isConfigured = statusRes.success && statusRes.isConfigured;
  const orgName = statusRes.success && statusRes.isConfigured ? statusRes.orgName : "";
  const isPersonalConnected = personalStatusRes.success && personalStatusRes.isConnected;
  const personalUsername = personalStatusRes.success && personalStatusRes.isConnected ? personalStatusRes.githubUsername : "";

  const initialData = dataRes.success
    ? {
        linkedRepos: dataRes.linkedRepos || [],
        unlinkedProjects: dataRes.unlinkedProjects || [],
        activeTasks: dataRes.activeTasks || [],
      }
    : {
        linkedRepos: [],
        unlinkedProjects: [],
        activeTasks: [],
      };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Development Suite</h1>
          <p className="text-[13px] text-text-secondary mt-1">
            Orchestrate GitHub repositories, task branches, collaborators, and issues in one unified command center.
          </p>
        </div>
      </div>

      <Suspense fallback={
        <div className="flex items-center justify-center p-12 bg-white border border-border rounded-2xl">
          <div className="flex items-center gap-3 text-text-muted text-[13px]">
            <RefreshCw className="w-4 h-4 animate-spin text-accent" />
            Loading Development Workspace...
          </div>
        </div>
      }>
        <DevelopmentClient
          isConfigured={isConfigured || false}
          orgName={orgName || ""}
          isPersonalConnected={isPersonalConnected || false}
          personalUsername={personalUsername || ""}
          initialData={initialData}
        />
      </Suspense>
    </div>
  );
}
