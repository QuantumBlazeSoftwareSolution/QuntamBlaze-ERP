-- Enable pgvector extension for vector similarity search (Neon Postgres supports this natively)
CREATE EXTENSION IF NOT EXISTS vector;
--> statement-breakpoint
CREATE TABLE "knowledge_chunks" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"document_id" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"chunk_index" integer NOT NULL,
	"embedding" vector(768),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "knowledge_documents" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"title" varchar(500) NOT NULL,
	"description" text,
	"category" varchar(100) DEFAULT 'General' NOT NULL,
	"source_type" varchar(50) DEFAULT 'manual' NOT NULL,
	"status" varchar(50) DEFAULT 'active' NOT NULL,
	"chunk_count" integer DEFAULT 0 NOT NULL,
	"created_by" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "knowledge_chunks" ADD CONSTRAINT "knowledge_chunks_document_id_knowledge_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."knowledge_documents"("id") ON DELETE cascade ON UPDATE no action;