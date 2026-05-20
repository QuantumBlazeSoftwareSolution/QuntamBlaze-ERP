import { cookies } from "next/headers";
import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

// Derives a secure 32-byte key from the environment secret (or a stable developer fallback)
const SESSION_SECRET = process.env.SESSION_SECRET || "quantum_blaze_super_secret_session_key_2026";

export interface SessionData {
  userId: string;
  name: string;
  email: string;
  roleId: string;
  roleName: string;
  roleColor: string;
  createdAt: string;
}

/**
 * Symmetric AES-256-GCM encryption helper.
 */
function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const key = crypto.scryptSync(SESSION_SECRET, "session-salt", 32);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  
  const tag = cipher.getAuthTag();
  
  return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted}`;
}

/**
 * Symmetric AES-256-GCM decryption helper with authenticity verification.
 */
function decrypt(cipherText: string): string | null {
  try {
    const parts = cipherText.split(":");
    if (parts.length !== 3) return null;
    
    const [ivHex, tagHex, encryptedHex] = parts;
    const iv = Buffer.from(ivHex, "hex");
    const tag = Buffer.from(tagHex, "hex");
    const encrypted = Buffer.from(encryptedHex, "hex");
    
    const key = crypto.scryptSync(SESSION_SECRET, "session-salt", 32);
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);
    
    let decrypted = decipher.update(encrypted, undefined, "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    console.error("[QB-SESSION] Auth verification / Decryption failed:", error);
    return null;
  }
}

/**
 * Initializes a secure, HttpOnly, SameSite cookie session.
 */
export async function createSession(data: Omit<SessionData, "createdAt">) {
  const sessionData: SessionData = {
    ...data,
    createdAt: new Date().toISOString(),
  };
  
  const token = encrypt(JSON.stringify(sessionData));
  const cookieStore = await cookies();
  
  cookieStore.set("qb-session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

/**
 * Reads and verifies the current session cookie.
 */
export async function getSession(): Promise<SessionData | null> {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get("qb-session");
    if (!cookie || !cookie.value) return null;
    
    const decrypted = decrypt(cookie.value);
    if (!decrypted) return null;
    
    return JSON.parse(decrypted) as SessionData;
  } catch {
    return null;
  }
}

/**
 * Clears the session cookie.
 */
export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete("qb-session");
}
