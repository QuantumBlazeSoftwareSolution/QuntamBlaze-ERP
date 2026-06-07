"use server";

import { employeesCrud } from "@/lib/db/crud/employees";
import { revalidatePath } from "next/cache";
import { incrementAndGet } from "@/lib/db/idTracker";

import { db } from "@/lib/db";
import {
  candidates as candidatesTable,
  jobs as jobsTable,
  employees as employeesTable,
  departments as departmentsTable,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { MOCK_JOBS, MOCK_CANDIDATES } from "@/lib/mockData/hr";

function getDeptIdFromCode(code: string): string {
  const normalized = (code || "").toUpperCase().trim();
  switch (normalized) {
    case "ENGINEERING":
      return "dept-eng";
    case "DESIGN":
      return "dept-des";
    case "PRODUCT":
      return "dept-prd";
    case "MARKETING":
      return "dept-mkt";
    case "SALES":
      return "dept-sls";
    case "HR":
    case "HUMAN RESOURCES":
      return "dept-hr";
    case "FINANCE":
      return "dept-fin";
    default:
      return "dept-oth";
  }
}

export async function createEmployeeAction(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nic: string;
  role: string;
  employeeRole: string;
  department: string;
}) {
  try {
    const { firstName, lastName, email, phone, nic, role, employeeRole, department } = data;

    if (!firstName || !lastName || !email) {
      return { success: false, error: "First Name, Last Name, and Email are required." };
    }

    const name = `${firstName} ${lastName}`;

    // Generate formatted ID: EMP-DEPT-YY-SEQ
    const deptCode =
      department
        .toUpperCase()
        .replace(/[^A-Z]/g, "")
        .substring(0, 3) || "GEN";
    const year = new Date().getFullYear().toString().substring(2);

    const seq = await incrementAndGet(`EMP_${deptCode}_${year}`, `EMP-${deptCode}-${year}`);
    const id = `EMP-${deptCode}-${year}-${seq.toString().padStart(3, "0")}`;

    await employeesCrud.create({
      id,
      firstName,
      lastName,
      name,
      email,
      phone,
      nic,
      role,
      employeeRole,
      departmentId: getDeptIdFromCode(department),
      status: "Active",
      joinDate: new Date(),
    });

    revalidatePath("/dashboard/hr/employees");
    return { success: true, employeeId: id };
  } catch (error: any) {
    console.error("Failed to create employee:", error);
    // Handle unique constraint violations
    if (error.code === "23505") {
      return { success: false, error: "An employee with this email already exists." };
    }
    return { success: false, error: error.message || "Failed to add new employee." };
  }
}

export async function updateEmployeeAction(
  id: string,
  data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    nic: string;
    role: string;
    employeeRole: string;
    department: string;
    status?: string;
    address?: string;
    birthDate?: string | Date | null;
    joinDate?: string | Date | null;
  }
) {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      nic,
      role,
      employeeRole,
      department,
      status,
      address,
      birthDate,
      joinDate,
    } = data;

    if (!id) {
      return { success: false, error: "Employee ID is required." };
    }

    if (!firstName || !lastName || !email) {
      return { success: false, error: "First Name, Last Name, and Email are required." };
    }

    const name = `${firstName} ${lastName}`;

    // Calculate dynamic profile health score based on completeness of 10 fields
    const healthFields = [
      firstName,
      lastName,
      email,
      phone,
      nic,
      role,
      employeeRole,
      department,
      address,
      birthDate,
    ];
    const filledCount = healthFields.filter(
      (f) => f !== undefined && f !== null && String(f).trim() !== ""
    ).length;
    const profileHealth = Math.round((filledCount / healthFields.length) * 100);

    // Format dates safely if present
    const formattedBirthDate = birthDate ? new Date(birthDate) : null;
    const formattedJoinDate = joinDate ? new Date(joinDate) : null;

    await employeesCrud.update(id, {
      firstName,
      lastName,
      name,
      email,
      phone,
      nic,
      role,
      employeeRole,
      departmentId: getDeptIdFromCode(department),
      status: status || "Active",
      address: address || null,
      birthDate: formattedBirthDate,
      joinDate: formattedJoinDate,
      profileHealth,
    });

    revalidatePath("/dashboard/hr/employees");
    revalidatePath(`/dashboard/hr/employees/${id}`);

    return { success: true };
  } catch (error: any) {
    console.error("Failed to update employee:", error);
    if (error.code === "23505") {
      return { success: false, error: "An employee with this email already exists." };
    }
    return { success: false, error: error.message || "Failed to update employee profile." };
  }
}

