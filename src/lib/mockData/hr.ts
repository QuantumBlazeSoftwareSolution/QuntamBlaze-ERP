import { Employee, HRActivity, HRAlert, Job, Candidate } from "@/types/hr";

export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: "EMP-ENG-26-001",
    name: "Alex Mercer",
    role: "Senior Software Engineer",
    department: "Engineering",
    status: "Active",
    joinDate: "2023-01-15",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop",
  },
  {
    id: "EMP-HR-26-004",
    name: "Sarah Jenkins",
    role: "HR Manager",
    department: "HR",
    status: "Active",
    joinDate: "2023-03-22",
  },
  {
    id: "EMP-FIN-26-009",
    name: "James Wilson",
    role: "Financial Analyst",
    department: "Finance",
    status: "Probation",
    joinDate: "2024-01-10",
  }
];

export const MOCK_JOBS: Job[] = [
  {
    id: "JOB-ENG-26-012",
    title: "Senior Full Stack Developer",
    department: "Engineering",
    employmentType: "Full-Time",
    seniorityLevel: "Senior",
    locationType: "Remote",
    pipelineCount: 18,
    postedDate: "2024-04-15",
    status: "Active",
    hiringManager: { id: "EMP-ENG-26-001", name: "Alex Mercer" },
  },
  {
    id: "JOB-DES-26-005",
    title: "Lead UI/UX Designer",
    department: "Design",
    employmentType: "Full-Time",
    seniorityLevel: "Lead",
    locationType: "Hybrid",
    city: "Colombo",
    pipelineCount: 7,
    postedDate: "2024-05-01",
    status: "Active",
    hiringManager: { id: "EMP-HR-26-004", name: "Sarah Jenkins" },
  }
];

export const MOCK_CANDIDATES: Candidate[] = [
  {
    id: "CND-26-089",
    jobId: "JOB-ENG-26-012",
    name: "Samantha Reed",
    email: "samantha.r@gmail.com",
    source: "LinkedIn",
    currentStage: "Technical",
    score: 85,
    nextInterviewDate: "2024-05-12",
    daysInStage: 3,
    assignee: { id: "EMP-ENG-26-001", name: "Alex Mercer" },
  },
  {
    id: "CND-26-104",
    jobId: "JOB-ENG-26-012",
    name: "Marcus Thorne",
    email: "m.thorne@outlook.com",
    source: "Referral",
    currentStage: "Applied",
    daysInStage: 1,
  },
  {
    id: "CND-26-092",
    jobId: "JOB-DES-26-005",
    name: "Elena Vance",
    email: "elena.vance@blackmesa.com",
    source: "Direct",
    currentStage: "Screening",
    score: 92,
    nextInterviewDate: "2024-05-11",
    daysInStage: 5,
  }
];

export const HR_DASHBOARD_STATS = [
  { label: "Total Headcount", value: 124, trend: "↑ 3 this month", trendType: "up", icon: "Users", colorFamily: "teal" },
  { label: "Open Positions", value: 12, trend: "8 active JOB-IDs", trendType: "up", icon: "Briefcase", colorFamily: "blue" },
  { label: "In Pipeline", value: 47, trend: "active CND-IDs", trendType: "up", icon: "UserPlus", colorFamily: "violet" },
  { label: "New Hires (30d)", value: 5, trend: "last 30 days", trendType: "up", icon: "UserCheck", colorFamily: "green" },
  { label: "Attendance Rate", value: "98.2%", trend: "↑ 0.5%", trendType: "up", icon: "Clock", colorFamily: "teal" },
  { label: "Pending Leaves", value: 8, trend: "LEV- awaiting approval", trendType: "down", icon: "CalendarOff", colorFamily: "amber" },
  { label: "Payroll This Month", value: "$420,500", trend: "PAY- run value", trendType: "up", icon: "Wallet", colorFamily: "blue" },
  { label: "Attrition Rate", value: "2.4%", trend: "↓ vs last quarter", trendType: "down", icon: "TrendingDown", colorFamily: "red" },
];

export const DEPT_HEADCOUNT_DATA = [
  { name: "Engineering", count: 45, color: "#3B82F6" },
  { name: "Finance", count: 12, color: "#F59E0B" },
  { name: "Design", count: 18, color: "#8B5CF6" },
  { name: "Marketing", count: 15, color: "#EC4899" },
  { name: "Operations", count: 22, color: "#10B981" },
  { name: "HR", count: 6, color: "#06B6D4" },
  { name: "Sales", count: 20, color: "#EF4444" },
];

export const HIRING_FUNNEL_DATA = [
  { stage: "Applied", value: 450 },
  { stage: "Screening", value: 120 },
  { stage: "Technical", value: 45 },
  { stage: "Final", value: 12 },
  { stage: "Offer", value: 5 },
];

export const ATTENDANCE_TREND_DATA = Array.from({ length: 30 }).map((_, i) => ({
  day: i + 1,
  rate: 94 + Math.random() * 5,
}));

export const PAYROLL_TREND_DATA = Array.from({ length: 12 }).map((_, i) => ({
  month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
  gross: 380000 + Math.random() * 50000,
  net: 320000 + Math.random() * 40000,
}));

export const MOCK_HR_ACTIVITIES: HRActivity[] = [
  {
    id: "act-1",
    type: "New Hire",
    description: "New employee Alex Mercer joined as Senior Software Engineer",
    timestamp: "2 hours ago",
    entities: ["EMP-ENG-26-001"],
  },
  {
    id: "act-2",
    type: "Leave Approved",
    description: "Annual leave approved for Sarah Jenkins",
    timestamp: "5 hours ago",
    entities: ["LEV-EMP-HR-26-004-012"],
  }
];

export const MOCK_HR_ALERTS: HRAlert[] = [
  {
    id: "al-1",
    type: "Contract Expiry",
    message: "Contract for EMP-ENG-26-042 expires in 15 days.",
    color: "amber",
    entityId: "EMP-ENG-26-042",
  },
  {
    id: "al-2",
    type: "Probation Review",
    message: "Probation review due for EMP-FIN-26-009.",
    color: "blue",
    entityId: "EMP-FIN-26-009",
  }
];
