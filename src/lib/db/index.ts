import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

// We fall back to a mock string to avoid crashes during UI development
// before the user connects their actual Neon DB.
const connectionString = process.env.DATABASE_URL || "postgres://user:password@localhost:5432/db";

const sql = neon(connectionString);
export const db = drizzle(sql);
