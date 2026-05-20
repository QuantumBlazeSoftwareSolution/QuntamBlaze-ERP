const { neon } = require("@neondatabase/serverless");
require("dotenv").config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const sql = neon(connectionString);

async function run() {
  console.log("Running custom migration for chat_messages table using sql.query...");
  try {
    await sql.query(`
      CREATE TABLE IF NOT EXISTS "chat_messages" (
        "id" varchar(255) PRIMARY KEY NOT NULL,
        "project_id" varchar(255) NOT NULL,
        "sender_id" varchar(255),
        "message_text" text,
        "attachments" jsonb DEFAULT '[]' NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL
      );
    `);
    console.log("✓ Table 'chat_messages' created or verified.");

    try {
      await sql.query(`
        ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
      `);
      console.log("✓ Foreign key constraint project_id added.");
    } catch (e) {
      console.log("ℹ Foreign key project_id already exists or skipped:", e.message);
    }

    try {
      await sql.query(`
        ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
      `);
      console.log("✓ Foreign key constraint sender_id added.");
    } catch (e) {
      console.log("ℹ Foreign key sender_id already exists or skipped:", e.message);
    }

    console.log("Migration executed successfully!");
  } catch (err) {
    console.error("Migration execution failed:", err);
    process.exit(1);
  }
}

run();
