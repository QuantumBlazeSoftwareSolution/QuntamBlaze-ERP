CREATE TABLE "system_log" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"entity_id" varchar(255) NOT NULL,
	"entity_type" varchar(255) NOT NULL,
	"details" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
