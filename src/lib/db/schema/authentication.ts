import { pgTable, varchar, timestamp, boolean } from "drizzle-orm/pg-core";

export const authentication = pgTable("authentication", {
  id: varchar("id", { length: 255 }).primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  code: varchar("code", { length: 255 }).notNull(), // Hashed OTP code for maximum security
  expiresAt: timestamp("expires_at").notNull(),
  isUsed: boolean("is_used").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
