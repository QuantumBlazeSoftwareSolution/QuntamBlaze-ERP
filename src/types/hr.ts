export type Department =
  | "Engineering"
  | "Finance"
  | "Design"
  | "Marketing"
  | "Operations"
  | "HR"
  | "Sales";

export type EmploymentStatus = "Active" | "Probation" | "Notice" | "Terminated" | "Contract";

export type LeaveType =
  | "Annual"
  | "Sick"
  | "Casual"
  | "Maternity"
  | "Paternity"
  | "Unpaid"
  | "Lieu";

export type PipelineStage =
  | "Applied"
  | "Screening"
  | "Technical"
  | "Final"
  | "Offer"
  | "Hired"
  | "Rejected"
  | "Withdrawn";

export type SeniorityLevel = "Junior" | "Mid" | "Senior" | "Lead" | "Director";
export type JobStatus = "Active" | "Paused" | "Closed" | "Draft";
export type WorkLocationType = "Remote" | "Hybrid" | "On-Site";

export interface Job {
  id: string; // JOB-ENG-26-012
  title: string;
  department: Department;
  employmentType: string;
  seniorityLevel: SeniorityLevel;
  locationType: WorkLocationType;
  city?: string;
  pipelineCount: number;
  postedDate: string;
  status: JobStatus;
  hiringManager?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface Candidate {
  id: string; // CND-26-089
  jobId: string;
  name: string;
  email: string;
  phone?: string;
  source: string;
  currentStage: PipelineStage;
  score?: number;
  nextInterviewDate?: string;
  daysInStage: number;
  assignee?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface Employee {
  id: string;
  firstName?: string;
  lastName?: string;
  employeeRole?: string;
  name: string;
  role: string;
  department: Department;
  status: EmploymentStatus;
  joinDate: string;
  avatar?: string;
  email?: string;
  phone?: string;
  address?: string;
  nic?: string;
  bankDetails?: {
    bank: string;
    accountName: string;
    accountNumber: string;
    branch: string;
  };
  reportingTo?: { id: string; name: string };
  profileHealth?: number;
  assets?: string[];
  birthDate?: string;
  probationEnd?: string;
}

export interface HRStat {
  label: string;
  value: string | number;
  trend?: string;
  trendType?: "up" | "down";
  icon: string;
  colorFamily: string;
}

export interface HRActivity {
  id: string;
  type:
    | "New Hire"
    | "Promotion"
    | "Leave Approved"
    | "Interview Scheduled"
    | "Payslip Generated"
    | "Resignation Submitted";
  description: string;
  timestamp: string;
  entities: string[]; // IDs like EMP-ID, LEV-ID
}

export interface HRAlert {
  id: string;
  type: "Contract Expiry" | "Probation Review" | "Leave Balance" | "Document Expiry";
  message: string;
  color: "amber" | "blue" | "red" | "orange";
  entityId: string;
}
