"use server";

import { db } from "@/lib/db";
import { systemConfig } from "@/lib/db/schema";
import { userGithubAccounts, projectRepositories } from "@/lib/db/schema/github";
import { projects, employees, tasks } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { getCurrentSessionAction } from "./auth";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";
import { encrypt, decrypt } from "@/lib/crypto";

// ─── PURE NODE.JS RS256 JWT HELPER FOR GITHUB APPS ───────────────────────────

function signJwt(payload: any, privateKeyPem: string): string {
  const header = { alg: "RS256", typ: "JWT" };
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString("base64url");
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");

  const stringToSign = `${encodedHeader}.${encodedPayload}`;
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(stringToSign);
  const signature = signer.sign(privateKeyPem, "base64url");

  return `${stringToSign}.${signature}`;
}

// ─── TENANT-LEVEL CONFIG ACTIONS (SYSTEM SETTINGS) ──────────────────────────

export async function saveGithubConfigAction(
  appId: string,
  clientId: string,
  clientSecret: string,
  privateKey: string,
  orgName: string
) {
  try {
    const session = await getCurrentSessionAction();
    if (!session?.userId) return { success: false, error: "Unauthorized." };

    const payload = {
      appId,
      clientId,
      clientSecretEncrypted: encrypt(clientSecret),
      privateKeyEncrypted: encrypt(privateKey),
      orgName,
    };

    await db
      .insert(systemConfig)
      .values({
        key: "github_config",
        value: payload,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: systemConfig.key,
        set: {
          value: payload,
          updatedAt: new Date(),
        },
      });

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard/development");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getGithubStatusAction() {
  try {
    const record = await db
      .select()
      .from(systemConfig)
      .where(eq(systemConfig.key, "github_config"))
      .limit(1);

    if (!record || record.length === 0 || !record[0].value) {
      return { success: true, isConfigured: false };
    }

    const cfg = record[0].value as any;
    return {
      success: true,
      isConfigured: true,
      appId: cfg.appId,
      clientId: cfg.clientId,
      orgName: cfg.orgName,
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function disconnectGithubAction() {
  try {
    const session = await getCurrentSessionAction();
    if (!session?.userId) return { success: false, error: "Unauthorized." };

    await db.delete(systemConfig).where(eq(systemConfig.key, "github_config"));

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard/development");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ─── USER-LEVEL PERSONAL GITHUB OAUTH ACTIONS ────────────────────────────────

export async function getGithubOAuthUrlAction(origin: string) {
  try {
    const record = await db
      .select()
      .from(systemConfig)
      .where(eq(systemConfig.key, "github_config"))
      .limit(1);

    if (!record || record.length === 0 || !record[0].value) {
      return { success: false, error: "GitHub integration is not configured by Administrator." };
    }

    const cfg = record[0].value as any;
    const scopes = "read:user repo";
    const redirectUri = `${origin}/api/auth/github/callback`;
    const oauthUrl = `https://github.com/login/oauth/authorize?client_id=${cfg.clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&state=qb-state`;

    return { success: true, url: oauthUrl };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getPersonalGithubStatusAction() {
  try {
    const session = await getCurrentSessionAction();
    if (!session?.userId) return { success: true, isConnected: false };

    const records = await db
      .select()
      .from(userGithubAccounts)
      .where(eq(userGithubAccounts.userId, session.userId))
      .limit(1);

    if (records.length === 0) {
      return { success: true, isConnected: false };
    }

    return {
      success: true,
      isConnected: true,
      githubUsername: records[0].githubUsername,
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function disconnectPersonalGithubAction() {
  try {
    const session = await getCurrentSessionAction();
    if (!session?.userId) return { success: false, error: "Unauthorized." };

    await db.delete(userGithubAccounts).where(eq(userGithubAccounts.userId, session.userId));

    revalidatePath("/dashboard/development");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ─── INTERNAL GITHUB TOKEN HELPERS ───────────────────────────────────────────

async function getGithubAppInstallationToken(cfg: any): Promise<string> {
  const privateKey = decrypt(cfg.privateKeyEncrypted);
  if (!privateKey) throw new Error("Could not decrypt GitHub App Private Key.");

  // Generate JWT for GitHub App (expires in 10 minutes)
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iat: now - 60,
    exp: now + 540,
    iss: cfg.appId,
  };
  const jwt = signJwt(payload, privateKey);

  // 1. Fetch installations list
  const installationsRes = await fetch("https://api.github.com/app/installations", {
    headers: {
      Authorization: `Bearer ${jwt}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "QuantumBlaze-ERP",
    },
  });

  if (!installationsRes.ok) {
    throw new Error(`Failed to list installations: ${await installationsRes.text()}`);
  }

  const installations = await installationsRes.json() as any[];
  // Match installation with the target Organization name
  const inst = installations.find((i) => i.account?.login?.toLowerCase() === cfg.orgName?.toLowerCase());
  if (!inst) {
    throw new Error(`App installation not found for Organization: ${cfg.orgName}. Please install the GitHub App first.`);
  }

  // 2. Request installation access token
  const tokenRes = await fetch(`https://api.github.com/app/installations/${inst.id}/access_tokens`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "QuantumBlaze-ERP",
    },
  });

  if (!tokenRes.ok) {
    throw new Error(`Failed to fetch installation access token: ${await tokenRes.text()}`);
  }

  const tokenData = await tokenRes.json() as any;
  return tokenData.token;
}

async function getAuthorizedHeaders(userId?: string): Promise<{ headers: HeadersInit; owner: string; isUserAccount: boolean }> {
  const record = await db
    .select()
    .from(systemConfig)
    .where(eq(systemConfig.key, "github_config"))
    .limit(1);

  if (!record || record.length === 0 || !record[0].value) {
    throw new Error("GitHub App is not configured.");
  }
  const cfg = record[0].value as any;

  // Fallback to user access token if no backend Private Key config (or optionally requested)
  if (userId) {
    const userAcc = await db
      .select()
      .from(userGithubAccounts)
      .where(eq(userGithubAccounts.userId, userId))
      .limit(1);

    if (userAcc.length > 0 && userAcc[0].accessTokenEncrypted) {
      const uToken = decrypt(userAcc[0].accessTokenEncrypted);
      if (uToken) {
        return {
          headers: {
            Authorization: `token ${uToken}`,
            Accept: "application/vnd.github+json",
            "User-Agent": "QuantumBlaze-ERP",
          },
          owner: cfg.orgName,
          isUserAccount: true,
        };
      }
    }
  }

  // Use App Installation token
  const appToken = await getGithubAppInstallationToken(cfg);
  return {
    headers: {
      Authorization: `token ${appToken}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "QuantumBlaze-ERP",
    },
    owner: cfg.orgName,
    isUserAccount: false,
  };
}

// ─── HIGH-LEVEL GITHUB ACTIONS (DEVELOPMENT DASHBOARD) ───────────────────────

/** Create repository, auto-invite members, register webhooks */
export async function createRepositoryAction(
  projectId: string,
  repoName: string,
  description: string
) {
  try {
    const session = await getCurrentSessionAction();
    if (!session?.userId) return { success: false, error: "Unauthorized." };

    const prj = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);
    if (prj.length === 0) return { success: false, error: "Project not found." };

    // Get auth token and target org/owner
    const { headers, owner } = await getAuthorizedHeaders(session.userId);

    console.log(`Creating repository ${owner}/${repoName}...`);
    // 1. POST repository creation
    const repoRes = await fetch(`https://api.github.com/orgs/${owner}/repos`, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: repoName,
        description: description || `Repository for ERP Project: ${prj[0].name}`,
        private: true,
        auto_init: true,
      }),
    });

    if (!repoRes.ok) {
      const errText = await repoRes.text();
      return { success: false, error: `GitHub creation failed: ${errText}` };
    }

    const repoData = await repoRes.json() as any;

    // 2. Fetch project's assigned team developers who linked their GitHub accounts
    // Invite PM and collaborators
    const projectTeamList = await db
      .select({
        username: userGithubAccounts.githubUsername,
      })
      .from(userGithubAccounts)
      .innerJoin(employees, eq(employees.id, userGithubAccounts.userId))
      .where(sql`EXISTS (SELECT 1 FROM project_team WHERE project_team.project_id = ${projectId} AND project_team.employee_id = ${employees.id})`);

    console.log(`Inviting ${projectTeamList.length} linked project team members as collaborators...`);
    for (const member of projectTeamList) {
      try {
        await fetch(`https://api.github.com/repos/${owner}/${repoName}/collaborators/${member.username}`, {
          method: "PUT",
          headers: {
            ...headers,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ permission: "push" }),
        });
      } catch (collabErr) {
        console.error(`Failed to invite collaborator ${member.username}:`, collabErr);
      }
    }

    // 3. Register real-time push webhook
    const webhookSecret = uuidv4().substring(0, 16);
    const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/webhooks/github`;
    console.log(`Registering webhook pointing to: ${webhookUrl}`);

    let webhookId = null;
    try {
      const hookRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}/hooks`, {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "web",
          active: true,
          events: ["push", "pull_request", "issue_comment"],
          config: {
            url: webhookUrl,
            content_type: "json",
            secret: webhookSecret,
          },
        }),
      });

      if (hookRes.ok) {
        const hookData = await hookRes.json() as any;
        webhookId = hookData.id.toString();
      }
    } catch (hookErr) {
      console.error("Failed to register webhook:", hookErr);
    }

    // 4. Save repository link inside projectRepositories
    const repoLinkId = `REP-${uuidv4().substring(0, 8).toUpperCase()}`;
    await db.insert(projectRepositories).values({
      id: repoLinkId,
      projectId,
      repoOwner: owner,
      repoName,
      webhookId,
      webhookSecret,
      createdAt: new Date(),
    });

    revalidatePath("/dashboard/development");
    return { success: true, repoName, owner };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/** Invite a collaborator via their GitHub username or email directly */
export async function inviteCollaboratorAction(projectId: string, collaboratorName: string, permission: "push" | "admin" | "pull") {
  try {
    const session = await getCurrentSessionAction();
    if (!session?.userId) return { success: false, error: "Unauthorized." };

    const repoLink = await db
      .select()
      .from(projectRepositories)
      .where(eq(projectRepositories.projectId, projectId))
      .limit(1);

    if (repoLink.length === 0) return { success: false, error: "Linked repository not found for this project." };

    const { headers } = await getAuthorizedHeaders(session.userId);

    // Call PUT collaborator invite
    const inviteRes = await fetch(
      `https://api.github.com/repos/${repoLink[0].repoOwner}/${repoLink[0].repoName}/collaborators/${collaboratorName}`,
      {
        method: "PUT",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ permission }),
      }
    );

    if (!inviteRes.ok) {
      return { success: false, error: `Failed to invite: ${await inviteRes.text()}` };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/** Fetch all branches for a linked repository */
export async function getBranchesAction(projectId: string) {
  try {
    const repoLink = await db
      .select()
      .from(projectRepositories)
      .where(eq(projectRepositories.projectId, projectId))
      .limit(1);

    if (repoLink.length === 0) return { success: true, branches: [] };

    const { headers } = await getAuthorizedHeaders();
    const res = await fetch(
      `https://api.github.com/repos/${repoLink[0].repoOwner}/${repoLink[0].repoName}/branches`,
      { headers }
    );

    if (!res.ok) throw new Error("Could not fetch branches from GitHub");
    const branchesData = await res.json() as any[];

    return {
      success: true,
      branches: branchesData.map((b) => ({
        name: b.name,
        protected: b.protected,
      })),
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/** Create a new branch for a task ticket */
export async function createBranchAction(projectId: string, branchName: string, baseBranch = "main") {
  try {
    const session = await getCurrentSessionAction();
    if (!session?.userId) return { success: false, error: "Unauthorized." };

    const repoLink = await db
      .select()
      .from(projectRepositories)
      .where(eq(projectRepositories.projectId, projectId))
      .limit(1);

    if (repoLink.length === 0) return { success: false, error: "No repository linked to this project." };

    const { headers } = await getAuthorizedHeaders(session.userId);

    // 1. Get SHA of base branch
    const baseRes = await fetch(
      `https://api.github.com/repos/${repoLink[0].repoOwner}/${repoLink[0].repoName}/git/refs/heads/${baseBranch}`,
      { headers }
    );
    if (!baseRes.ok) throw new Error(`Could not find base branch heads: ${baseBranch}`);
    const baseData = await baseRes.json() as any;
    const sha = baseData.object.sha;

    // 2. POST ref heads
    const refRes = await fetch(
      `https://api.github.com/repos/${repoLink[0].repoOwner}/${repoLink[0].repoName}/git/refs`,
      {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ref: `refs/heads/${branchName}`,
          sha,
        }),
      }
    );

    if (!refRes.ok) {
      return { success: false, error: `GitHub branch failed: ${await refRes.text()}` };
    }

    revalidatePath("/dashboard/development");
    return { success: true, branchName };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/** Create and submit a GitHub Issue (Task Ticket) */
export async function createGithubIssueAction(
  projectId: string,
  title: string,
  body: string,
  assigneeUsername?: string
) {
  try {
    const session = await getCurrentSessionAction();
    if (!session?.userId) return { success: false, error: "Unauthorized." };

    const repoLink = await db
      .select()
      .from(projectRepositories)
      .where(eq(projectRepositories.projectId, projectId))
      .limit(1);

    if (repoLink.length === 0) return { success: false, error: "No repository linked to this project." };

    const { headers } = await getAuthorizedHeaders(session.userId);

    const requestBody: any = {
      title,
      body,
    };
    if (assigneeUsername) {
      requestBody.assignees = [assigneeUsername];
    }

    const res = await fetch(
      `https://api.github.com/repos/${repoLink[0].repoOwner}/${repoLink[0].repoName}/issues`,
      {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!res.ok) {
      return { success: false, error: `GitHub issue failed: ${await res.text()}` };
    }

    const issueData = await res.json() as any;
    return { success: true, number: issueData.number, url: issueData.html_url };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/** Fetch list of repository collaborators who are active on GitHub */
export async function getCollaboratorsAction(projectId: string) {
  try {
    const repoLink = await db
      .select()
      .from(projectRepositories)
      .where(eq(projectRepositories.projectId, projectId))
      .limit(1);

    if (repoLink.length === 0) return { success: true, collaborators: [] };

    const { headers } = await getAuthorizedHeaders();
    const res = await fetch(
      `https://api.github.com/repos/${repoLink[0].repoOwner}/${repoLink[0].repoName}/collaborators?affiliation=direct`,
      { headers }
    );

    if (!res.ok) throw new Error("Failed to load collaborators");
    const data = await res.json() as any[];

    return {
      success: true,
      collaborators: data.map((c) => ({
        login: c.login,
        avatarUrl: c.avatar_url,
      })),
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/** Create a Pull Request */
export async function createPullRequestAction(
  projectId: string,
  title: string,
  headBranch: string,
  baseBranch = "main",
  body = ""
) {
  try {
    const session = await getCurrentSessionAction();
    if (!session?.userId) return { success: false, error: "Unauthorized." };

    const repoLink = await db
      .select()
      .from(projectRepositories)
      .where(eq(projectRepositories.projectId, projectId))
      .limit(1);

    if (repoLink.length === 0) return { success: false, error: "No repository linked to this project." };

    const { headers } = await getAuthorizedHeaders(session.userId);

    const res = await fetch(
      `https://api.github.com/repos/${repoLink[0].repoOwner}/${repoLink[0].repoName}/pulls`,
      {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          head: headBranch,
          base: baseBranch,
          body,
        }),
      }
    );

    if (!res.ok) {
      return { success: false, error: `GitHub PR failed: ${await res.text()}` };
    }

    const prData = await res.json() as any;
    revalidatePath("/dashboard/development");
    return { success: true, number: prData.number, url: prData.html_url };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/** Merge an active Pull Request */
export async function mergePullRequestAction(projectId: string, prNumber: number) {
  try {
    const session = await getCurrentSessionAction();
    if (!session?.userId) return { success: false, error: "Unauthorized." };

    const repoLink = await db
      .select()
      .from(projectRepositories)
      .where(eq(projectRepositories.projectId, projectId))
      .limit(1);

    if (repoLink.length === 0) return { success: false, error: "No repository linked to this project." };

    const { headers } = await getAuthorizedHeaders(session.userId);

    const res = await fetch(
      `https://api.github.com/repos/${repoLink[0].repoOwner}/${repoLink[0].repoName}/pulls/${prNumber}/merge`,
      {
        method: "PUT",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commit_title: `Merged PR #${prNumber} via QuantumBlaze ERP`,
          merge_method: "merge",
        }),
      }
    );

    if (!res.ok) {
      return { success: false, error: `Failed to merge PR: ${await res.text()}` };
    }

    revalidatePath("/dashboard/development");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/** Fetch active organizations the administrator's GitHub App is installed on */
export async function listAppInstalledOrganizationsAction() {
  try {
    const record = await db
      .select()
      .from(systemConfig)
      .where(eq(systemConfig.key, "github_config"))
      .limit(1);

    if (!record || record.length === 0 || !record[0].value) {
      return { success: true, organizations: [] };
    }

    const cfg = record[0].value as any;
    const privateKey = decrypt(cfg.privateKeyEncrypted);
    if (!privateKey) throw new Error("Could not decrypt App Private Key");

    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iat: now - 60,
      exp: now + 540,
      iss: cfg.appId,
    };
    const jwt = signJwt(payload, privateKey);

    const installationsRes = await fetch("https://api.github.com/app/installations", {
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "QuantumBlaze-ERP",
      },
    });

    if (!installationsRes.ok) return { success: true, organizations: [cfg.orgName] };

    const installations = await installationsRes.json() as any[];
    const orgs = installations.map((inst) => inst.account?.login).filter(Boolean);

    return { success: true, organizations: orgs };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/** Load the main Development page feed data */
export async function getDevelopmentDashboardDataAction() {
  try {
    const session = await getCurrentSessionAction();
    if (!session?.userId) return { success: false, error: "Unauthorized." };

    // 1. Fetch linked repositories
    const linkedRepos = await db
      .select({
        id: projectRepositories.id,
        projectId: projectRepositories.projectId,
        projectName: projects.name,
        repoOwner: projectRepositories.repoOwner,
        repoName: projectRepositories.repoName,
        createdAt: projectRepositories.createdAt,
      })
      .from(projectRepositories)
      .innerJoin(projects, eq(projects.id, projectRepositories.projectId))
      .orderBy(sql`${projectRepositories.createdAt} DESC`);

    // 2. Fetch projects that are NOT yet linked to any repository
    const unlinkedProjects = await db
      .select({
        id: projects.id,
        name: projects.name,
      })
      .from(projects)
      .where(
        and(
          eq(projects.status, "Active"),
          sql`NOT EXISTS (SELECT 1 FROM project_repositories WHERE project_repositories.project_id = ${projects.id})`
        )
      );

    // 3. Fetch active tasks that can generate issue branches
    const activeTasks = await db
      .select({
        id: tasks.id,
        title: tasks.title,
        status: tasks.status,
        projectId: tasks.projectId,
        projectName: projects.name,
      })
      .from(tasks)
      .innerJoin(projects, eq(projects.id, tasks.projectId))
      .where(sql`EXISTS (SELECT 1 FROM project_repositories WHERE project_repositories.project_id = ${tasks.projectId})`)
      .limit(10);

    return {
      success: true,
      linkedRepos,
      unlinkedProjects,
      activeTasks,
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/** Get all members in the GitHub Organization */
export async function getOrganizationMembersAction() {
  try {
    const { headers, owner } = await getAuthorizedHeaders();
    
    const res = await fetch(`https://api.github.com/orgs/${owner}/members`, { headers });
    if (!res.ok) throw new Error("Failed to load organization members");
    
    const data = await res.json() as any[];
    return {
      success: true,
      members: data.map((m) => ({
        login: m.login,
        avatarUrl: m.avatar_url,
        htmlUrl: m.html_url,
      })),
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/** Invite a member to the GitHub Organization by Email */
export async function inviteOrganizationMemberAction(email: string, role = "direct_member") {
  try {
    const { headers, owner } = await getAuthorizedHeaders();
    
    const res = await fetch(`https://api.github.com/orgs/${owner}/invitations`, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        role,
      }),
    });
    
    if (!res.ok) {
      const errText = await res.text();
      try {
        const parsed = JSON.parse(errText);
        if (parsed.message) throw new Error(parsed.message);
      } catch {}
      throw new Error(`Invitation failed: ${errText || res.statusText}`);
    }
    
    const data = await res.json();
    return { success: true, invitation: data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
