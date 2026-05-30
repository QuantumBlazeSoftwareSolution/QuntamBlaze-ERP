import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { systemConfig } from "@/lib/db/schema";
import { userGithubAccounts } from "@/lib/db/schema/github";
import { getCurrentSessionAction } from "@/app/actions/auth";
import { encrypt, decrypt } from "@/lib/crypto";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  const devRedirectUrl = `${origin}/dashboard/development`;

  if (error) {
    console.error("OAuth consent error received from GitHub:", error);
    return NextResponse.redirect(`${devRedirectUrl}?error=${encodeURIComponent(error)}`);
  }

  if (!code) {
    return NextResponse.redirect(
      `${devRedirectUrl}?error=${encodeURIComponent("Missing authorization code.")}`
    );
  }

  try {
    const session = await getCurrentSessionAction();
    if (!session?.userId) {
      return NextResponse.redirect(
        `${devRedirectUrl}?error=${encodeURIComponent("Session expired. Please log in first.")}`
      );
    }

    // Get GitHub configuration for Client ID and Client Secret
    const record = await db
      .select()
      .from(systemConfig)
      .where(eq(systemConfig.key, "github_config"))
      .limit(1);

    if (!record || record.length === 0 || !record[0].value) {
      throw new Error("GitHub integration has not been configured by the Administrator yet.");
    }

    const cfg = record[0].value as any;
    const clientSecret = decrypt(cfg.clientSecretEncrypted);
    if (!clientSecret) {
      throw new Error("Could not decrypt GitHub Client Secret.");
    }

    // Exchange code for token
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": "QuantumBlaze-ERP",
      },
      body: JSON.stringify({
        client_id: cfg.clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: `${origin}/api/auth/github/callback`,
      }),
    });

    if (!tokenRes.ok) {
      throw new Error(`Failed to exchange authorization code: ${await tokenRes.text()}`);
    }

    const tokenData = await tokenRes.json();
    if (tokenData.error) {
      throw new Error(tokenData.error_description || tokenData.error || "OAuth exchange failed.");
    }

    const accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token; // may be null/undefined for regular OAuth apps unless configured
    const expiresIn = tokenData.expires_in; // in seconds
    const tokenExpiresAt = expiresIn ? new Date(Date.now() + expiresIn * 1000) : null;

    // Fetch user details from GitHub
    const userRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "QuantumBlaze-ERP",
      },
    });

    if (!userRes.ok) {
      throw new Error(`Failed to fetch user details from GitHub: ${await userRes.text()}`);
    }

    const userData = await userRes.json();
    const githubUsername = userData.login;
    const githubUserId = userData.id.toString();

    // Save to userGithubAccounts table
    await db
      .insert(userGithubAccounts)
      .values({
        userId: session.userId,
        githubUsername,
        githubUserId,
        accessTokenEncrypted: encrypt(accessToken),
        refreshTokenEncrypted: refreshToken ? encrypt(refreshToken) : null,
        tokenExpiresAt,
        createdAt: new Date(),
      })
      .onConflictDoUpdate({
        target: userGithubAccounts.userId,
        set: {
          githubUsername,
          githubUserId,
          accessTokenEncrypted: encrypt(accessToken),
          refreshTokenEncrypted: refreshToken ? encrypt(refreshToken) : null,
          tokenExpiresAt,
        },
      });

    console.log(`Successfully paired user ${session.userId} with GitHub account ${githubUsername}`);
    return NextResponse.redirect(`${devRedirectUrl}?success=github-linked`);
  } catch (err: any) {
    console.error("Failed to complete GitHub OAuth callback:", err);
    return NextResponse.redirect(
      `${devRedirectUrl}?error=${encodeURIComponent(err.message || "OAuth exchange failed.")}`
    );
  }
}
