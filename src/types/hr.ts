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
  | "Rejected" 
  | "Withdrawn";

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: Department;
  status: EmploymentStatus;
  joinDate: string;
  avatar?: string;
  reportingTo?: string;
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
  type: "New Hire" | "Promotion" | "Leave Approved" | "Interview Scheduled" | "Payslip Generated" | "Resignation Submitted";
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
