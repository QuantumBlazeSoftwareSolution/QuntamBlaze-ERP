import { pgTable, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";
import { projects } from "./projects";

// Pairs individual ERP users with their personal GitHub developer credentials
export const userGithubAccounts = pgTable("user_github_accounts", {
  userId: varchar("user_id", { length: 255 })
    .references(() => users.id, { onDelete: "cascade" })
    .primaryKey(),
  githubUsername: varchar("github_username", { length: 255 }).notNull(),
  githubUserId: varchar("github_user_id", { length: 255 }),
  accessTokenEncrypted: text("access_token_encrypted"),
  refreshTokenEncrypted: text("refresh_token_encrypted"),
  tokenExpiresAt: timestamp("token_expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Maps an ERP project to its dedicated GitHub repository
export const projectRepositories = pgTable("project_repositories", {
  id: varchar("id", { length: 255 }).primaryKey(),
  projectId: varchar("project_id", { length: 255 })
    .references(() => projects.id, { onDelete: "cascade" })
    .notNull(),
  repoOwner: varchar("repo_owner", { length: 255 }).notNull(),
  repoName: varchar("repo_name", { length: 255 }).notNull(),
  webhookId: varchar("webhook_id", { length: 255 }),
  webhookSecret: varchar("webhook_secret", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
