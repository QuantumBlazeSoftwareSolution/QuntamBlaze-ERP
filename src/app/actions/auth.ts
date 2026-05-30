"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema/users";
import { roles } from "@/lib/db/schema/roles";
import { authentication } from "@/lib/db/schema/authentication";
import { eq, and, gt } from "drizzle-orm";
import { hashPassword, verifyPassword } from "@/lib/utils/password";
import { createSession, destroySession, getSession } from "@/lib/session";
import { generateUserId } from "@/lib/idEngine";
import { logAction } from "@/lib/logger";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import fs from "fs";
import path from "path";

/**
 * Server Action to register a new user.
 */
export async function signUpAction(formData: any) {
  try {
    const { name, email, password, roleId } = formData;

    if (!name || !email || !password || !roleId) {
      return { success: false, error: "All fields are required" };
    }

    // 1. Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email));
    if (existingUser.length > 0) {
      return { success: false, error: "A user with this email already exists" };
    }

    // 2. Fetch the role to verify it exists and get color/name
    const roleResult = await db.select().from(roles).where(eq(roles.id, roleId));
    if (roleResult.length === 0) {
      return { success: false, error: "Selected system role is invalid" };
    }
    const role = roleResult[0];

    // 3. Count total users to generate unique, sequential ID
    const allUsers = await db.select().from(users);
    const sequence = allUsers.length + 1;
    const userId = generateUserId(name, sequence);

    // 4. Hash the password securely
    const passwordHash = hashPassword(password);

    // 5. Insert the user record
    await db.insert(users).values({
      id: userId,
      name,
      email,
      passwordHash,
      roleId,
      status: "Active",
      lastActive: new Date(),
    });

    // 6. Create encrypted session
    await createSession({
      userId,
      name,
      email,
      roleId,
      roleName: role.name,
      roleColor: role.color || "#10B981",
    });

    // 7. Log audit event
    await logAction(userId, "USER", {
      actionName: "USER_SIGN_UP",
      actor: userId,
      description: `User ${name} successfully signed up with role ${role.name} (${userId})`,
      time: new Date().toISOString(),
    });

    return { success: true };
  } catch (error: any) {
    console.error("[QB-AUTH] Sign-up failed:", error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
}

/**
 * Server Action to log in an existing user.
 */
export async function signInAction(formData: any) {
  try {
    const { email, password } = formData;

    if (!email || !password) {
      return { success: false, error: "Email and password are required" };
    }

    // 1. Find the user
    const userResult = await db.select().from(users).where(eq(users.email, email));
    if (userResult.length === 0) {
      return { success: false, error: "Invalid email or password" };
    }
    const user = userResult[0];

    // 2. Validate password
    if (!user.passwordHash) {
      // If user has no password (e.g. legacy seed data), allow fallback to "password" for developer ease
      if (password === "password") {
        console.warn(`[QB-AUTH] Legacy login fallback used for ${email}`);
      } else {
        return { success: false, error: "Account has not been configured with a password yet" };
      }
    } else {
      const isCorrect = verifyPassword(password, user.passwordHash);
      if (!isCorrect) {
        return { success: false, error: "Invalid email or password" };
      }
    }

    // 3. Verify status
    if (user.status !== "Active") {
      return { success: false, error: "This user account is suspended or inactive" };
    }

    // 4. Fetch user's role
    let roleName = "Viewer";
    let roleColor = "#8B5CF6";
    if (user.roleId) {
      const roleResult = await db.select().from(roles).where(eq(roles.id, user.roleId));
      if (roleResult.length > 0) {
        roleName = roleResult[0].name;
        roleColor = roleResult[0].color || "#10B981";
      }
    }

    // 5. Create secure session
    await createSession({
      userId: user.id,
      name: user.name,
      email: user.email,
      roleId: user.roleId || "role-viewer",
      roleName,
      roleColor,
    });

    // 6. Update user last active timestamp
    await db.update(users).set({ lastActive: new Date() }).where(eq(users.id, user.id));

    // 7. Log sign in
    await logAction(user.id, "USER", {
      actionName: "USER_SIGN_IN",
      actor: user.id,
      description: `User ${user.name} logged in successfully`,
      time: new Date().toISOString(),
    });

    return { success: true };
  } catch (error: any) {
    console.error("[QB-AUTH] Sign-in failed:", error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
}

/**
 * Server Action to sign out.
 */
export async function signOutAction() {
  try {
    await destroySession();
    return { success: true };
  } catch (error) {
    console.error("[QB-AUTH] Sign-out failed:", error);
    return { success: false, error: "Sign out failed" };
  }
}

/**
 * Server Action to request a password reset link and generate an OTP.
 */
export async function requestPasswordResetAction(formData: any) {
  try {
    const { email } = formData;

    if (!email) {
      return { success: false, error: "Email address is required" };
    }

    // 1. Generate 6-digit numeric OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // 2. Hash the OTP securely (SHA-256)
    const hashedOtp = crypto.createHash("sha256").update(otpCode).digest("hex");

    // 3. Store OTP in database
    const authId = uuidv4();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry

    await db.insert(authentication).values({
      id: authId,
      email,
      code: hashedOtp,
      expiresAt,
      isUsed: false,
    });

    // 4. Verify user exists (to write simulated email)
    const userResult = await db.select().from(users).where(eq(users.email, email));

    if (userResult.length > 0) {
      const user = userResult[0];

      // Create simulated email HTML content
      const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Reset Your Quantum Blaze Password</title>
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #0B0F19;
      color: #F8FAFC;
      margin: 0;
      padding: 40px 20px;
    }
    .container {
      max-width: 520px;
      margin: 0 auto;
      background-color: #111827;
      border: 1px solid #1F2937;
      border-radius: 16px;
      padding: 40px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
    }
    .logo {
      color: #10B981;
      font-size: 24px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 24px;
      text-align: center;
    }
    h1 {
      font-size: 20px;
      font-weight: 700;
      color: #FFFFFF;
      margin-top: 0;
      margin-bottom: 16px;
      text-align: center;
    }
    p {
      font-size: 14px;
      line-height: 1.6;
      color: #9CA3AF;
      margin-bottom: 24px;
      text-align: center;
    }
    .otp-card {
      background-color: #1F2937;
      border: 1px solid #374151;
      border-radius: 12px;
      padding: 20px;
      text-align: center;
      margin-bottom: 30px;
    }
    .otp-code {
      font-family: 'Courier New', Courier, monospace;
      font-size: 36px;
      font-weight: 800;
      letter-spacing: 0.25em;
      color: #10B981;
      margin: 0;
    }
    .btn-container {
      text-align: center;
      margin-bottom: 30px;
    }
    .btn {
      display: inline-block;
      background-color: #10B981;
      color: #FFFFFF;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      padding: 12px 32px;
      border-radius: 8px;
      transition: background-color 0.2s;
    }
    .footer {
      font-size: 11px;
      color: #4B5563;
      text-align: center;
      border-top: 1px solid #1F2937;
      padding-top: 20px;
      margin-top: 30px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">QUANTUM BLAZE</div>
    <h1>Password Reset Request</h1>
    <p>Hi ${user.name}, we received a request to reset your password. Use the secure verification code below to complete your reset. This code will expire in 15 minutes.</p>
    
    <div class="otp-card">
      <p style="margin-bottom: 8px; font-size: 12px; color: #6B7280; text-transform: uppercase; tracking: 0.05em;">Your OTP Code</p>
      <div class="otp-code">${otpCode}</div>
    </div>
    
    <div class="btn-container">
      <a href="http://localhost:3000/forgot-password?email=${encodeURIComponent(email)}&otp=${otpCode}" class="btn">Verify and Reset Password</a>
    </div>
    
    <p style="font-size: 12px; color: #4B5563;">If you didn't request a password reset, you can safely ignore this email.</p>
    
    <div class="footer">
      Quantum Blaze ERP · Secure Identity Services · System Operations
    </div>
  </div>
</body>
</html>
      `;

      // Save email template locally so developer can view it easily!
      const emailDir = path.join(process.cwd(), "public", "emails");
      if (!fs.existsSync(emailDir)) {
        fs.mkdirSync(emailDir, { recursive: true });
      }
      fs.writeFileSync(path.join(emailDir, "last-reset-email.html"), emailHtml);

      // Print a gorgeous console card for developer convenience
      console.log("\n" + "═".repeat(60));
      console.log("🔐 [QB-AUTH] PASSWORD RESET SIMULATOR");
      console.log(`👤 Recipient: ${user.name} (${email})`);
      console.log(`🔑 Secure Code: [ ${otpCode} ]`);
      console.log(
        `🔗 Reset Link: http://localhost:3000/forgot-password?email=${encodeURIComponent(email)}&otp=${otpCode}`
      );
      console.log("📂 E-Mail saved to: public/emails/last-reset-email.html");
      console.log("═".repeat(60) + "\n");
    } else {
      console.warn(`[QB-AUTH] Password reset requested for non-existent email: ${email}`);
    }

    // Always return success to prevent user enumeration attacks
    return { success: true, email };
  } catch (error: any) {
    console.error("[QB-AUTH] Request password reset failed:", error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
}

/**
 * Server Action to verify OTP code and update password.
 */
export async function verifyOtpAndResetPasswordAction(formData: any) {
  try {
    const { email, otp, newPassword } = formData;

    if (!email || !otp || !newPassword) {
      return { success: false, error: "Email, OTP code, and new password are required" };
    }

    // 1. Hash the incoming OTP using SHA-256
    const hashedOtp = crypto.createHash("sha256").update(otp.trim()).digest("hex");

    // 2. Fetch unexpired, unused authentication codes for the email
    const activeRecords = await db
      .select()
      .from(authentication)
      .where(
        and(
          eq(authentication.email, email),
          eq(authentication.isUsed, false),
          gt(authentication.expiresAt, new Date())
        )
      );

    if (activeRecords.length === 0) {
      return {
        success: false,
        error: "The verification code is invalid, expired, or has already been used",
      };
    }

    // 3. Match code
    const matchingRecord = activeRecords.find((r) => r.code === hashedOtp);
    if (!matchingRecord) {
      return { success: false, error: "The verification code is incorrect" };
    }

    // 4. Fetch the user to update
    const userResult = await db.select().from(users).where(eq(users.email, email));
    if (userResult.length === 0) {
      return { success: false, error: "User account not found" };
    }
    const user = userResult[0];

    // 5. Mark code as used
    await db
      .update(authentication)
      .set({ isUsed: true })
      .where(eq(authentication.id, matchingRecord.id));

    // 6. Encrypt and update the user's password
    const newPasswordHash = hashPassword(newPassword);
    await db.update(users).set({ passwordHash: newPasswordHash }).where(eq(users.id, user.id));

    // 7. Log reset action
    await logAction(user.id, "USER", {
      actionName: "USER_PASSWORD_RESET",
      actor: user.id,
      description: `User ${user.name} successfully reset their password using OTP code`,
      time: new Date().toISOString(),
    });

    console.log(`[QB-AUTH] Password successfully updated for ${email} · Event USR-PW-RST`);

    return { success: true };
  } catch (error: any) {
    console.error("[QB-AUTH] OTP verification and reset failed:", error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
}

/**
 * Server Action to retrieve the current session in client components.
 */
export async function getCurrentSessionAction() {
  return await getSession();
}
