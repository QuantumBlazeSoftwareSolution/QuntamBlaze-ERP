import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const sql = neon(connectionString);
const db = drizzle(sql);

async function run() {
  console.log("Running Drizzle migrations via neon-http...");
  try {
    await migrate(db, { migrationsFolder: "./src/lib/db/migrations" });
    console.log("✓ Drizzle migrations applied successfully!");
  } catch (error) {
    console.error("Failed to run Drizzle migrations:", error);
    process.exit(1);
  }
}

run();
