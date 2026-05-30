"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitBranch,
  GitPullRequest,
  Plus,
  Users,
  CheckCircle,
  AlertCircle,
  Trash2,
  ExternalLink,
  Copy,
  PlusCircle,
  GitMerge,
  Check,
  RefreshCw,
  AlertTriangle,
  Loader2,
  BookOpen,
  X,
  Globe,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  createRepositoryAction,
  inviteCollaboratorAction,
  getBranchesAction,
  createBranchAction,
  createGithubIssueAction,
  getCollaboratorsAction,
  createPullRequestAction,
  mergePullRequestAction,
  getGithubOAuthUrlAction,
  disconnectPersonalGithubAction,
  getDevelopmentDashboardDataAction,
  getOrganizationMembersAction,
  inviteOrganizationMemberAction,
} from "@/app/actions/githubActions";

interface DevelopmentClientProps {
  isConfigured: boolean;
  orgName: string;
  isPersonalConnected: boolean;
  personalUsername: string;
  initialData: {
    linkedRepos: any[];
    unlinkedProjects: any[];
    activeTasks: any[];
  };
}

export function DevelopmentClient({
  isConfigured,
  orgName,
  isPersonalConnected,
  personalUsername,
  initialData,
}: DevelopmentClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Primary states
  const [data, setData] = useState(initialData);
  const [loadingFeed, setLoadingFeed] = useState(false);
  const [activeTab, setActiveTab] = useState<"repos" | "issues" | "prs" | "org">("repos");

  // Notifications
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Form states - Repository Creation
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [repoNameInput, setRepoNameInput] = useState("");
  const [repoDescInput, setRepoDescInput] = useState("");
  const [isCreatingRepo, setIsCreatingRepo] = useState(false);

  // Form states - Branch Creation
  const [branchRepoId, setBranchRepoId] = useState("");
  const [newBranchName, setNewBranchName] = useState("");
  const [baseBranch, setBaseBranch] = useState("main");
  const [isCreatingBranch, setIsCreatingBranch] = useState(false);

  // Form states - Issue / Ticket Creation
  const [issueRepoId, setIssueRepoId] = useState("");
  const [issueTitle, setIssueTitle] = useState("");
  const [issueBody, setIssueBody] = useState("");
  const [issueAssignee, setIssueAssignee] = useState("");
  const [isCreatingIssue, setIsCreatingIssue] = useState(false);
  const [repoCollaborators, setRepoCollaborators] = useState<any[]>([]);
  const [loadingCollabs, setLoadingCollabs] = useState(false);

  // Form states - PR Creation & Merging
  const [prRepoId, setPrRepoId] = useState("");
  const [prTitle, setPrTitle] = useState("");
  const [prHead, setPrHead] = useState("");
  const [prBase, setPrBase] = useState("main");
  const [prBody, setPrBody] = useState("");
  const [isCreatingPr, setIsCreatingPr] = useState(false);
  const [prBranches, setPrBranches] = useState<any[]>([]);
  const [loadingPrBranches, setLoadingPrBranches] = useState(false);

  const [mergeRepoId, setMergeRepoId] = useState("");
  const [mergePrNumber, setMergePrNumber] = useState("");
  const [isMergingPr, setIsMergingPr] = useState(false);

  // Custom collaborator invite
  const [inviteRepoId, setInviteRepoId] = useState("");
  const [inviteUsername, setInviteUsername] = useState("");
  const [invitePermission, setInvitePermission] = useState<"push" | "admin" | "pull">("push");
  const [isInviting, setIsInviting] = useState(false);

  // Selected Repository View
  const [selectedRepoId, setSelectedRepoId] = useState("");
  const [branches, setBranches] = useState<any[]>([]);
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [loadingRepoDetails, setLoadingRepoDetails] = useState(false);

  // Copied command CLI
  const [copiedTask, setCopiedTask] = useState<string | null>(null);

  // Organization Team Management States
  const [orgMembers, setOrgMembers] = useState<
    { login: string; avatarUrl: string; htmlUrl: string }[]
  >([]);
  const [loadingOrgMembers, setLoadingOrgMembers] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isInvitingOrg, setIsInvitingOrg] = useState(false);

  // Read search parameter notifications on mount
  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");
    if (success === "github-linked") {
      setNotification({
        type: "success",
        message: "Your personal GitHub developer profile has been securely paired!",
      });
      router.replace("/dashboard/development");
    } else if (error) {
      setNotification({
        type: "error",
        message: `GitHub authorization failed: ${decodeURIComponent(error)}`,
      });
      router.replace("/dashboard/development");
    }
  }, [searchParams]);

  // Load collaborators when selecting repository for issues
  useEffect(() => {
    if (issueRepoId) {
      const loadCollabs = async () => {
        setLoadingCollabs(true);
        try {
          const res = await getCollaboratorsAction(issueRepoId);
          if (res.success) {
            setRepoCollaborators(res.collaborators || []);
          } else {
            console.error("Failed to load collaborators:", res.error);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingCollabs(false);
        }
      };
      loadCollabs();
    } else {
      setRepoCollaborators([]);
    }
  }, [issueRepoId]);

  // Load branches when selecting repository for Pull Requests
  useEffect(() => {
    if (prRepoId) {
      const loadPrBranches = async () => {
        setLoadingPrBranches(true);
        try {
          const res = await getBranchesAction(prRepoId);
          if (res.success) {
            const list = res.branches || [];
            setPrBranches(list);
            
            // Auto-detect base branch (e.g. main/master)
            const mainBranch = list.find((b: any) => b.name === "main" || b.name === "master");
            if (mainBranch) {
              setPrBase(mainBranch.name);
            } else if (list.length > 0) {
              setPrBase(list[0].name);
            } else {
              setPrBase("main");
            }

            // Auto-detect a head branch that is different from base
            const otherBranch = list.find((b: any) => b.name !== "main" && b.name !== "master" && !b.protected);
            if (otherBranch) {
              setPrHead(otherBranch.name);
            } else if (list.length > 0) {
              const headCandidate = list.find((b: any) => b.name !== (mainBranch?.name || ""));
              setPrHead(headCandidate?.name || "");
            } else {
              setPrHead("");
            }
          } else {
            console.error("Failed to load PR branches:", res.error);
            setPrBranches([]);
          }
        } catch (err) {
          console.error(err);
          setPrBranches([]);
        } finally {
          setLoadingPrBranches(false);
        }
      };
      loadPrBranches();
    } else {
      setPrBranches([]);
    }
  }, [prRepoId]);

  // Load branches & collaborators when viewing repository details
  useEffect(() => {
    if (selectedRepoId) {
      setBranchRepoId(selectedRepoId);
      setBaseBranch("main");
      const loadDetails = async () => {
        setLoadingRepoDetails(true);
        try {
          const bRes = await getBranchesAction(selectedRepoId);
          const cRes = await getCollaboratorsAction(selectedRepoId);
          if (bRes.success) setBranches(bRes.branches || []);
          if (cRes.success) setCollaborators(cRes.collaborators || []);
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingRepoDetails(false);
        }
      };
      loadDetails();
    } else {
      setBranches([]);
      setCollaborators([]);
    }
  }, [selectedRepoId]);

  // Refresh dashboard data
  const refreshFeed = async () => {
    setLoadingFeed(true);
    try {
      const res = await getDevelopmentDashboardDataAction();
      if (res.success) {
        setData({
          linkedRepos: res.linkedRepos || [],
          unlinkedProjects: res.unlinkedProjects || [],
          activeTasks: res.activeTasks || [],
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingFeed(false);
    }
  };

  // Select project updates repo name format
  const handleSelectProject = (projId: string) => {
    setSelectedProjectId(projId);
    const proj = data.unlinkedProjects.find((p) => p.id === projId);
    if (proj) {
      const formattedName = proj.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setRepoNameInput(formattedName);
    } else {
      setRepoNameInput("");
    }
  };

  // Link personal GitHub account via OAuth
  const handleOAuthConnect = async () => {
    try {
      const res = await getGithubOAuthUrlAction(window.location.origin);
      if (res.success && res.url) {
        window.location.href = res.url;
      } else {
        setNotification({
          type: "error",
          message: res.error || "Failed to generate authorization URL.",
        });
      }
    } catch (err: any) {
      setNotification({ type: "error", message: err.message });
    }
  };

  // Disconnect personal OAuth link
  const handleDisconnectPersonal = async () => {
    if (!confirm("Are you sure you want to unlink your personal GitHub developer profile?")) {
      return;
    }
    try {
      const res = await disconnectPersonalGithubAction();
      if (res.success) {
        setNotification({
          type: "success",
          message: "Personal GitHub profile successfully unlinked.",
        });
        router.refresh();
      } else {
        setNotification({ type: "error", message: res.error || "Failed to unlink account." });
      }
    } catch (err: any) {
      setNotification({ type: "error", message: err.message });
    }
  };

  // Create repository under Organization
  const handleCreateRepo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || !repoNameInput.trim()) return;

    setIsCreatingRepo(true);
    setNotification(null);
    try {
      const res = await createRepositoryAction(
        selectedProjectId,
        repoNameInput.trim(),
        repoDescInput
      );
      if (res.success) {
        setNotification({
          type: "success",
          message: `Repository "${res.owner}/${res.repoName}" created successfully! Webhooks configured and team members invited.`,
        });
        setSelectedProjectId("");
        setRepoNameInput("");
        setRepoDescInput("");
        await refreshFeed();
      } else {
        setNotification({ type: "error", message: res.error || "Failed to create repository." });
      }
    } catch (err: any) {
      setNotification({ type: "error", message: err.message });
    } finally {
      setIsCreatingRepo(false);
    }
  };

  // Invite custom collaborator
  const handleInviteCollaborator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteRepoId || !inviteUsername.trim()) return;

    setIsInviting(true);
    setNotification(null);
    try {
      const res = await inviteCollaboratorAction(
        inviteRepoId,
        inviteUsername.trim(),
        invitePermission
      );
      if (res.success) {
        setNotification({
          type: "success",
          message: `Collaborator invitation sent to GitHub user "${inviteUsername}"!`,
        });
        setInviteUsername("");
        if (selectedRepoId === inviteRepoId) {
          const cRes = await getCollaboratorsAction(inviteRepoId);
          if (cRes.success) setCollaborators(cRes.collaborators || []);
        }
      } else {
        setNotification({ type: "error", message: res.error || "Failed to send invitation." });
      }
    } catch (err: any) {
      setNotification({ type: "error", message: err.message });
    } finally {
      setIsInviting(false);
    }
  };

  // Create customized branch
  const handleCreateBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!branchRepoId || !newBranchName.trim()) return;

    setIsCreatingBranch(true);
    setNotification(null);
    try {
      const res = await createBranchAction(branchRepoId, newBranchName.trim(), baseBranch);
      if (res.success) {
        setNotification({
          type: "success",
          message: `Branch "${res.branchName}" created successfully on GitHub!`,
        });
        setNewBranchName("");
        if (selectedRepoId === branchRepoId) {
          const bRes = await getBranchesAction(branchRepoId);
          if (bRes.success) setBranches(bRes.branches || []);
        }
      } else {
        setNotification({ type: "error", message: res.error || "Failed to create branch." });
      }
    } catch (err: any) {
      setNotification({ type: "error", message: err.message });
    } finally {
      setIsCreatingBranch(false);
    }
  };

  // Spin up branch dynamically next to task ticket
  const handleTaskSpinBranch = async (projectId: string, taskId: string, taskTitle: string) => {
    setNotification(null);
    const branchName = `feature/${taskId.toLowerCase()}-${taskTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .substring(0, 20)}`;

    try {
      const res = await createBranchAction(projectId, branchName, "main");
      if (res.success) {
        setNotification({
          type: "success",
          message: `Dynamic task branch "${branchName}" created on GitHub!`,
        });
        const cloneCmd = `git fetch origin && git checkout ${branchName}`;
        navigator.clipboard.writeText(cloneCmd);
        setCopiedTask(taskId);
        setTimeout(() => setCopiedTask(null), 3000);
      } else {
        setNotification({ type: "error", message: res.error || "Failed to create task branch." });
      }
    } catch (err: any) {
      setNotification({ type: "error", message: err.message });
    }
  };

  // Create GitHub Ticket Issue
  const handleCreateIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueRepoId || !issueTitle.trim()) return;

    setIsCreatingIssue(true);
    setNotification(null);
    try {
      const res = await createGithubIssueAction(
        issueRepoId,
        issueTitle.trim(),
        issueBody,
        issueAssignee || undefined
      );
      if (res.success) {
        setNotification({
          type: "success",
          message: `GitHub Issue #${res.number} created successfully! Link: ${res.url}`,
        });
        setIssueTitle("");
        setIssueBody("");
        setIssueAssignee("");
      } else {
        setNotification({ type: "error", message: res.error || "Failed to create issue." });
      }
    } catch (err: any) {
      setNotification({ type: "error", message: err.message });
    } finally {
      setIsCreatingIssue(false);
    }
  };

  // Create Pull Request
  const handleCreatePr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prRepoId || !prTitle.trim() || !prHead.trim()) return;

    setIsCreatingPr(true);
    setNotification(null);
    try {
      const res = await createPullRequestAction(
        prRepoId,
        prTitle.trim(),
        prHead.trim(),
        prBase,
        prBody
      );
      if (res.success) {
        setNotification({
          type: "success",
          message: `Pull Request #${res.number} opened successfully on GitHub! Link: ${res.url}`,
        });
        setPrTitle("");
        setPrHead("");
        setPrBody("");
      } else {
        setNotification({ type: "error", message: res.error || "Failed to create Pull Request." });
      }
    } catch (err: any) {
      setNotification({ type: "error", message: err.message });
    } finally {
      setIsCreatingPr(false);
    }
  };

  // Merge Pull Request
  const handleMergePr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mergeRepoId || !mergePrNumber) return;

    setIsMergingPr(true);
    setNotification(null);
    try {
      const res = await mergePullRequestAction(mergeRepoId, parseInt(mergePrNumber));
      if (res.success) {
        setNotification({
          type: "success",
          message: `Pull Request #${mergePrNumber} has been dynamically merged and closed on GitHub!`,
        });
        setMergePrNumber("");
      } else {
        setNotification({ type: "error", message: res.error || "Failed to merge Pull Request." });
      }
    } catch (err: any) {
      setNotification({ type: "error", message: err.message });
    } finally {
      setIsMergingPr(false);
    }
  };

  // Load organization members dynamically when "org" tab is active
  useEffect(() => {
    if (activeTab === "org") {
      const loadOrgMembers = async () => {
        setLoadingOrgMembers(true);
        setNotification(null);
        try {
          const res = await getOrganizationMembersAction();
          if (res.success && res.members) {
            setOrgMembers(res.members);
          } else {
            setNotification({
              type: "error",
              message: res.error || "Failed to load organization members.",
            });
          }
        } catch (err: any) {
          setNotification({ type: "error", message: err.message });
        } finally {
          setLoadingOrgMembers(false);
        }
      };
      loadOrgMembers();
    }
  }, [activeTab]);

  // Invite organization member by email
  const handleInviteOrgMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setIsInvitingOrg(true);
    setNotification(null);
    try {
      const res = await inviteOrganizationMemberAction(inviteEmail.trim());
      if (res.success) {
        setNotification({
          type: "success",
          message: `GitHub Organization invitation successfully sent to "${inviteEmail.trim()}"!`,
        });
        setInviteEmail("");
        // Reload list
        const mRes = await getOrganizationMembersAction();
        if (mRes.success && mRes.members) setOrgMembers(mRes.members);
      } else {
        setNotification({ type: "error", message: res.error || "Failed to send invitation." });
      }
    } catch (err: any) {
      setNotification({ type: "error", message: err.message });
    } finally {
      setIsInvitingOrg(false);
    }
  };

  if (!isConfigured) {
    return (
      <div className="bg-white border border-border rounded-2xl p-12 text-center max-w-2xl mx-auto space-y-6 shadow-md backdrop-blur-md bg-white/70">
        <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-800 border border-border">
          <GitBranch className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-text-primary">GitHub App Suite Not Configured</h3>
        <p className="text-sm text-text-secondary leading-relaxed">
          The global GitHub Application setup is missing. To enable developers to create
          repositories, sync branches, track tickets, and link collaborative codebases, please ask
          an administrator to set up the App integration card.
        </p>
        <button
          onClick={() => router.push("/dashboard/settings?tab=integrations")}
          className="px-6 h-12 bg-slate-900 text-white font-bold rounded-xl text-[12px] uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer inline-flex items-center gap-2"
        >
          Go to Integrations Tab →
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dynamic Notifications Banner */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              "flex items-center gap-3 px-6 py-4 rounded-xl text-[13px] font-bold border shadow-sm leading-relaxed",
              notification.type === "success"
                ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                : "bg-danger/10 border-danger/25 text-danger"
            )}
          >
            {notification.type === "success" ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span className="flex-1">{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="p-1 rounded-lg hover:bg-black/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid: Developer Profile Pair & Repository Maker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Repository Management Hub */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Action Tabs */}
          <div className="bg-white border border-border rounded-2xl p-4 flex gap-2 shadow-sm">
            <button
              onClick={() => setActiveTab("repos")}
              className={cn(
                "flex-1 py-3 px-4 rounded-xl text-[12px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2",
                activeTab === "repos"
                  ? "bg-slate-900 text-white shadow-md shadow-slate-950/20"
                  : "bg-page-bg text-text-secondary hover:text-text-primary"
              )}
            >
              <GitBranch className="w-4 h-4" />
              Repositories & Collabs
            </button>
            <button
              onClick={() => setActiveTab("issues")}
              className={cn(
                "flex-1 py-3 px-4 rounded-xl text-[12px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2",
                activeTab === "issues"
                  ? "bg-slate-900 text-white shadow-md shadow-slate-950/20"
                  : "bg-page-bg text-text-secondary hover:text-text-primary"
              )}
            >
              <Users className="w-4 h-4" />
              Collaborator Tickets
            </button>
            <button
              onClick={() => setActiveTab("prs")}
              className={cn(
                "flex-1 py-3 px-4 rounded-xl text-[12px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2",
                activeTab === "prs"
                  ? "bg-slate-900 text-white shadow-md shadow-slate-950/20"
                  : "bg-page-bg text-text-secondary hover:text-text-primary"
              )}
            >
              <GitPullRequest className="w-4 h-4" />
              Dynamic PR Merges
            </button>
            <button
              onClick={() => setActiveTab("org")}
              className={cn(
                "flex-1 py-3 px-4 rounded-xl text-[12px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2",
                activeTab === "org"
                  ? "bg-slate-900 text-white shadow-md shadow-slate-950/20"
                  : "bg-page-bg text-text-secondary hover:text-text-primary"
              )}
            >
              <Globe className="w-4 h-4" />
              Organization Team
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "repos" && (
              <motion.div
                key="repos"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Repo Provisioner */}
                {data.unlinkedProjects.length > 0 && (
                  <div className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-4">
                    <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                      <Plus className="w-5 h-5 text-accent animate-pulse" />
                      Provision Project Repository
                    </h3>
                    <p className="text-[12px] text-text-secondary leading-relaxed">
                      Initialize a private, tenant-isolated repository under your target
                      organization. We will automatically configure task timelines and push
                      webhooks.
                    </p>

                    <form
                      onSubmit={handleCreateRepo}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                          Select ERP Project
                        </label>
                        <select
                          required
                          value={selectedProjectId}
                          onChange={(e) => handleSelectProject(e.target.value)}
                          className="w-full bg-page-bg border border-border rounded-xl px-4 h-11 text-[13px] text-text-primary outline-none cursor-pointer"
                        >
                          <option value="">-- Choose Project --</option>
                          {data.unlinkedProjects.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                          Repository Name
                        </label>
                        <input
                          type="text"
                          required
                          value={repoNameInput}
                          onChange={(e) => setRepoNameInput(e.target.value)}
                          placeholder="e.g. core-auth-service"
                          className="w-full h-11 px-4 border border-border bg-page-bg rounded-xl text-[13px] text-text-primary outline-none"
                        />
                      </div>

                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                          Description
                        </label>
                        <input
                          type="text"
                          value={repoDescInput}
                          onChange={(e) => setRepoDescInput(e.target.value)}
                          placeholder="Provide a repository description"
                          className="w-full h-11 px-4 border border-border bg-page-bg rounded-xl text-[13px] text-text-primary outline-none"
                        />
                      </div>

                      <div className="md:col-span-2 pt-2">
                        <button
                          type="submit"
                          disabled={isCreatingRepo || !selectedProjectId}
                          className="w-full flex items-center justify-center gap-2 h-12 bg-slate-900 text-white font-bold rounded-xl text-[12px] uppercase tracking-widest shadow-lg shadow-slate-950/20 hover:scale-[1.01] transition-all disabled:opacity-50 cursor-pointer"
                        >
                          {isCreatingRepo ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" /> Creating Repository...
                            </>
                          ) : (
                            <>
                              <PlusCircle className="w-4 h-4" /> Spin Up Project Repository
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Linked Repos Catalog */}
                <div className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-divider">
                    <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-accent" />
                      Active Project Repositories ({data.linkedRepos.length})
                    </h3>
                    <button
                      onClick={refreshFeed}
                      disabled={loadingFeed}
                      className="p-2 rounded-lg bg-page-bg hover:bg-border transition-colors cursor-pointer border-0"
                    >
                      <RefreshCw
                        className={cn("w-4 h-4 text-text-secondary", loadingFeed && "animate-spin")}
                      />
                    </button>
                  </div>

                  {data.linkedRepos.length === 0 ? (
                    <div className="py-12 text-center text-text-muted text-[13px]">
                      No repositories linked yet. Choose an ERP project above to start coding!
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {data.linkedRepos.map((repo) => (
                        <div
                          key={repo.id}
                          className={cn(
                            "p-5 rounded-2xl border transition-all cursor-pointer space-y-4",
                            selectedRepoId === repo.projectId
                              ? "bg-slate-50 border-accent shadow-sm"
                              : "bg-white border-border hover:border-accent/40"
                          )}
                          onClick={() => setSelectedRepoId(repo.projectId)}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-bold text-[15px] text-text-primary flex items-center gap-1.5">
                                {repo.projectName}
                                <span className="px-2 py-0.5 bg-slate-100 border border-border text-[9px] font-black uppercase tracking-wider rounded-md text-text-secondary">
                                  {repo.repoOwner}/{repo.repoName}
                                </span>
                              </h4>
                              <p className="text-[11px] text-text-secondary mt-1">
                                Linked on {new Date(repo.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <a
                              href={`https://github.com/${repo.repoOwner}/${repo.repoName}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 bg-white hover:bg-slate-100 border border-divider rounded-lg transition-colors text-text-muted hover:text-text-primary"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>

                          {/* Expanded detail section inside list item */}
                          {selectedRepoId === repo.projectId && (
                            <div
                              className="pt-4 border-t border-divider grid grid-cols-1 md:grid-cols-2 gap-6"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {/* Branches column */}
                              <div className="space-y-3">
                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-1">
                                  <GitBranch className="w-3.5 h-3.5 text-accent" />
                                  Branches ({loadingRepoDetails ? "..." : branches.length})
                                </p>
                                {loadingRepoDetails ? (
                                  <div className="flex items-center gap-2 text-[12px] text-text-muted">
                                    <Loader2 className="w-4 h-4 animate-spin text-accent" /> Loading
                                    branches...
                                  </div>
                                ) : branches.length === 0 ? (
                                  <p className="text-[12px] text-text-muted">No branches found.</p>
                                ) : (
                                  <div className="max-h-36 overflow-y-auto space-y-1.5 pr-2">
                                    {branches.map((b) => (
                                      <div
                                        key={b.name}
                                        className="flex items-center justify-between px-3 py-1.5 bg-white border border-border rounded-xl text-[12px] font-mono text-slate-800"
                                      >
                                        <span>{b.name}</span>
                                        {b.protected && (
                                          <span className="px-1.5 py-0.5 bg-amber-50 border border-amber-100 text-[8px] font-black uppercase tracking-widest text-amber-600 rounded">
                                            PROTECTED
                                          </span>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Quick branch creator */}
                                <form
                                  onSubmit={handleCreateBranch}
                                  className="pt-3 border-t border-divider/60 space-y-3"
                                >
                                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-0.5">
                                    Create New Branch
                                  </p>

                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                      <label className="text-[9px] font-bold text-text-muted uppercase tracking-widest px-0.5">
                                        Base Branch
                                      </label>
                                      <select
                                        value={
                                          branchRepoId === repo.projectId ? baseBranch : "main"
                                        }
                                        onChange={(e) => {
                                          setBranchRepoId(repo.projectId);
                                          setBaseBranch(e.target.value);
                                        }}
                                        className="w-full h-9 px-2 border border-border rounded-xl text-[11px] bg-white outline-none cursor-pointer text-slate-800 font-semibold"
                                      >
                                        {branches.length === 0 ? (
                                          <option value="main">main</option>
                                        ) : (
                                          branches.map((b) => (
                                            <option key={b.name} value={b.name}>
                                              {b.name} {b.protected ? "🔒" : ""}
                                            </option>
                                          ))
                                        )}
                                      </select>
                                    </div>

                                    <div className="space-y-1">
                                      <label className="text-[9px] font-bold text-text-muted uppercase tracking-widest px-0.5">
                                        Branch Name
                                      </label>
                                      <input
                                        type="text"
                                        required
                                        value={branchRepoId === repo.projectId ? newBranchName : ""}
                                        onChange={(e) => {
                                          setBranchRepoId(repo.projectId);
                                          setNewBranchName(e.target.value);
                                        }}
                                        placeholder="e.g. feature/auth"
                                        className="w-full h-9 px-3 border border-border rounded-xl text-[11px] outline-none text-slate-800 font-semibold"
                                      />
                                    </div>
                                  </div>

                                  <button
                                    type="submit"
                                    disabled={
                                      isCreatingBranch ||
                                      !newBranchName.trim() ||
                                      branchRepoId !== repo.projectId
                                    }
                                    className="w-full h-9 bg-slate-900 text-white font-bold text-[10px] uppercase tracking-widest rounded-xl hover:scale-[1.01] transition-all disabled:opacity-50 cursor-pointer"
                                  >
                                    {isCreatingBranch && branchRepoId === repo.projectId
                                      ? "Creating..."
                                      : "Create Branch"}
                                  </button>
                                </form>
                              </div>

                              {/* Collaborators column */}
                              <div className="space-y-3">
                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-1">
                                  <Users className="w-3.5 h-3.5 text-accent" />
                                  Paired Developers (
                                  {loadingRepoDetails ? "..." : collaborators.length})
                                </p>
                                {loadingRepoDetails ? (
                                  <div className="flex items-center gap-2 text-[12px] text-text-muted">
                                    <Loader2 className="w-4 h-4 animate-spin text-accent" /> Loading
                                    collaborators...
                                  </div>
                                ) : collaborators.length === 0 ? (
                                  <p className="text-[12px] text-text-muted">
                                    No collaborators linked.
                                  </p>
                                ) : (
                                  <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-2">
                                    {collaborators.map((c) => (
                                      <div
                                        key={c.login}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-border rounded-xl text-[12px] font-bold text-text-primary"
                                      >
                                        {c.avatarUrl && (
                                          <img
                                            src={c.avatarUrl}
                                            alt={c.login}
                                            className="w-4 h-4 rounded-full border border-divider"
                                          />
                                        )}
                                        <span>{c.login}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Quick invite form */}
                                <form
                                  onSubmit={handleInviteCollaborator}
                                  className="pt-2 space-y-2"
                                >
                                  <input
                                    type="text"
                                    required
                                    value={inviteRepoId === repo.projectId ? inviteUsername : ""}
                                    onChange={(e) => {
                                      setInviteRepoId(repo.projectId);
                                      setInviteUsername(e.target.value);
                                    }}
                                    placeholder="GitHub username..."
                                    className="w-full h-9 px-3 border border-border rounded-xl text-[12px] outline-none"
                                  />
                                  <button
                                    type="submit"
                                    disabled={isInviting || inviteRepoId !== repo.projectId}
                                    className="w-full h-9 bg-slate-900 text-white font-bold text-[10px] uppercase tracking-widest rounded-xl hover:scale-[1.01] transition-all disabled:opacity-50 cursor-pointer"
                                  >
                                    {isInviting && inviteRepoId === repo.projectId
                                      ? "Inviting..."
                                      : "Invite Collaborator"}
                                  </button>
                                </form>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "issues" && (
              <motion.div
                key="issues"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-6"
              >
                <div>
                  <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                    <Users className="w-5 h-5 text-accent" />
                    Collaborator Issue Tracker
                  </h3>
                  <p className="text-[12px] text-text-secondary leading-relaxed mt-1">
                    Directly spawn issues and coding tasks on GitHub, with the ability to assign
                    active, paired developers collaborating on the project repository.
                  </p>
                </div>

                {data.linkedRepos.length === 0 ? (
                  <div className="py-12 text-center text-text-muted text-[13px]">
                    Configure and spin up a project repository first to track issues.
                  </div>
                ) : (
                  <form onSubmit={handleCreateIssue} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                          Target Project
                        </label>
                        <select
                          required
                          value={issueRepoId}
                          onChange={(e) => setIssueRepoId(e.target.value)}
                          className="w-full bg-page-bg border border-border rounded-xl px-4 h-11 text-[13px] text-text-primary outline-none cursor-pointer"
                        >
                          <option value="">-- Select Project --</option>
                          {data.linkedRepos.map((r) => (
                            <option key={r.id} value={r.projectId}>
                              {r.projectName}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center justify-between">
                          <span>Assign Developer (Collaborator)</span>
                          {loadingCollabs && (
                            <span className="text-[9px] text-accent animate-pulse font-normal flex items-center gap-1">
                              <Loader2 className="w-2.5 h-2.5 animate-spin" /> Loading collabs...
                            </span>
                          )}
                        </label>
                        <select
                          value={issueAssignee}
                          onChange={(e) => setIssueAssignee(e.target.value)}
                          disabled={!issueRepoId || loadingCollabs}
                          className="w-full bg-page-bg border border-border rounded-xl px-4 h-11 text-[13px] text-text-primary outline-none cursor-pointer disabled:opacity-50"
                        >
                          <option value="">-- Assign Developer (Optional) --</option>
                          {repoCollaborators.map((c) => (
                            <option key={c.login} value={c.login}>
                              {c.login}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                        Issue Title
                      </label>
                      <input
                        type="text"
                        required
                        value={issueTitle}
                        onChange={(e) => setIssueTitle(e.target.value)}
                        placeholder="e.g. Fix secure JWT decoding verification"
                        className="w-full h-11 px-4 border border-border bg-page-bg rounded-xl text-[13px] text-text-primary outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                        Task Details / Description
                      </label>
                      <textarea
                        value={issueBody}
                        onChange={(e) => setIssueBody(e.target.value)}
                        placeholder="Provide detailed reproducibility instructions or requirements..."
                        rows={4}
                        className="w-full p-4 border border-border bg-page-bg rounded-xl text-[13px] text-text-primary outline-none resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isCreatingIssue || !issueRepoId || !issueTitle.trim()}
                      className="w-full flex items-center justify-center gap-2 h-12 bg-slate-900 text-white font-bold rounded-xl text-[12px] uppercase tracking-widest shadow-lg shadow-slate-950/20 hover:scale-[1.01] transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {isCreatingIssue ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Creating Issue...
                        </>
                      ) : (
                        <>
                          <PlusCircle className="w-4 h-4" /> Spawn GitHub Ticket Issue
                        </>
                      )}
                    </button>
                  </form>
                )}
              </motion.div>
            )}

            {activeTab === "prs" && (
              <motion.div
                key="prs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {/* PR Creator */}
                <div className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                      <GitPullRequest className="w-5 h-5 text-accent" />
                      Open Pull Request
                    </h3>
                    <p className="text-[11px] text-text-secondary leading-relaxed mt-0.5">
                      Propose merging coding updates across task branches.
                    </p>
                  </div>

                  <form onSubmit={handleCreatePr} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                        Project Repository
                      </label>
                      <select
                        required
                        value={prRepoId}
                        onChange={(e) => setPrRepoId(e.target.value)}
                        className="w-full bg-page-bg border border-border rounded-xl px-4 h-11 text-[13px] text-text-primary outline-none cursor-pointer"
                      >
                        <option value="">-- Select Repo --</option>
                        {data.linkedRepos.map((r) => (
                          <option key={r.id} value={r.projectId}>
                            {r.projectName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                          Head (Source Branch)
                        </label>
                        {loadingPrBranches ? (
                          <div className="w-full h-11 border border-border bg-page-bg rounded-xl flex items-center px-4 gap-2 text-[13px] text-text-muted">
                            <Loader2 className="w-4 h-4 animate-spin text-accent" /> Loading...
                          </div>
                        ) : !prRepoId ? (
                          <select
                            disabled
                            className="w-full bg-page-bg border border-border rounded-xl px-4 h-11 text-[13px] text-text-muted outline-none opacity-60 cursor-not-allowed"
                          >
                            <option>Select Repository First</option>
                          </select>
                        ) : prBranches.length === 0 ? (
                          <input
                            type="text"
                            required
                            value={prHead}
                            onChange={(e) => setPrHead(e.target.value)}
                            placeholder="e.g. dev"
                            className="w-full h-11 px-4 border border-border bg-page-bg rounded-xl text-[13px] text-text-primary outline-none"
                          />
                        ) : (
                          <select
                            required
                            value={prHead}
                            onChange={(e) => setPrHead(e.target.value)}
                            className="w-full bg-page-bg border border-border rounded-xl px-4 h-11 text-[13px] text-text-primary outline-none cursor-pointer font-semibold text-slate-800"
                          >
                            <option value="">-- Select Source --</option>
                            {prBranches.map((b) => (
                              <option key={b.name} value={b.name}>
                                {b.name}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                          Base (Target Branch)
                        </label>
                        {loadingPrBranches ? (
                          <div className="w-full h-11 border border-border bg-page-bg rounded-xl flex items-center px-4 gap-2 text-[13px] text-text-muted">
                            <Loader2 className="w-4 h-4 animate-spin text-accent" /> Loading...
                          </div>
                        ) : !prRepoId ? (
                          <select
                            disabled
                            className="w-full bg-page-bg border border-border rounded-xl px-4 h-11 text-[13px] text-text-muted outline-none opacity-60 cursor-not-allowed"
                          >
                            <option>Select Repository First</option>
                          </select>
                        ) : prBranches.length === 0 ? (
                          <input
                            type="text"
                            required
                            value={prBase}
                            onChange={(e) => setPrBase(e.target.value)}
                            placeholder="main"
                            className="w-full h-11 px-4 border border-border bg-page-bg rounded-xl text-[13px] text-text-primary outline-none"
                          />
                        ) : (
                          <select
                            required
                            value={prBase}
                            onChange={(e) => setPrBase(e.target.value)}
                            className="w-full bg-page-bg border border-border rounded-xl px-4 h-11 text-[13px] text-text-primary outline-none cursor-pointer font-semibold text-slate-800"
                          >
                            {prBranches.map((b) => (
                              <option key={b.name} value={b.name}>
                                {b.name} {b.protected ? "🔒" : ""}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                        PR Title
                      </label>
                      <input
                        type="text"
                        required
                        value={prTitle}
                        onChange={(e) => setPrTitle(e.target.value)}
                        placeholder="e.g. Added secure OAuth pairing endpoints"
                        className="w-full h-11 px-4 border border-border bg-page-bg rounded-xl text-[13px] text-text-primary outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                        Description / Body
                      </label>
                      <textarea
                        value={prBody}
                        onChange={(e) => setPrBody(e.target.value)}
                        placeholder="Provide descriptions of the modifications..."
                        rows={3}
                        className="w-full p-4 border border-border bg-page-bg rounded-xl text-[13px] text-text-primary outline-none resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isCreatingPr || !prRepoId || !prTitle.trim() || !prHead.trim()}
                      className="w-full flex items-center justify-center gap-2 h-11 bg-slate-900 text-white font-bold rounded-xl text-[11px] uppercase tracking-widest shadow-lg shadow-slate-950/20 hover:scale-[1.01] transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {isCreatingPr ? "Opening PR..." : "Open Pull Request"}
                    </button>
                  </form>
                </div>

                {/* PR Merger */}
                <div className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                        <GitMerge className="w-5 h-5 text-emerald-600 animate-pulse" />
                        Merge Pull Request
                      </h3>
                      <p className="text-[11px] text-text-secondary leading-relaxed mt-0.5">
                        Instantly deploy code changes dynamically. This triggers global webhooks to
                        update client task feeds in real-time.
                      </p>
                    </div>

                    <form onSubmit={handleMergePr} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                          Project Repository
                        </label>
                        <select
                          required
                          value={mergeRepoId}
                          onChange={(e) => setMergeRepoId(e.target.value)}
                          className="w-full bg-page-bg border border-border rounded-xl px-4 h-11 text-[13px] text-text-primary outline-none cursor-pointer"
                        >
                          <option value="">-- Select Repo --</option>
                          {data.linkedRepos.map((r) => (
                            <option key={r.id} value={r.projectId}>
                              {r.projectName}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                          Pull Request Number
                        </label>
                        <input
                          type="number"
                          required
                          value={mergePrNumber}
                          onChange={(e) => setMergePrNumber(e.target.value)}
                          placeholder="e.g. 1"
                          className="w-full h-11 px-4 border border-border bg-page-bg rounded-xl text-[13px] text-text-primary outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isMergingPr || !mergeRepoId || !mergePrNumber}
                        className="w-full flex items-center justify-center gap-2 h-11 bg-emerald-600 text-white font-bold rounded-xl text-[11px] uppercase tracking-widest shadow-lg shadow-emerald-600/20 hover:scale-[1.01] hover:bg-emerald-700 transition-all disabled:opacity-50 cursor-pointer"
                      >
                        {isMergingPr ? "Merging..." : "Merge Pull Request"}
                      </button>
                    </form>
                  </div>

                  <div className="bg-slate-50 border border-border p-4 rounded-xl text-[11px] text-text-muted leading-relaxed flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Warning:</strong> Merges are immediate and permanent. Make sure CI
                      checks are passing before confirming deployment.
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "org" && (
              <motion.div
                key="org"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {/* Organization Members List */}
                <div className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                      <Users className="w-5 h-5 text-accent" />
                      GitHub Org Members ({orgName})
                    </h3>
                    <p className="text-[11px] text-text-secondary leading-relaxed mt-0.5">
                      Live developers currently paired to your GitHub Organization.
                    </p>
                  </div>

                  {loadingOrgMembers ? (
                    <div className="flex items-center gap-2 text-[12px] text-text-muted py-8 justify-center">
                      <Loader2 className="w-5 h-5 animate-spin text-accent" /> Loading organization
                      team...
                    </div>
                  ) : orgMembers.length === 0 ? (
                    <div className="text-center py-8 text-text-muted text-[12px]">
                      No active members found for organization <strong>{orgName}</strong>.
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
                      {orgMembers.map((m) => (
                        <div
                          key={m.login}
                          className="flex items-center justify-between p-3.5 bg-[#F8FAFC] border border-border hover:border-slate-300 hover:bg-white rounded-xl transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            {m.avatarUrl ? (
                              <img
                                src={m.avatarUrl}
                                className="w-8 h-8 rounded-full border border-border"
                                alt=""
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[12px] font-bold text-slate-500 border border-border">
                                {m.login.substring(0, 2).toUpperCase()}
                              </div>
                            )}
                            <span className="font-bold text-[13px] text-text-primary group-hover:text-accent transition-colors font-mono">
                              {m.login}
                            </span>
                          </div>

                          <a
                            href={m.htmlUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1 bg-white border border-border hover:border-slate-400 text-[#64748B] hover:text-[#475569] font-bold text-[10px] rounded-lg transition-all"
                          >
                            Profile
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Organization Member Invites */}
                <div className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                        <Mail className="w-5 h-5 text-accent animate-pulse" />
                        Invite Organization Member
                      </h3>
                      <p className="text-[11px] text-text-secondary leading-relaxed mt-0.5">
                        Send email invitations to developers to join the <strong>{orgName}</strong>{" "}
                        organization.
                      </p>
                    </div>

                    <form onSubmit={handleInviteOrgMember} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-0.5">
                          Invitee Email Address
                        </label>
                        <input
                          type="email"
                          required
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          placeholder="developer@company.com"
                          className="w-full h-11 px-4 border border-border bg-page-bg rounded-xl text-[13px] text-text-primary outline-none focus:border-slate-400 transition-colors font-semibold"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isInvitingOrg || !inviteEmail.trim()}
                        className="w-full flex items-center justify-center gap-2 h-11 bg-slate-900 text-white font-bold rounded-xl text-[11px] uppercase tracking-widest shadow-lg shadow-slate-950/20 hover:scale-[1.01] transition-all disabled:opacity-50 cursor-pointer border-0"
                      >
                        {isInvitingOrg ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Inviting Developer...
                          </>
                        ) : (
                          "Send Invite Link"
                        )}
                      </button>
                    </form>
                  </div>

                  <div className="bg-slate-50 border border-border p-4 rounded-xl text-[11px] text-text-muted leading-relaxed flex items-start gap-2.5 mt-4">
                    <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Notice:</strong> Invited members will receive an email invitation
                      containing a confirmation link. Once accepted, they will instantly appear in
                      the active members list and gain team workspace privileges.
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Profile OAuth and Task Branching */}
        <div className="space-y-6">
          {/* Personal Developer Profile OAuth Link Card */}
          <div className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-accent animate-pulse" />
              Personal Developer Link
            </h3>
            <p className="text-[12px] text-text-secondary leading-relaxed">
              Every employee must pair their individual GitHub developer account so repository
              actions and issues created in ERP are mapped to their GitHub handle.
            </p>

            {isPersonalConnected ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="font-extrabold text-[12px] uppercase tracking-wide">
                      PAIRED ACCOUNT
                    </p>
                    <p className="text-[13px] font-bold mt-0.5">@{personalUsername}</p>
                  </div>
                </div>
                <button
                  onClick={handleDisconnectPersonal}
                  className="w-full flex items-center justify-center gap-2 h-10 border border-danger/25 text-danger/80 hover:text-white hover:bg-danger hover:border-transparent font-bold rounded-xl text-[11px] uppercase tracking-widest transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Unlink Profile
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 p-4 rounded-xl bg-amber-50 border border-amber-100 text-amber-700 text-[11px] font-medium leading-relaxed">
                  <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>
                    Your GitHub profile is not paired. Actions will be logged using the global App
                    installation token instead.
                  </span>
                </div>
                <button
                  onClick={handleOAuthConnect}
                  className="w-full flex items-center justify-center gap-2 h-11 bg-slate-900 text-white font-bold rounded-xl text-[11px] uppercase tracking-widest shadow-md shadow-slate-950/20 hover:scale-[1.01] transition-all cursor-pointer"
                >
                  Pair GitHub Profile
                </button>
              </div>
            )}
          </div>

          {/* Task Branching Center */}
          <div className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-accent" />
              One-Click Branching Center
            </h3>
            <p className="text-[12px] text-text-secondary leading-relaxed">
              Instantly spin up code branches on GitHub directly next to active task tickets
              assigned to your project team.
            </p>

            {data.activeTasks.length === 0 ? (
              <div className="py-8 text-center text-text-muted text-[12px]">
                No active tasks linked to repository projects.
              </div>
            ) : (
              <div className="space-y-3">
                {data.activeTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 rounded-xl border border-divider hover:border-accent/40 bg-page-bg space-y-3"
                  >
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                        {task.projectName}
                      </p>
                      <h4 className="font-extrabold text-[13px] text-text-primary mt-1 line-clamp-1">
                        {task.title}
                      </h4>
                      <p className="text-[10px] text-text-secondary mt-0.5 font-mono">
                        {task.id} • State: {task.status}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleTaskSpinBranch(task.projectId, task.id, task.title)}
                        className="flex-1 flex items-center justify-center gap-1.5 h-9 bg-slate-900 text-white font-bold text-[9px] uppercase tracking-widest rounded-lg hover:scale-[1.01] transition-all cursor-pointer"
                      >
                        <GitBranch className="w-3.5 h-3.5" />
                        Spin Branch
                      </button>

                      {copiedTask === task.id ? (
                        <button className="px-3 h-9 bg-emerald-50 border border-emerald-100 text-emerald-600 font-bold text-[9px] uppercase tracking-widest rounded-lg flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Copied
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            const branchName = `feature/${task.id.toLowerCase()}-${task.title
                              .toLowerCase()
                              .replace(/[^a-z0-9]+/g, "-")
                              .substring(0, 20)}`;
                            navigator.clipboard.writeText(
                              `git fetch origin && git checkout ${branchName}`
                            );
                            setCopiedTask(task.id);
                            setTimeout(() => setCopiedTask(null), 3000);
                          }}
                          className="px-3 h-9 border border-divider hover:border-text-secondary bg-white text-text-secondary rounded-lg transition-colors cursor-pointer"
                          title="Copy Git checkout CLI"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
