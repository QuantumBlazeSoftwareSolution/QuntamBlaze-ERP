CREATE TYPE "public"."attendance_location" AS ENUM('Office', 'Remote', 'On-Site', 'Hybrid');--> statement-breakpoint
CREATE TYPE "public"."attendance_status" AS ENUM('Present', 'Late', 'Absent', 'On Leave', 'Half Day', 'Holiday');--> statement-breakpoint
CREATE TYPE "public"."candidate_source" AS ENUM('LinkedIn', 'Referral', 'Website', 'Agency', 'Direct', 'Job Board');--> statement-breakpoint
CREATE TYPE "public"."pipeline_stage" AS ENUM('Applied', 'Screening', 'Technical', 'Final', 'Offer', 'Hired', 'Rejected', 'Withdrawn');--> statement-breakpoint
CREATE TYPE "public"."interview_status" AS ENUM('scheduled', 'completed', 'cancelled', 'no_show');--> statement-breakpoint
CREATE TYPE "public"."interview_type" AS ENUM('phone_screen', 'technical', 'culture_fit', 'final', 'reference_check', 'hr_round');--> statement-breakpoint
CREATE TYPE "public"."recommendation" AS ENUM('strong_hire', 'hire', 'no_hire', 'strong_no_hire');--> statement-breakpoint
CREATE TYPE "public"."department" AS ENUM('Engineering', 'Finance', 'Design', 'Marketing', 'Operations', 'HR', 'Sales');--> statement-breakpoint
CREATE TYPE "public"."employment_type" AS ENUM('Full-Time', 'Part-Time', 'Contract', 'Internship');--> statement-breakpoint
CREATE TYPE "public"."job_status" AS ENUM('Active', 'Paused', 'Closed', 'Draft');--> statement-breakpoint
CREATE TYPE "public"."seniority_level" AS ENUM('Junior', 'Mid', 'Senior', 'Lead', 'Director');--> statement-breakpoint
CREATE TYPE "public"."work_location_type" AS ENUM('Remote', 'Hybrid', 'On-Site');--> statement-breakpoint
CREATE TYPE "public"."leave_accrual_frequency" AS ENUM('Monthly', 'Quarterly', 'Yearly', 'One-Time');--> statement-breakpoint
CREATE TYPE "public"."leave_request_status" AS ENUM('Pending', 'Approved', 'Rejected', 'Cancelled');--> statement-breakpoint
CREATE TYPE "public"."onboarding_status" AS ENUM('pre_arrival', 'day_1', 'week_1', 'month_1', 'month_2', 'month_3', 'completed');--> statement-breakpoint
CREATE TYPE "public"."onboarding_task_category" AS ENUM('IT', 'HR', 'Finance', 'Team', 'Training', 'Operations');--> statement-breakpoint
CREATE TYPE "public"."calculation_type" AS ENUM('Fixed', 'Percentage');--> statement-breakpoint
CREATE TYPE "public"."payroll_batch_status" AS ENUM('Draft', 'Processing', 'Completed', 'Paid');--> statement-breakpoint
CREATE TYPE "public"."goal_status" AS ENUM('Not Started', 'In Progress', 'Completed', 'Overdue', 'Cancelled');--> statement-breakpoint
CREATE TYPE "public"."review_cycle_status" AS ENUM('Open', 'Self-Review', 'Manager-Review', 'Closed');--> statement-breakpoint
CREATE TYPE "public"."shift_swap_status" AS ENUM('Pending', 'Approved', 'Rejected', 'Completed');--> statement-breakpoint
CREATE TYPE "public"."shift_type" AS ENUM('Morning', 'Evening', 'Night', 'Rotational', 'Fixed');--> statement-breakpoint
CREATE TYPE "public"."skill_category" AS ENUM('Technical', 'Leadership', 'Soft Skills', 'Operations', 'Strategic', 'Tools');--> statement-breakpoint
CREATE TABLE "clients" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"industry" varchar(255),
	"billing_address" text,
	"payment_terms" varchar(100),
	"contact_person" varchar(255),
	"contact_email" varchar(255),
	"contact_phone" varchar(100),
	"total_billed" numeric(12, 2) DEFAULT '0',
	"status" varchar(50) DEFAULT 'Active' NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "hr_activities" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"type" varchar(100) NOT NULL,
	"description" text NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"entities" jsonb
);
--> statement-breakpoint
CREATE TABLE "attendance_records" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"employee_id" varchar NOT NULL,
	"date" timestamp NOT NULL,
	"check_in" timestamp,
	"check_out" timestamp,
	"status" "attendance_status" DEFAULT 'Present' NOT NULL,
	"location" "attendance_location" DEFAULT 'Office' NOT NULL,
	"ip_address" varchar(50),
	"device_info" text,
	"notes" text,
	"is_overtime" boolean DEFAULT false,
	"total_hours" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "candidates" (
	"id" varchar PRIMARY KEY NOT NULL,
	"job_id" varchar,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(50),
	"linkedin_url" varchar(255),
	"resume_url" varchar(255),
	"source" "candidate_source" NOT NULL,
	"current_stage" "pipeline_stage" DEFAULT 'Applied' NOT NULL,
	"referred_by" varchar,
	"notes" text,
	"expected_salary" integer,
	"notice_period_days" integer,
	"assigned_to_id" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" varchar,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "employees" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"first_name" varchar(100),
	"last_name" varchar(100),
	"name" varchar(255) NOT NULL,
	"role" varchar(255),
	"department" varchar(100),
	"status" varchar(50) DEFAULT 'Active' NOT NULL,
	"join_date" timestamp,
	"avatar" varchar(500),
	"email" varchar(255) NOT NULL,
	"phone" varchar(50),
	"address" text,
	"nic" varchar(20),
	"bank_details" jsonb,
	"reporting_to_id" varchar(255),
	"profile_health" integer DEFAULT 0,
	"birth_date" timestamp,
	"probation_end" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "employees_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "interviewers" (
	"interview_id" varchar NOT NULL,
	"employee_id" varchar NOT NULL,
	CONSTRAINT "interviewers_interview_id_employee_id_pk" PRIMARY KEY("interview_id","employee_id")
);
--> statement-breakpoint
CREATE TABLE "interviews" (
	"id" varchar PRIMARY KEY NOT NULL,
	"candidate_id" varchar NOT NULL,
	"job_id" varchar NOT NULL,
	"type" "interview_type" NOT NULL,
	"scheduled_at" timestamp NOT NULL,
	"duration_minutes" integer DEFAULT 60,
	"status" "interview_status" DEFAULT 'scheduled',
	"meeting_link" varchar,
	"location" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" varchar
);
--> statement-breakpoint
CREATE TABLE "scorecards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"interview_id" varchar NOT NULL,
	"evaluator_id" varchar NOT NULL,
	"technical_score" numeric,
	"behavioral_score" numeric,
	"role_specific_score" numeric,
	"overall_score" numeric,
	"recommendation" "recommendation",
	"summary" text,
	"private_notes" text,
	"criteria_scores" jsonb,
	"submitted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" varchar PRIMARY KEY NOT NULL,
	"title" varchar(200) NOT NULL,
	"department" "department" NOT NULL,
	"employment_type" "employment_type" NOT NULL,
	"seniority_level" "seniority_level" NOT NULL,
	"work_location_type" "work_location_type" NOT NULL,
	"city" varchar(100),
	"salary_min" integer,
	"salary_max" integer,
	"currency" varchar(3) DEFAULT 'USD',
	"openings" integer DEFAULT 1,
	"description" text,
	"required_skills" text[],
	"application_deadline" timestamp,
	"hiring_manager_id" varchar,
	"status" "job_status" DEFAULT 'Draft' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" varchar,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "leave_policies" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"leave_type_id" varchar NOT NULL,
	"annual_entitlement" numeric(5, 2) NOT NULL,
	"accrual_frequency" "leave_accrual_frequency" DEFAULT 'Yearly' NOT NULL,
	"max_carry_forward" numeric(5, 2) DEFAULT '0',
	"can_apply_in_probation" boolean DEFAULT false,
	"is_prorated" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leave_types" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"color_code" varchar(50) DEFAULT '#3B82F6',
	"is_paid" boolean DEFAULT true,
	"requires_attachment" boolean DEFAULT false,
	"min_notice_days" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leave_balances" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"employee_id" varchar NOT NULL,
	"leave_type_id" varchar NOT NULL,
	"year" integer NOT NULL,
	"entitled" numeric(5, 2) DEFAULT '0' NOT NULL,
	"accrued" numeric(5, 2) DEFAULT '0' NOT NULL,
	"taken" numeric(5, 2) DEFAULT '0' NOT NULL,
	"remaining" numeric(5, 2) DEFAULT '0' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leave_requests" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"employee_id" varchar NOT NULL,
	"leave_type_id" varchar NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"total_days" numeric(5, 2) NOT NULL,
	"reason" text NOT NULL,
	"status" "leave_request_status" DEFAULT 'Pending' NOT NULL,
	"attachment_url" text,
	"approved_by" varchar,
	"approved_at" timestamp,
	"comments" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "onboarding_plans" (
	"id" varchar PRIMARY KEY NOT NULL,
	"employee_id" varchar NOT NULL,
	"status" "onboarding_status" DEFAULT 'pre_arrival' NOT NULL,
	"start_date" timestamp NOT NULL,
	"completion_rate" integer DEFAULT 0,
	"mentor_id" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" varchar
);
--> statement-breakpoint
CREATE TABLE "onboarding_tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"plan_id" varchar NOT NULL,
	"title" varchar(255) NOT NULL,
	"category" "onboarding_task_category" NOT NULL,
	"description" text,
	"is_completed" boolean DEFAULT false NOT NULL,
	"completed_at" timestamp,
	"due_date" timestamp,
	"owner_id" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "allowance_types" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"calculation_type" "calculation_type" DEFAULT 'Fixed' NOT NULL,
	"value" numeric(10, 2) NOT NULL,
	"is_taxable" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "salary_structures" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"grade" varchar(50) NOT NULL,
	"base_salary" numeric(12, 2) NOT NULL,
	"currency" varchar(10) DEFAULT 'LKR' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "statutory_rules" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"employee_contribution" numeric(5, 2) NOT NULL,
	"employer_contribution" numeric(5, 2) NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "structure_allowances" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"structure_id" varchar NOT NULL,
	"allowance_type_id" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payroll_batches" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"month" integer NOT NULL,
	"year" integer NOT NULL,
	"status" "payroll_batch_status" DEFAULT 'Draft' NOT NULL,
	"total_gross" numeric(15, 2) DEFAULT '0',
	"total_net" numeric(15, 2) DEFAULT '0',
	"total_deductions" numeric(15, 2) DEFAULT '0',
	"processed_by" varchar,
	"processed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payroll_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"batch_id" varchar NOT NULL,
	"employee_id" varchar NOT NULL,
	"structure_id" varchar,
	"basic_salary" numeric(12, 2) NOT NULL,
	"total_allowances" numeric(12, 2) DEFAULT '0',
	"total_deductions" numeric(12, 2) DEFAULT '0',
	"unpaid_leave_deduction" numeric(12, 2) DEFAULT '0',
	"net_salary" numeric(12, 2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "key_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"goal_id" varchar NOT NULL,
	"title" varchar(255) NOT NULL,
	"target_value" numeric(10, 2) NOT NULL,
	"current_value" numeric(10, 2) DEFAULT '0' NOT NULL,
	"unit" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "performance_goals" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"employee_id" varchar NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"weightage" integer DEFAULT 1 NOT NULL,
	"status" "goal_status" DEFAULT 'Not Started' NOT NULL,
	"target_date" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "review_cycles" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"status" "review_cycle_status" DEFAULT 'Open' NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shift_assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"employee_id" varchar NOT NULL,
	"shift_id" varchar NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"rotation_pattern" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shift_swaps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"requesting_employee_id" varchar NOT NULL,
	"target_employee_id" varchar NOT NULL,
	"original_shift_assignment_id" uuid NOT NULL,
	"target_shift_assignment_id" uuid NOT NULL,
	"swap_date" timestamp NOT NULL,
	"reason" text,
	"status" "shift_swap_status" DEFAULT 'Pending' NOT NULL,
	"approved_by" varchar,
	"approved_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shifts" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"type" "shift_type" DEFAULT 'Morning' NOT NULL,
	"start_time" varchar(5) NOT NULL,
	"end_time" varchar(5) NOT NULL,
	"department" "department",
	"grace_period" integer DEFAULT 15,
	"break_duration" integer DEFAULT 60,
	"is_auto_clock_out" boolean DEFAULT false,
	"auto_clock_out_time" varchar(5),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "certifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"employee_id" varchar NOT NULL,
	"name" varchar(255) NOT NULL,
	"issuer" varchar(255) NOT NULL,
	"issue_date" timestamp,
	"expiry_date" timestamp,
	"credential_id" varchar(255),
	"credential_url" text,
	"status" varchar(50) DEFAULT 'Active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "employee_skills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"employee_id" varchar NOT NULL,
	"skill_name" varchar(255) NOT NULL,
	"category" "skill_category" NOT NULL,
	"level" integer DEFAULT 0 NOT NULL,
	"target_level" integer DEFAULT 0 NOT NULL,
	"last_assessed_at" timestamp,
	"assessed_by" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "id_config" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"prefix" varchar(50) NOT NULL,
	"last_sequence" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"color" varchar(50) DEFAULT '#10B981',
	"is_system" boolean DEFAULT false NOT NULL,
	"permissions" jsonb DEFAULT '{}' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"avatar" text,
	"role_id" varchar(255),
	"status" varchar(50) DEFAULT 'Active' NOT NULL,
	"last_active" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"company" varchar(255) NOT NULL,
	"contact_name" varchar(255),
	"contact_email" varchar(255),
	"contact_phone" varchar(100),
	"source" varchar(100),
	"status" varchar(50) DEFAULT 'New' NOT NULL,
	"score" integer DEFAULT 0,
	"estimated_value" numeric(12, 2) DEFAULT '0',
	"industry" varchar(255),
	"notes" text,
	"assigned_to" varchar(255),
	"last_contacted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "project_milestones" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"project_id" varchar(255) NOT NULL,
	"label" varchar(255) NOT NULL,
	"sub_label" varchar(255),
	"state" varchar(50) DEFAULT 'upcoming' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_team" (
	"project_id" varchar(255) NOT NULL,
	"employee_id" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"client_id" varchar(255),
	"start_date" timestamp,
	"deadline" timestamp,
	"progress" integer DEFAULT 0,
	"budget" numeric(12, 2) DEFAULT '0',
	"status" varchar(50) DEFAULT 'Draft' NOT NULL,
	"description" varchar(2000),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"project_id" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"status" varchar(50) DEFAULT 'todo' NOT NULL,
	"priority" varchar(20) DEFAULT 'medium' NOT NULL,
	"due_date" timestamp,
	"assignee_id" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"project_id" varchar(255),
	"client_id" varchar(255),
	"issue_date" timestamp,
	"due_date" timestamp,
	"amount" numeric(12, 2) DEFAULT '0',
	"tax" numeric(12, 2) DEFAULT '0',
	"status" varchar(50) DEFAULT 'Draft' NOT NULL,
	"billing_address" text,
	"receipt_id" varchar(255),
	"line_items" jsonb DEFAULT '[]' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "receipts" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"invoice_id" varchar(255),
	"amount" numeric(12, 2) DEFAULT '0',
	"payment_method" varchar(50),
	"transaction_ref" varchar(255),
	"date" timestamp DEFAULT now(),
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "attendance_records" ADD CONSTRAINT "attendance_records_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "candidates" ADD CONSTRAINT "candidates_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "candidates" ADD CONSTRAINT "candidates_referred_by_employees_id_fk" FOREIGN KEY ("referred_by") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "candidates" ADD CONSTRAINT "candidates_assigned_to_id_employees_id_fk" FOREIGN KEY ("assigned_to_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employees" ADD CONSTRAINT "employees_reporting_to_id_employees_id_fk" FOREIGN KEY ("reporting_to_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interviewers" ADD CONSTRAINT "interviewers_interview_id_interviews_id_fk" FOREIGN KEY ("interview_id") REFERENCES "public"."interviews"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interviewers" ADD CONSTRAINT "interviewers_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interviews" ADD CONSTRAINT "interviews_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interviews" ADD CONSTRAINT "interviews_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scorecards" ADD CONSTRAINT "scorecards_interview_id_interviews_id_fk" FOREIGN KEY ("interview_id") REFERENCES "public"."interviews"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scorecards" ADD CONSTRAINT "scorecards_evaluator_id_employees_id_fk" FOREIGN KEY ("evaluator_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_hiring_manager_id_employees_id_fk" FOREIGN KEY ("hiring_manager_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leave_policies" ADD CONSTRAINT "leave_policies_leave_type_id_leave_types_id_fk" FOREIGN KEY ("leave_type_id") REFERENCES "public"."leave_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leave_balances" ADD CONSTRAINT "leave_balances_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leave_balances" ADD CONSTRAINT "leave_balances_leave_type_id_leave_types_id_fk" FOREIGN KEY ("leave_type_id") REFERENCES "public"."leave_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_leave_type_id_leave_types_id_fk" FOREIGN KEY ("leave_type_id") REFERENCES "public"."leave_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_approved_by_employees_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "onboarding_plans" ADD CONSTRAINT "onboarding_plans_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "onboarding_plans" ADD CONSTRAINT "onboarding_plans_mentor_id_employees_id_fk" FOREIGN KEY ("mentor_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "onboarding_tasks" ADD CONSTRAINT "onboarding_tasks_plan_id_onboarding_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."onboarding_plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "onboarding_tasks" ADD CONSTRAINT "onboarding_tasks_owner_id_employees_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "structure_allowances" ADD CONSTRAINT "structure_allowances_structure_id_salary_structures_id_fk" FOREIGN KEY ("structure_id") REFERENCES "public"."salary_structures"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "structure_allowances" ADD CONSTRAINT "structure_allowances_allowance_type_id_allowance_types_id_fk" FOREIGN KEY ("allowance_type_id") REFERENCES "public"."allowance_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payroll_batches" ADD CONSTRAINT "payroll_batches_processed_by_employees_id_fk" FOREIGN KEY ("processed_by") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payroll_items" ADD CONSTRAINT "payroll_items_batch_id_payroll_batches_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."payroll_batches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payroll_items" ADD CONSTRAINT "payroll_items_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payroll_items" ADD CONSTRAINT "payroll_items_structure_id_salary_structures_id_fk" FOREIGN KEY ("structure_id") REFERENCES "public"."salary_structures"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "key_results" ADD CONSTRAINT "key_results_goal_id_performance_goals_id_fk" FOREIGN KEY ("goal_id") REFERENCES "public"."performance_goals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "performance_goals" ADD CONSTRAINT "performance_goals_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shift_assignments" ADD CONSTRAINT "shift_assignments_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shift_assignments" ADD CONSTRAINT "shift_assignments_shift_id_shifts_id_fk" FOREIGN KEY ("shift_id") REFERENCES "public"."shifts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shift_swaps" ADD CONSTRAINT "shift_swaps_requesting_employee_id_employees_id_fk" FOREIGN KEY ("requesting_employee_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shift_swaps" ADD CONSTRAINT "shift_swaps_target_employee_id_employees_id_fk" FOREIGN KEY ("target_employee_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shift_swaps" ADD CONSTRAINT "shift_swaps_original_shift_assignment_id_shift_assignments_id_fk" FOREIGN KEY ("original_shift_assignment_id") REFERENCES "public"."shift_assignments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shift_swaps" ADD CONSTRAINT "shift_swaps_target_shift_assignment_id_shift_assignments_id_fk" FOREIGN KEY ("target_shift_assignment_id") REFERENCES "public"."shift_assignments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shift_swaps" ADD CONSTRAINT "shift_swaps_approved_by_employees_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certifications" ADD CONSTRAINT "certifications_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employee_skills" ADD CONSTRAINT "employee_skills_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employee_skills" ADD CONSTRAINT "employee_skills_assessed_by_employees_id_fk" FOREIGN KEY ("assessed_by") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_milestones" ADD CONSTRAINT "project_milestones_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_team" ADD CONSTRAINT "project_team_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_team" ADD CONSTRAINT "project_team_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assignee_id_employees_id_fk" FOREIGN KEY ("assignee_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "receipts" ADD CONSTRAINT "receipts_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE no action ON UPDATE no action;