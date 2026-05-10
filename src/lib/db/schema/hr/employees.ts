import { pgTable, varchar, timestamp, text } from "drizzle-orm/pg-core";

export const employees = pgTable("employees", {
  id: varchar("id", { length: 255 }).primaryKey(),
  // Skeleton for now, to be expanded in Task 32
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});
