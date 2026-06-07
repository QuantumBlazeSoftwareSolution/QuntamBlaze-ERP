CREATE TABLE "departments" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"code" varchar(50) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "departments_name_unique" UNIQUE("name"),
	CONSTRAINT "departments_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "employees" ADD COLUMN "department_id" varchar(255);--> statement-breakpoint
ALTER TABLE "employees" ADD CONSTRAINT "employees_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
INSERT INTO "departments" ("id", "name", "code", "description", "created_at", "updated_at") VALUES
('dept-eng', 'Engineering', 'ENGINEERING', 'Core Software Engineering and Development', now(), now()),
('dept-fin', 'Finance', 'FINANCE', 'Financial management and accounting', now(), now()),
('dept-des', 'Design', 'DESIGN', 'UI/UX, Product, and Graphic Design', now(), now()),
('dept-mkt', 'Marketing', 'MARKETING', 'Marketing and growth operations', now(), now()),
('dept-prd', 'Product', 'PRODUCT', 'Product Management and Strategy', now(), now()),
('dept-hr', 'HR', 'HR', 'Human Resources and Workforce Management', now(), now()),
('dept-sls', 'Sales', 'SALES', 'Sales and Business Development', now(), now()),
('dept-oth', 'Other', 'OTHER', 'Miscellaneous or other operations', now(), now())
ON CONFLICT DO NOTHING;
--> statement-breakpoint
UPDATE "employees" SET "department_id" = 'dept-eng' WHERE UPPER(TRIM("department")) = 'ENGINEERING';
--> statement-breakpoint
UPDATE "employees" SET "department_id" = 'dept-des' WHERE UPPER(TRIM("department")) = 'DESIGN';
--> statement-breakpoint
UPDATE "employees" SET "department_id" = 'dept-prd' WHERE UPPER(TRIM("department")) = 'PRODUCT';
--> statement-breakpoint
UPDATE "employees" SET "department_id" = 'dept-mkt' WHERE UPPER(TRIM("department")) = 'MARKETING';
--> statement-breakpoint
UPDATE "employees" SET "department_id" = 'dept-sls' WHERE UPPER(TRIM("department")) = 'SALES';
--> statement-breakpoint
UPDATE "employees" SET "department_id" = 'dept-hr' WHERE UPPER(TRIM("department")) IN ('HR', 'HUMAN RESOURCES');
--> statement-breakpoint
UPDATE "employees" SET "department_id" = 'dept-fin' WHERE UPPER(TRIM("department")) = 'FINANCE';
--> statement-breakpoint
UPDATE "employees" SET "department_id" = 'dept-oth' WHERE "department_id" IS NULL AND "department" IS NOT NULL;