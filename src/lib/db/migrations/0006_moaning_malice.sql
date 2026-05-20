CREATE TABLE "employee_roles" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"code" varchar(50) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "employee_roles_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "employees" ADD COLUMN "employee_role" varchar(50) DEFAULT 'SE' NOT NULL;