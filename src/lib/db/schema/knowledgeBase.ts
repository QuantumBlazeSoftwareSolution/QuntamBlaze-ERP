import {
  pgTable,
  varchar,
  text,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { customType } from "drizzle-orm/pg-core";

/**
 * Custom Drizzle type for pgvector `vector(dimensions)` column.
 * Drizzle ORM does not ship a built-in vector type yet, so we register one
 * using customType with explicit serialisation / deserialisation helpers.
 */
const vector = (name: string, config: { dimensions: number }) =>
  customType<{ data: number[]; driverData: string }>({
    dataType() {
      return `vector(${config.dimensions})`;
    },
    toDriver(value: number[]): string {
      return `[${value.join(",")}]`;
    },
    fromDriver(value: string): number[] {
      // Postgres returns the vector as a string like "[0.1,0.2,...]"
      return value
        .replace(/^\[/, "")
        .replace(/\]$/, "")
        .split(",")
        .map(Number);
    },
  })(name);

// ---------------------------------------------------------------------------
// knowledge_documents  —  parent record for each knowledge article
// ---------------------------------------------------------------------------
export const knowledgeDocuments = pgTable("knowledge_documents", {
  id: varchar("id", { length: 255 }).primaryKey(),

  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),

  /** Logical category used for UI filtering */
  category: varchar("category", { length: 100 }).default("General").notNull(),

  /**
   * How the document was provided:
   *   "manual" — typed directly in the ERP
   *   "file"   — uploaded (future)
   *   "url"    — web import (future)
   */
  sourceType: varchar("source_type", { length: 50 }).default("manual").notNull(),

  /**
   * Lifecycle status:
   *   "active"   — visible to Ask AI
   *   "draft"    — saved but not yet embedded / not returned by Ask AI
   *   "archived" — hidden from Ask AI
   */
  status: varchar("status", { length: 50 }).default("active").notNull(),

  /** How many knowledge_chunks currently belong to this document */
  chunkCount: integer("chunk_count").default(0).notNull(),

  /** User ID of whoever created the document */
  createdBy: varchar("created_by", { length: 255 }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

// ---------------------------------------------------------------------------
// knowledge_chunks  —  individual text segments with their vector embeddings
// ---------------------------------------------------------------------------
export const knowledgeChunks = pgTable("knowledge_chunks", {
  id: varchar("id", { length: 255 }).primaryKey(),

  documentId: varchar("document_id", { length: 255 })
    .references(() => knowledgeDocuments.id, { onDelete: "cascade" })
    .notNull(),

  /** Raw text for this chunk (~500 words) */
  content: text("content").notNull(),

  /** Position of this chunk within the parent document (0-indexed) */
  chunkIndex: integer("chunk_index").notNull(),

  /**
   * 768-dimensional vector embedding produced by Gemini text-embedding-004.
   * NULL until the embedding pipeline runs for this document.
   */
  embedding: vector("embedding", { dimensions: 768 }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});
