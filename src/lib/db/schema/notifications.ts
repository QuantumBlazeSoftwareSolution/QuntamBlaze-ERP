import { pgTable, varchar, jsonb, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

export const pushSubscriptions = pgTable("push_subscriptions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 })
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  endpoint: varchar("endpoint", { length: 2048 }).notNull().unique(),
  keys: jsonb("keys").notNull(), // { p256dh: string, auth: string }
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
