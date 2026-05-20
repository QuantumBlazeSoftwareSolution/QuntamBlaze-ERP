import crypto from "crypto";

/**
 * Utility for hashing and verifying passwords securely using Node's native crypto module.
 * No external npm packages required, avoiding build and platform compatibility issues.
 */

const KEY_LEN = 64;
const SCRYPT_OPTIONS = { N: 16384, r: 8, p: 1 }; // Production scrypt parameters

/**
 * Hashes a plain-text password using the scrypt algorithm.
 * 
 * @param password The plain text password to hash
 * @returns Formatted hash string in the format "salt:hash"
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, KEY_LEN, SCRYPT_OPTIONS);
  return `${salt}:${derivedKey.toString("hex")}`;
}

/**
 * Verifies a plain-text password against a previously generated scrypt hash.
 * 
 * @param password The plain text password to check
 * @param storedHash The stored hash in the format "salt:hash"
 * @returns True if the password is correct, false otherwise
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash || !storedHash.includes(":")) {
    return false;
  }

  const [salt, originalHashHex] = storedHash.split(":");
  const originalHash = Buffer.from(originalHashHex, "hex");
  
  const verifyKey = crypto.scryptSync(password, salt, KEY_LEN, SCRYPT_OPTIONS);
  
  // Timing-safe comparison to prevent timing attacks
  return crypto.timingSafeEqual(originalHash, verifyKey);
}
