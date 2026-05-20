CREATE TABLE "personal_tasks" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"checklist" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"due_date" timestamp,
	"priority" varchar(20) DEFAULT 'Medium' NOT NULL,
	"status" varchar(50) DEFAULT 'Todo' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "personal_tasks" ADD CONSTRAINT "personal_tasks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;