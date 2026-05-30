import { NextRequest, NextResponse } from "next/server";
import { getGDriveClientConfig } from "@/lib/services/gdrive";
import { saveSystemConfigAction } from "@/app/actions/config";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  const settingsRedirectUrl = `${origin}/dashboard/settings?tab=integrations`;

  if (error) {
    console.error("OAuth consent error received from Google:", error);
    return NextResponse.redirect(
      `${settingsRedirectUrl}&gdrive_error=${encodeURIComponent(error)}`
    );
  }

  if (!code) {
    return NextResponse.redirect(
      `${settingsRedirectUrl}&gdrive_error=${encodeURIComponent("Missing authorization code.")}`
    );
  }

  try {
    const clientConfig = await getGDriveClientConfig();
    if (!clientConfig) {
      throw new Error(
        "Google Drive client configuration (Client ID/Secret) is missing in the database."
      );
    }

    const redirectUri = `${origin}/api/auth/callback/google-drive`;

    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: clientConfig.clientId,
        client_secret: clientConfig.clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!response.ok) {
      const errResponse = await response.json();
      throw new Error(
        errResponse.error_description ||
          errResponse.error ||
          "Failed to exchange authorization code."
      );
    }

    const data = await response.json();
    const accessToken = data.access_token;
    const refreshToken = data.refresh_token;
    const expiresIn = data.expires_in || 3600; // default 1 hour
    const expiryDate = Date.now() + expiresIn * 1000;

    if (!refreshToken) {
      // NOTE: Google only returns refreshToken on the very first authorization.
      // If we re-authenticate, we might not get it unless prompt=consent is used.
      console.warn(
        "No refresh token returned by Google. If this is a reconnect, verify you used prompt=consent."
      );
    }

    // Load existing credentials to preserve the refresh token if Google didn't return one in this request
    const existingCredsRecord = await fetch(`${origin}/api/config?key=gdrive_credentials`).catch(
      () => null
    );
    let finalRefreshToken = refreshToken;

    if (!finalRefreshToken) {
      try {
        // Safe internal import fallback since we're in Next.js Server Route context
        const { getGDriveCredentials } = await import("@/lib/services/gdrive");
        const existingCreds = await getGDriveCredentials();
        if (existingCreds?.refreshToken) {
          finalRefreshToken = existingCreds.refreshToken;
        }
      } catch (dbErr) {
        console.warn("Could not retrieve old refresh token from database:", dbErr);
      }
    }

    if (!finalRefreshToken) {
      throw new Error(
        "OAuth integration failed: No refresh token returned. Please disconnect and try again, ensuring permissions are granted."
      );
    }

    const credentials = {
      accessToken,
      refreshToken: finalRefreshToken,
      expiryDate,
    };

    // Save using system configuration server action
    await saveSystemConfigAction("gdrive_credentials", credentials);

    console.log("Google Drive successfully authenticated and tokens saved.");
    return NextResponse.redirect(`${settingsRedirectUrl}&gdrive_success=true`);
  } catch (err: any) {
    console.error("Failed to complete Google Drive OAuth2 callback:", err);
    return NextResponse.redirect(
      `${settingsRedirectUrl}&gdrive_error=${encodeURIComponent(err.message || "OAuth exchange failed.")}`
    );
  }
}