// ─── RECRUITMENT SERVER ACTIONS ──────────────────────────────────────────────

export async function getRecruitmentDashboardDataAction() {
  try {
    // 1. Fetch current jobs in DB
    let dbJobs = await db
      .select({
        id: jobsTable.id,
        title: jobsTable.title,
        department: jobsTable.department,
        employmentType: jobsTable.employmentType,
        seniorityLevel: jobsTable.seniorityLevel,
        workLocationType: jobsTable.workLocationType,
        city: jobsTable.city,
        salaryMin: jobsTable.salaryMin,
        salaryMax: jobsTable.salaryMax,
        currency: jobsTable.currency,
        openings: jobsTable.openings,
        description: jobsTable.description,
        status: jobsTable.status,
        hiringManagerId: jobsTable.hiringManagerId,
        hiringManagerName: employeesTable.name,
      })
      .from(jobsTable)
      .leftJoin(employeesTable, eq(jobsTable.hiringManagerId, employeesTable.id));

    // 2. Fetch candidates in DB
    let dbCandidates = await db
      .select({
        id: candidatesTable.id,
        jobId: candidatesTable.jobId,
        firstName: candidatesTable.firstName,
        lastName: candidatesTable.lastName,
        email: candidatesTable.email,
        phone: candidatesTable.phone,
        source: candidatesTable.source,
        currentStage: candidatesTable.currentStage,
        referredBy: candidatesTable.referredBy,
        notes: candidatesTable.notes,
        expectedSalary: candidatesTable.expectedSalary,
        noticePeriodDays: candidatesTable.noticePeriodDays,
        assignedToId: candidatesTable.assignedToId,
        assigneeName: employeesTable.name,
      })
      .from(candidatesTable)
      .leftJoin(employeesTable, eq(candidatesTable.assignedToId, employeesTable.id));

    // 3. Auto-seed if database is empty (no jobs)
    if (dbJobs.length === 0) {
      console.log(
        "🌱 Database recruitment tables are empty. Auto-seeding mock jobs & candidates..."
      );

      // Get all employee IDs currently in the DB to prevent foreign key errors
      const currentEmployees = await db.select({ id: employeesTable.id }).from(employeesTable);
      const activeEmployeeIds = new Set(currentEmployees.map((e) => e.id));

      // Seed Jobs
      const jobsToInsert = MOCK_JOBS.map((j) => {
        const hmId = j.hiringManager?.id;
        return {
          id: j.id,
          title: j.title,
          department: j.department as any,
          employmentType: j.employmentType as any,
          seniorityLevel: j.seniorityLevel as any,
          workLocationType: j.locationType as any,
          city: j.city || null,
          hiringManagerId: hmId && activeEmployeeIds.has(hmId) ? hmId : null,
          status: j.status as any,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      });
      await db.insert(jobsTable).values(jobsToInsert).onConflictDoNothing();

      // Seed Candidates
      const candidatesToInsert = MOCK_CANDIDATES.map((c) => {
        const parts = c.name.split(" ");
        const firstName = parts[0] || "Unknown";
        const lastName = parts.slice(1).join(" ") || "Candidate";
        const assignedId = c.assignee?.id;

        return {
          id: c.id,
          jobId: c.jobId,
          firstName,
          lastName,
          email: c.email,
          source: c.source as any,
          currentStage: c.currentStage as any,
          assignedToId: assignedId && activeEmployeeIds.has(assignedId) ? assignedId : null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      });
      await db.insert(candidatesTable).values(candidatesToInsert).onConflictDoNothing();

      // Re-fetch now that database has been populated
      dbJobs = await db
        .select({
          id: jobsTable.id,
          title: jobsTable.title,
          department: jobsTable.department,
          employmentType: jobsTable.employmentType,
          seniorityLevel: jobsTable.seniorityLevel,
          workLocationType: jobsTable.workLocationType,
          city: jobsTable.city,
          salaryMin: jobsTable.salaryMin,
          salaryMax: jobsTable.salaryMax,
          currency: jobsTable.currency,
          openings: jobsTable.openings,
          description: jobsTable.description,
          status: jobsTable.status,
          hiringManagerId: jobsTable.hiringManagerId,
          hiringManagerName: employeesTable.name,
        })
        .from(jobsTable)
        .leftJoin(employeesTable, eq(jobsTable.hiringManagerId, employeesTable.id));

      dbCandidates = await db
        .select({
          id: candidatesTable.id,
          jobId: candidatesTable.jobId,
          firstName: candidatesTable.firstName,
          lastName: candidatesTable.lastName,
          email: candidatesTable.email,
          phone: candidatesTable.phone,
          source: candidatesTable.source,
          currentStage: candidatesTable.currentStage,
          referredBy: candidatesTable.referredBy,
          notes: candidatesTable.notes,
          expectedSalary: candidatesTable.expectedSalary,
          noticePeriodDays: candidatesTable.noticePeriodDays,
          assignedToId: candidatesTable.assignedToId,
          assigneeName: employeesTable.name,
        })
        .from(candidatesTable)
        .leftJoin(employeesTable, eq(candidatesTable.assignedToId, employeesTable.id));
    }

    // 4. Format jobs to match front-end Job interface
    const formattedJobs = dbJobs.map((j) => {
      // Calculate how many candidates are in the pipeline for this specific job
      const pipelineCount = dbCandidates.filter((c) => c.jobId === j.id).length;
      return {
        id: j.id,
        title: j.title,
        department: j.department,
        employmentType: j.employmentType,
        seniorityLevel: j.seniorityLevel,
        locationType: j.workLocationType,
        city: j.city || undefined,
        pipelineCount,
        postedDate: new Date().toISOString().split("T")[0],
        status: j.status,
        hiringManager: j.hiringManagerId
          ? { id: j.hiringManagerId, name: j.hiringManagerName || "Unknown Manager" }
          : undefined,
      };
    });

    // 5. Format candidates to match front-end Candidate interface
    const formattedCandidates = dbCandidates.map((c) => ({
      id: c.id,
      jobId: c.jobId || "",
      name: `${c.firstName} ${c.lastName}`,
      email: c.email,
      phone: c.phone || undefined,
      source: c.source,
      currentStage: c.currentStage,
      expectedSalary: c.expectedSalary || undefined,
      noticePeriodDays: c.noticePeriodDays || undefined,
      assignee: c.assignedToId
        ? { id: c.assignedToId, name: c.assigneeName || "Unknown Recruiter" }
        : undefined,
      daysInStage: 1,
    }));

    // 6. Get active employees to populate dropdown selections
    const activeEmployees = await db
      .select({
        id: employeesTable.id,
        name: employeesTable.name,
        email: employeesTable.email,
        role: employeesTable.role,
        department: departmentsTable.code,
      })
      .from(employeesTable)
      .leftJoin(departmentsTable, eq(employeesTable.departmentId, departmentsTable.id))
      .where(eq(employeesTable.status, "Active"));

    const formattedEmployees = activeEmployees.map((emp) => ({
      id: emp.id,
      name: emp.name,
      email: emp.email || undefined,
      role: emp.role || "Employee",
      department: (emp.department as any) || "HR",
      status: "Active" as const,
      joinDate: new Date().toISOString(),
    }));

    return {
      success: true,
      jobs: formattedJobs,
      candidates: formattedCandidates,
      employees: formattedEmployees,
    };
  } catch (error: any) {
    console.error("Failed to load recruitment data:", error);
    return { success: false, error: error.message || "Failed to load recruitment dashboard data." };
  }
}

export async function createCandidateAction(data: {
  jobId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  source: string;
  currentStage?: string;
  referredById?: string;
  assignedToId?: string;
  expectedSalary?: number;
  noticePeriodDays?: number;
  notes?: string;
}) {
  try {
    const {
      jobId,
      firstName,
      lastName,
      email,
      phone,
      source,
      currentStage = "Applied",
      referredById,
      assignedToId,
      expectedSalary,
      noticePeriodDays,
      notes,
    } = data;

    if (!jobId || !firstName || !lastName || !email || !source) {
      return {
        success: false,
        error: "Missing required fields (First/Last Name, Email, Job, and Source are required).",
      };
    }

    // Generate formatted ID: CND-YY-Seq (e.g. CND-26-001)
    const year = new Date().getFullYear().toString().substring(2);
    const seq = await incrementAndGet(`CND_${year}`, `CND-${year}`);
    const candidateId = `CND-${year}-${seq.toString().padStart(3, "0")}`;

    await db.insert(candidatesTable).values({
      id: candidateId,
      jobId,
      firstName,
      lastName,
      email,
      phone: phone || null,
      source: source as any,
      currentStage: currentStage as any,
      referredBy: referredById || null,
      assignedToId: assignedToId || null,
      expectedSalary: expectedSalary ? Math.round(expectedSalary * 100) : null, // Convert to cents
      noticePeriodDays: noticePeriodDays || null,
      notes: notes || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    revalidatePath("/dashboard/hr/recruitment");
    return { success: true, candidateId };
  } catch (error: any) {
    console.error("Failed to create candidate:", error);
    return { success: false, error: error.message || "Failed to add new candidate." };
  }
}

export async function updateCandidateStageAction(candidateId: string, stage: string) {
  try {
    if (!candidateId || !stage) {
      return { success: false, error: "Candidate ID and new stage are required." };
    }

    await db
      .update(candidatesTable)
      .set({
        currentStage: stage as any,
        updatedAt: new Date(),
      })
      .where(eq(candidatesTable.id, candidateId));

    revalidatePath("/dashboard/hr/recruitment");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update candidate stage:", error);
    return { success: false, error: error.message || "Failed to update pipeline stage." };
  }
}

export async function createJobAction(data: {
  title: string;
  department: string;
  employmentType: string;
  seniorityLevel: string;
  workLocationType: string;
  city?: string;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  openings?: number;
  description?: string;
  hiringManagerId?: string;
}) {
  try {
    const {
      title,
      department,
      employmentType,
      seniorityLevel,
      workLocationType,
      city,
      salaryMin,
      salaryMax,
      currency = "USD",
      openings = 1,
      description,
      hiringManagerId,
    } = data;

    if (!title || !department || !employmentType || !seniorityLevel || !workLocationType) {
      return { success: false, error: "Missing required fields." };
    }

    // Generate formatted ID: JOB-[Dept]-YY-Seq (e.g. JOB-ENG-26-001)
    const deptCode = department.substring(0, 3).toUpperCase();
    const year = new Date().getFullYear().toString().substring(2);
    const seq = await incrementAndGet(`JOB_${deptCode}_${year}`, `JOB-${deptCode}-${year}`);
    const jobId = `JOB-${deptCode}-${year}-${seq.toString().padStart(3, "0")}`;

    await db.insert(jobsTable).values({
      id: jobId,
      title,
      department: department as any,
      employmentType: employmentType as any,
      seniorityLevel: seniorityLevel as any,
      workLocationType: workLocationType as any,
      city: city || null,
      salaryMin: salaryMin ? Math.round(salaryMin * 100) : null,
      salaryMax: salaryMax ? Math.round(salaryMax * 100) : null,
      currency,
      openings: openings || 1,
      description: description || null,
      hiringManagerId: hiringManagerId || null,
      status: "Active",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    revalidatePath("/dashboard/hr/recruitment");
    return { success: true, jobId };
  } catch (error: any) {
    console.error("Failed to create job:", error);
    return { success: false, error: error.message || "Failed to create job opening." };
  }
}

/**
 * Updates the status of a job opening (e.g. Active, Paused, Closed).
 */
export async function updateJobStatusAction(
  jobId: string,
  status: "Active" | "Paused" | "Closed" | "Draft"
) {
  try {
    await db
      .update(jobsTable)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(jobsTable.id, jobId));

    revalidatePath("/dashboard/hr/recruitment");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update job status:", error);
    return { success: false, error: error.message || "Failed to update job status." };
  }
}

export async function getHiredCandidatesAction() {
  try {
    const hired = await db
      .select({
        id: candidatesTable.id,
        firstName: candidatesTable.firstName,
        lastName: candidatesTable.lastName,
        email: candidatesTable.email,
        phone: candidatesTable.phone,
        jobId: candidatesTable.jobId,
        jobTitle: jobsTable.title,
        jobDepartment: jobsTable.department,
      })
      .from(candidatesTable)
      .leftJoin(jobsTable, eq(candidatesTable.jobId, jobsTable.id))
      .where(eq(candidatesTable.currentStage, "Hired"));

    return { success: true, candidates: hired };
  } catch (error: any) {
    console.error("Failed to fetch hired candidates:", error);
    return { success: false, error: error.message || "Failed to fetch hired candidates." };
  }
}

