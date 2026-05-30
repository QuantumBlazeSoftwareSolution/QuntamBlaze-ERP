import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { projectRepositories } from "@/lib/db/schema/github";
import { logAction } from "@/lib/logger";
import { eq } from "drizzle-orm";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-hub-signature-256") || "";

    // Parse the payload to identify the repository
    const payload = JSON.parse(rawBody);
    const repoName = payload.repository?.name;
    const repoOwner = payload.repository?.owner?.login;

    if (!repoName || !repoOwner) {
      return NextResponse.json({ error: "Missing repository information." }, { status: 400 });
    }

    // Lookup the repository link to fetch the secret
    const links = await db
      .select()
      .from(projectRepositories)
      .where(eq(projectRepositories.repoName, repoName))
      .limit(1);

    if (links.length === 0) {
      return NextResponse.json({ error: "Repository not registered." }, { status: 404 });
    }

    const repoLink = links[0];
    const secret = repoLink.webhookSecret;

    // Verify webhook signature
    if (secret) {
      const hmac = crypto.createHmac("sha256", secret);
      const computedSignature = `sha256=${hmac.update(rawBody).digest("hex")}`;

      try {
        if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(computedSignature))) {
          console.warn("GitHub Webhook signature verification failed.");
          return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
        }
      } catch (sigErr) {
        console.warn("Error comparing webhook signatures:", sigErr);
        return NextResponse.json(
          { error: "Signature mismatch verification error." },
          { status: 401 }
        );
      }
    }

    // Determine the event type from the header
    const event = request.headers.get("x-github-event");
    console.log(`Received GitHub webhook event: ${event} for ${repoOwner}/${repoName}`);

    if (event === "push") {
      const commits = payload.commits || [];
      const branchName = payload.ref?.replace("refs/heads/", "") || "unknown";
      const pusher = payload.pusher?.name || "unknown";

      for (const commit of commits) {
        await logAction(repoLink.projectId, "project", {
          actionName: "github_push",
          actor: pusher,
          description: `Pushed commit: "${commit.message}" to branch [${branchName}]`,
          time: new Date().toISOString(),
          newValue: {
            branch: branchName,
            commitUrl: commit.url,
            sha: commit.id?.substring(0, 7),
          },
        });
      }
    } else if (event === "pull_request") {
      const action = payload.action; // opened, closed, reopened, etc.
      const pr = payload.pull_request;
      const title = pr?.title || "";
      const url = pr?.html_url || "";
      const user = pr?.user?.login || "unknown";
      const isMerged = pr?.merged || false;

      let description = `Pull Request #${pr.number} "${title}" was ${action} by ${user}`;
      if (action === "closed" && isMerged) {
        description = `Merged Pull Request #${pr.number} "${title}" into ${pr.base?.ref} branch`;
      }

      await logAction(repoLink.projectId, "project", {
        actionName: `github_pr_${action}`,
        actor: user,
        description,
        time: new Date().toISOString(),
        newValue: {
          prNumber: pr.number,
          prUrl: url,
          state: action,
          merged: isMerged,
          head: pr.head?.ref,
          base: pr.base?.ref,
        },
      });
    } else if (event === "issue_comment") {
      const action = payload.action;
      const comment = payload.comment;
      const issue = payload.issue;
      const actor = comment?.user?.login || "unknown";

      await logAction(repoLink.projectId, "project", {
        actionName: "github_issue_comment",
        actor,
        description: `Commented on issue #${issue?.number} "${issue?.title}": "${comment?.body?.substring(0, 50)}..."`,
        time: new Date().toISOString(),
        newValue: {
          issueNumber: issue?.number,
          issueUrl: issue?.html_url,
          commentUrl: comment?.html_url,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Failed to process GitHub webhook:", err);
    return NextResponse.json(
      { error: err.message || "Failed to process webhook" },
      { status: 500 }
    );
  }
}
