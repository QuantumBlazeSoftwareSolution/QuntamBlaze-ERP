import { pgTable, varchar, timestamp, text, jsonb } from "drizzle-orm/pg-core";
import { users } from "./users";
import { projects } from "./projects";

export const chatMessages = pgTable("chat_messages", {
  id: varchar("id", { length: 255 }).primaryKey(),
  projectId: varchar("project_id", { length: 255 })
    .references(() => projects.id, { onDelete: "cascade" })
    .notNull(),
  senderId: varchar("sender_id", { length: 255 }).references(() => users.id, {
    onDelete: "set null",
  }),
  messageText: text("message_text"),
  attachments: jsonb("attachments").default("[]").notNull(), // Array of { name, link, mimeType, size, id }
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
